-- Aggregations called through supabase.rpc(). They are `security invoker`, so the RLS policies
-- of public.site and public.event decide which rows they can see.

create function public.analytics_totals(
  p_site_id uuid,
  p_from timestamptz,
  p_to timestamptz,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null
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
      and (p_device is null or device = p_device)
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
  p_device text default null
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
        when 'devices' then device
      end as label
    from event
    where site_id = p_site_id
      and created_at >= p_from
      and created_at < p_to
      and (p_page is null or path = p_page)
      and (p_referrer is null or referrer_domain = p_referrer)
      and (p_country is null or country = p_country)
      and (p_device is null or device = p_device)
  ) as ranked
  where ranked.label is not null
  group by ranked.label
  order by visitors desc
  limit least(greatest(p_limit, 1), 50);
$$;

-- Bucket starts are UTC, formatted like the JS `bucketDates` helper.
create function public.analytics_timeseries(
  p_site_id uuid,
  p_unit text,
  p_from timestamptz,
  p_to timestamptz,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null
)
returns table (bucket text, visitors integer, pageviews integer)
language sql
stable
security invoker
set search_path = public
as $$
  select
    to_char(date_trunc(p_unit, created_at at time zone 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as bucket,
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
    and (p_device is null or device = p_device)
  group by 1
  order by 1;
$$;

-- Per-site totals over [p_previous_from, p_to): current period starts at p_from.
create function public.analytics_sites_totals(
  p_site_ids uuid[],
  p_previous_from timestamptz,
  p_from timestamptz,
  p_to timestamptz
)
returns table (site_id uuid, visitors integer, pageviews integer, previous_visitors integer)
language sql
stable
security invoker
set search_path = public
as $$
  select
    site_id,
    (count(distinct visitor_hash) filter (where created_at >= p_from))::integer,
    (count(*) filter (where created_at >= p_from))::integer,
    (count(distinct visitor_hash) filter (where created_at < p_from))::integer
  from event
  where site_id = any (p_site_ids)
    and created_at >= p_previous_from
    and created_at < p_to
  group by site_id;
$$;

create function public.analytics_sites_series(
  p_site_ids uuid[],
  p_unit text,
  p_from timestamptz,
  p_to timestamptz
)
returns table (site_id uuid, bucket text, visitors integer, pageviews integer)
language sql
stable
security invoker
set search_path = public
as $$
  select
    site_id,
    to_char(date_trunc(p_unit, created_at at time zone 'UTC'), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as bucket,
    count(distinct visitor_hash)::integer,
    count(*)::integer
  from event
  where site_id = any (p_site_ids)
    and p_unit in ('hour', 'day')
    and created_at >= p_from
    and created_at < p_to
  group by site_id, 2;
$$;
