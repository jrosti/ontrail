create table if not exists migration_users (
  id uuid primary key default gen_random_uuid(),
  legacy_username text not null unique,
  legacy_email text,
  legacy_password_hash text,
  legacy_object_id char(24) unique,
  hanko_subject text unique,
  ontrail_user_id uuid references users(id),
  state text not null default 'pending'
    check (state in ('pending', 'invited', 'claimed', 'skipped')),
  invited_at timestamptz,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);
