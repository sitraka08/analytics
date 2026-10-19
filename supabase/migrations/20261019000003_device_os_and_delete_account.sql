-- Device rows now carry the operating system: the "device" dimension and filter use the composite
-- value "<type>:<os>" (e.g. "desktop:Windows"). Timeseries buckets can be computed in a time zone.

create or replace function public.analytics_totals(
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
      and (p_device is null or device || ':' || coalesce(os, '') = p_device)
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

create or replace function public.analytics_ranking(
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
  ) as ranked
  where ranked.label is not null
  group by ranked.label
  order by visitors desc
  limit least(greatest(p_limit, 1), 50);
$$;

-- The signature changes (new p_tz), so the old function is dropped to avoid an ambiguous overload.
drop function public.analytics_timeseries(uuid, text, timestamptz, timestamptz, text, text, text, text);

-- Buckets start in p_tz and are returned as the UTC instant of the bucket start.
create function public.analytics_timeseries(
  p_site_id uuid,
  p_unit text,
  p_from timestamptz,
  p_to timestamptz,
  p_page text default null,
  p_referrer text default null,
  p_country text default null,
  p_device text default null,
  p_tz text default 'UTC'
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
  group by 1
  order by 1;
$$;

-- Lets a signed-in user delete their own account; sites and events follow through `on delete cascade`.
-- Deliberately executable by `authenticated` (and only by it): it can only ever touch auth.uid().
create function public.delete_my_account()
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.users where id = (select auth.uid());
$$;

revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
