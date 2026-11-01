-- Aggregations called from the analytics services. Without row-level security, each function takes the
-- caller's `p_user_id` and only reads events of sites that user owns; the services' ownership check stays.
-- The "device" dimension and filter use the composite value "<type>:<os>" (e.g. "desktop:Windows").

create function analytics_totals(
  p_user_id text,
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
as $$
  with filtered as (
    select e.visitor_hash, e.session_id, e.duration_ms
    from event e
  join site s on s.id = e.site_id and s.user_id = p_user_id
    where e.site_id = p_site_id
      and e.created_at >= p_from
      and e.created_at < p_to
      and (p_page is null or e.path = p_page)
      and (p_referrer is null or e.referrer_domain = p_referrer)
      and (p_country is null or e.country = p_country)
      and (p_device is null or e.device || ':' || coalesce(e.os, '') = p_device)
      and (p_city is null or e.city = p_city)
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
--> statement-breakpoint

create function analytics_ranking(
  p_user_id text,
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
as $$
  select
    ranked.label,
    count(distinct ranked.visitor_hash)::integer as visitors
  from (
    select
      e.visitor_hash,
      case p_dimension
        when 'pages' then e.path
        when 'referrers' then e.referrer_domain
        when 'countries' then e.country
        when 'cities' then e.city
        when 'devices' then e.device || ':' || coalesce(e.os, '')
      end as label
    from event e
  join site s on s.id = e.site_id and s.user_id = p_user_id
    where e.site_id = p_site_id
      and e.created_at >= p_from
      and e.created_at < p_to
      and (p_page is null or e.path = p_page)
      and (p_referrer is null or e.referrer_domain = p_referrer)
      and (p_country is null or e.country = p_country)
      and (p_device is null or e.device || ':' || coalesce(e.os, '') = p_device)
      and (p_city is null or e.city = p_city)
  ) as ranked
  where ranked.label is not null
  group by ranked.label
  order by visitors desc
  limit least(greatest(p_limit, 1), 50);
$$;
--> statement-breakpoint

-- Buckets start in p_tz and are returned as the UTC instant of the bucket start.
create function analytics_timeseries(
  p_user_id text,
  p_site_id uuid,
  p_unit text,
  p_from timestamptz,
  p_to timestamptz,
  p_tz text default 'UTC',
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null,
  p_city text default null
)
returns table (bucket text, visitors integer, pageviews integer)
language sql
stable
as $$
  select
    to_char(
      (date_trunc(p_unit, e.created_at at time zone p_tz) at time zone p_tz) at time zone 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS"Z"'
    ) as bucket,
    count(distinct e.visitor_hash)::integer,
    count(*)::integer
  from event e
  join site s on s.id = e.site_id and s.user_id = p_user_id
  where e.site_id = p_site_id
    and p_unit in ('hour', 'day')
    and e.created_at >= p_from
    and e.created_at < p_to
    and (p_page is null or e.path = p_page)
    and (p_referrer is null or e.referrer_domain = p_referrer)
    and (p_country is null or e.country = p_country)
    and (p_device is null or e.device || ':' || coalesce(e.os, '') = p_device)
    and (p_city is null or e.city = p_city)
  group by 1
  order by 1;
$$;
--> statement-breakpoint

-- Per-site totals over [p_previous_from, p_to): the current period starts at p_from.
create function analytics_sites_totals(
  p_user_id text,
  p_site_ids uuid[],
  p_previous_from timestamptz,
  p_from timestamptz,
  p_to timestamptz
)
returns table (site_id uuid, visitors integer, pageviews integer, previous_visitors integer)
language sql
stable
as $$
  select
    e.site_id,
    (count(distinct e.visitor_hash) filter (where e.created_at >= p_from))::integer,
    (count(*) filter (where e.created_at >= p_from))::integer,
    (count(distinct e.visitor_hash) filter (where e.created_at < p_from))::integer
  from event e
  join site s on s.id = e.site_id and s.user_id = p_user_id
  where e.site_id = any (p_site_ids)
    and e.created_at >= p_previous_from
    and e.created_at < p_to
  group by e.site_id;
$$;
--> statement-breakpoint

create function analytics_sites_series(
  p_user_id text,
  p_site_ids uuid[],
  p_unit text,
  p_from timestamptz,
  p_to timestamptz
)
returns table (site_id uuid, bucket text, visitors integer, pageviews integer)
language sql
stable
as $$
  select
    e.site_id,
    to_char(date_trunc(p_unit, e.created_at at time zone 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as bucket,
    count(distinct e.visitor_hash)::integer,
    count(*)::integer
  from event e
  join site s on s.id = e.site_id and s.user_id = p_user_id
  where e.site_id = any (p_site_ids)
    and p_unit in ('hour', 'day')
    and e.created_at >= p_from
    and e.created_at < p_to
  group by e.site_id, 2;
$$;
--> statement-breakpoint

-- One row per visit (session), newest first. The place, device and source are those of the visit's
-- first page view. `total_count` is the number of matching visits, repeated on every row, for paging.
create function analytics_sessions(
  p_user_id text,
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
  join site s on s.id = e.site_id and s.user_id = p_user_id
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
--> statement-breakpoint

-- The page views of one visit, in order.
create function analytics_session_events(p_user_id text, p_site_id uuid, p_session_id text)
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
as $$
  select e.created_at, e.path, e.duration_ms, e.referrer_domain, e.utm_source, e.utm_medium, e.utm_campaign,
         e.country, e.region, e.city, e.device, e.browser, e.os
  from event e
  join site s on s.id = e.site_id and s.user_id = p_user_id
  where e.site_id = p_site_id and e.session_id = p_session_id
  order by e.created_at
  limit 200;
$$;
