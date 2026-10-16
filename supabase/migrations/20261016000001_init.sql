-- Sites owned by an authenticated user (auth.users is managed by Supabase Auth).
create table public.site (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  domain text not null,
  -- Public collection key embedded in the tracking snippet; it identifies the site, it is not a secret.
  public_key text not null unique,
  created_at timestamptz not null default now()
);

create index site_user_id_idx on public.site (user_id);

-- One row per pageview. No IP, no user-agent: only the derived, anonymous fields below.
create table public.event (
  id text primary key,
  site_id uuid not null references public.site (id) on delete cascade,
  created_at timestamptz not null default now(),
  path text not null,
  referrer_domain text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  device text,
  browser text,
  os text,
  -- Salted daily hash: cannot be linked from one day to the next.
  visitor_hash text not null,
  session_id text not null,
  duration_ms integer
);

create index event_site_id_created_at_idx on public.event (site_id, created_at);

alter table public.site enable row level security;
alter table public.event enable row level security;

create policy "Owners read their sites" on public.site
  for select to authenticated using (user_id = (select auth.uid()));

create policy "Owners create their sites" on public.site
  for insert to authenticated with check (user_id = (select auth.uid()));

create policy "Owners update their sites" on public.site
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "Owners delete their sites" on public.site
  for delete to authenticated using (user_id = (select auth.uid()));

-- Events are only written by /api/collect with the service role, which bypasses RLS.
create policy "Owners read their events" on public.event
  for select to authenticated using (
    exists (select 1 from public.site where site.id = event.site_id and site.user_id = (select auth.uid()))
  );
