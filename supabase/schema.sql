create table ditorja_frontend (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  article_title text not null,
  article_short text not null,
  article_medium text not null,
  article_large text not null,
  article_image text not null,
  article_category text not null,
  article_hashtags text[] not null,
  author text not null
);

-- Create an index on created_at for better performance when ordering
create index ditorja_frontend_created_at_idx on ditorja_frontend(created_at desc);

-- Create an index on category for better performance when filtering
create index ditorja_frontend_category_idx on ditorja_frontend(article_category);
