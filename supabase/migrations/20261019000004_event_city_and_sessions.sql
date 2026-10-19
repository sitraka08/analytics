-- Events now carry the visitor's city and region (from the Vercel edge headers, the IP is never stored).
-- The aggregations gain a city filter and a "cities" ranking, and two functions expose individual visits.

alter table public.event add column city text;
alter table public.event add column region text;

create index event_site_id_session_id_idx on public.event (site_id, session_id);

-- Signatures change (new p_city), so the old functions are dropped to avoid ambiguous overloads.
drop function public.analytics_totals(uuid, timestamptz, timestamptz, text, text, text, text);
drop function public.analytics_ranking(uuid, text, timestamptz, timestamptz, integer, text, text, text, text);
drop function public.analytics_timeseries(uuid, text, timestamptz, timestamptz, text, text, text, text, text);

create function public.analytics_totals(
  p_site_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null,
  p_city text default null
)
returns table (visitors integer, sessions integer, pageviews integer, bounces integer, avg_duration_ms double precision)
language sql
stable
security invoker
set search_path = public
as $$
  with filtered as (
    select visitor_hash, session_id, duration_ms
    from event
    where site_id = p_site_id
      and created_at >= p_from
      and created_at < p_to
      and (p_page is null or path = p_page)
      and (p_referrer is null or referrer_domain = p_referrer)
      and (p_country is null or country = p_country)
      and (p_device is null or device || ':' || coalesce(os, '') = p_device)
      and (p_city is null or city = p_city)
  ),
  per_session as (
    select count(*) as pageviews, sum(duration_ms) as duration_ms
    from filtered
    group by session_id
  )
  select
    (select count(distinct visitor_hash) from filtered)::integer,
    count(*)::integer,
    coalesce(sum(pageviews), 0)::integer,
    (count(*) filter (where pageviews = 1))::integer,
    avg(duration_ms) filter (where duration_ms is not null)::double precision
  from per_session;
$$;

create function public.analytics_ranking(
  p_site_id uuid,
  p_dimension text,
  p_from timestamptz,
  p_to timestamptz,
  p_limit integer default 8,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null,
  p_city text default null
)
returns table (label text, visitors integer)
language sql
stable
security invoker
set search_path = public
as $$
  select
    ranked.label,
    count(distinct ranked.visitor_hash)::integer as visitors
  from (
    select
      visitor_hash,
      case p_dimension
        when 'pages' then path
        when 'referrers' then referrer_domain
        when 'countries' then country
        when 'cities' then city
        when 'devices' then device || ':' || coalesce(os, '')
      end as label
    from event
    where site_id = p_site_id
      and created_at >= p_from
      and created_at < p_to
      and (p_page is null or path = p_page)
      and (p_referrer is null or referrer_domain = p_referrer)
      and (p_country is null or country = p_country)
      and (p_device is null or device || ':' || coalesce(os, '') = p_device)
      and (p_city is null or city = p_city)
  ) as ranked
  where ranked.label is not null
  group by ranked.label
  order by visitors desc
  limit least(greatest(p_limit, 1), 50);
$$;

create function public.analytics_timeseries(
  p_site_id uuid,
  p_unit text,
  p_from timestamptz,
  p_to timestamptz,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null,
  p_tz text default 'UTC',
  p_city text default null
)
returns table (bucket text, visitors integer, pageviews integer)
language sql
stable
security invoker
set search_path = public
as $$
  select
    to_char(
      (date_trunc(p_unit, created_at at time zone p_tz) at time zone p_tz) at time zone 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS"Z"'
    ) as bucket,
    count(distinct visitor_hash)::integer,
    count(*)::integer
  from event
  where site_id = p_site_id
    and p_unit in ('hour', 'day')
    and created_at >= p_from
    and created_at < p_to
    and (p_page is null or path = p_page)
    and (p_referrer is null or referrer_domain = p_referrer)
    and (p_country is null or country = p_country)
    and (p_device is null or device || ':' || coalesce(os, '') = p_device)
    and (p_city is null or city = p_city)
  group by 1
  order by 1;
$$;

-- One row per visit (session), newest first. The place, device and source are those of the visit's
-- first page view. `total_count` is the number of matching visits, repeated on every row, for paging.
create function public.analytics_sessions(
  p_site_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_limit integer default 25,
  p_offset integer default 0,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null,
  p_city text default null
)
returns table (
  session_id text,
  started_at timestamptz,
  country text,
  region text,
  city text,
  device text,
  browser text,
  os text,
  referrer_domain text,
  utm_source text,
  entry_path text,
  pageviews integer,
  duration_ms bigint,
  total_count integer
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    e.session_id,
    min(e.created_at) as started_at,
    (array_agg(e.country order by e.created_at))[1],
    (array_agg(e.region order by e.created_at))[1],
    (array_agg(e.city order by e.created_at))[1],
    (array_agg(e.device order by e.created_at))[1],
    (array_agg(e.browser order by e.created_at))[1],
    (array_agg(e.os order by e.created_at))[1],
    (array_agg(e.referrer_domain order by e.created_at))[1],
    (array_agg(e.utm_source order by e.created_at))[1],
    (array_agg(e.path order by e.created_at))[1],
    count(*)::integer,
    sum(e.duration_ms)::bigint,
    (count(*) over ())::integer
  from event e
  where e.site_id = p_site_id
    and e.created_at >= p_from
    and e.created_at < p_to
    and (p_page is null or e.path = p_page)
    and (p_referrer is null or e.referrer_domain = p_referrer)
    and (p_country is null or e.country = p_country)
    and (p_device is null or e.device || ':' || coalesce(e.os, '') = p_device)
    and (p_city is null or e.city = p_city)
  group by e.session_id
  order by started_at desc
  limit least(greatest(p_limit, 1), 50)
  offset greatest(p_offset, 0);
$$;

-- The page views of one visit, in order.
create function public.analytics_session_events(p_site_id uuid, p_session_id text)
returns table (
  created_at timestamptz,
  path text,
  duration_ms integer,
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  region text,
  city text,
  device text,
  browser text,
  os text
)
language sql
stable
security invoker
set search_path = public
as $$
  select created_at, path, duration_ms, referrer_domain, utm_source, utm_medium, utm_campaign,
         country, region, city, device, browser, os
  from event
  where site_id = p_site_id and session_id = p_session_id
  order by created_at
  limit 200;
$$;
