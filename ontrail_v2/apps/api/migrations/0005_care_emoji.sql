-- Add emoji to cares table for reaction support
alter table cares add column if not exists emoji text not null default '❤️';
