-- 既存のUSERSテーブルを削除（制約なども一緒に削除されます）
DROP TABLE IF EXISTS "USERS" CASCADE;

-- 正しい型でUSERSテーブルを再作成
CREATE TABLE "USERS" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(100) NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE,
  "is_active" BOOLEAN DEFAULT TRUE NOT NULL
);

-- updated_atを更新するトリガーを作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- テーブルにトリガーを追加
DROP TRIGGER IF EXISTS set_updated_at ON "USERS";
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON "USERS"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 