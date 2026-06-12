/*
# NexMente — Full Schema

## Summary
Creates all tables required for the NexMente mental health platform:
profiles, mood_entries, diary_entries, posts, comments, support_reactions.

## New Tables

### profiles
Stores public user info (name, avatar). Linked 1-to-1 with auth.users.
- id (uuid, PK, FK auth.users)
- nome (text)
- email (text)
- avatar_url (text, nullable)
- is_admin (boolean, default false)
- created_at (timestamptz)

### mood_entries
Daily mood check-ins per user.
- id (uuid, PK)
- user_id (uuid, FK profiles, DEFAULT auth.uid())
- mood (text: 'very_good' | 'good' | 'neutral' | 'sad' | 'very_sad')
- note (text, nullable)
- created_at (timestamptz)

### diary_entries
Private emotional journal entries.
- id (uuid, PK)
- user_id (uuid, FK profiles, DEFAULT auth.uid())
- titulo (text)
- conteudo (text)
- emocao (text)
- created_at (timestamptz)

### posts
Anonymous community desabafos.
- id (uuid, PK)
- user_id (uuid, FK profiles, DEFAULT auth.uid())
- content (text)
- likes_count (int, default 0)
- created_at (timestamptz)

### comments
Comments on community posts.
- id (uuid, PK)
- post_id (uuid, FK posts)
- user_id (uuid, FK profiles, DEFAULT auth.uid())
- content (text)
- created_at (timestamptz)

### support_reactions
"Apoiar" reactions on posts (one per user per post).
- id (uuid, PK)
- post_id (uuid, FK posts)
- user_id (uuid, FK profiles, DEFAULT auth.uid())
- created_at (timestamptz)

## Security
RLS enabled on all tables. Authenticated-only CRUD with owner-scoped policies.
Posts SELECT is open to authenticated so feed is visible to all users.
Comments SELECT is open to authenticated so comments are visible to all users.
Support reactions SELECT is open to authenticated.
Profiles SELECT is open to authenticated so usernames are visible.
*/

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  avatar_url text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- mood_entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  mood text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_moods" ON mood_entries;
CREATE POLICY "select_own_moods" ON mood_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_moods" ON mood_entries;
CREATE POLICY "insert_own_moods" ON mood_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_moods" ON mood_entries;
CREATE POLICY "update_own_moods" ON mood_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_moods" ON mood_entries;
CREATE POLICY "delete_own_moods" ON mood_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- diary_entries
CREATE TABLE IF NOT EXISTS diary_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  conteudo text NOT NULL,
  emocao text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_diary" ON diary_entries;
CREATE POLICY "select_own_diary" ON diary_entries FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_diary" ON diary_entries;
CREATE POLICY "insert_own_diary" ON diary_entries FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_diary" ON diary_entries;
CREATE POLICY "update_own_diary" ON diary_entries FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_diary" ON diary_entries;
CREATE POLICY "delete_own_diary" ON diary_entries FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_posts" ON posts;
CREATE POLICY "select_all_posts" ON posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_posts" ON posts;
CREATE POLICY "insert_own_posts" ON posts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_posts" ON posts;
CREATE POLICY "update_own_posts" ON posts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_posts" ON posts;
CREATE POLICY "delete_own_posts" ON posts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- admin can delete any post
DROP POLICY IF EXISTS "admin_delete_posts" ON posts;
CREATE POLICY "admin_delete_posts" ON posts FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_all_comments" ON comments;
CREATE POLICY "select_all_comments" ON comments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_comments" ON comments;
CREATE POLICY "insert_own_comments" ON comments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_comments" ON comments;
CREATE POLICY "update_own_comments" ON comments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_comments" ON comments;
CREATE POLICY "delete_own_comments" ON comments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_delete_comments" ON comments;
CREATE POLICY "admin_delete_comments" ON comments FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- support_reactions
CREATE TABLE IF NOT EXISTS support_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE support_reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_reactions" ON support_reactions;
CREATE POLICY "select_reactions" ON support_reactions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "insert_reaction" ON support_reactions;
CREATE POLICY "insert_reaction" ON support_reactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reaction" ON support_reactions;
CREATE POLICY "delete_own_reaction" ON support_reactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, nome, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- indexes
CREATE INDEX IF NOT EXISTS mood_entries_user_id_idx ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS mood_entries_created_at_idx ON mood_entries(created_at);
CREATE INDEX IF NOT EXISTS diary_entries_user_id_idx ON diary_entries(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS support_reactions_post_id_idx ON support_reactions(post_id);
