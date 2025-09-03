-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) DEFAULT 'انضم لخدمة المجتمع',
  max_volunteers INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create volunteers table
CREATE TABLE volunteers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  device_fingerprint VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one volunteer per device fingerprint
  UNIQUE(device_fingerprint)
);

-- Create indexes for better performance
CREATE INDEX idx_volunteers_task_id ON volunteers(task_id);
CREATE INDEX idx_volunteers_fingerprint ON volunteers(device_fingerprint);
CREATE INDEX idx_volunteers_created_at ON volunteers(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since we don't have authentication)
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on volunteers" ON volunteers FOR ALL USING (true);

-- Create settings table for app configuration
CREATE TABLE app_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key VARCHAR(255) NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for settings
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on app_settings" ON app_settings FOR ALL USING (true);

-- Insert default settings
INSERT INTO app_settings (key, value) VALUES
  ('fingerprinting_enabled', 'true'::jsonb),
  ('app_title', '"Kids Volunteer Hub"'::jsonb);

-- Insert church service tasks
INSERT INTO tasks (name, subtitle, max_volunteers) VALUES
  ('حضانه', 'يوم الاثنين 6-8 م', 20),
  ('حضانه', 'يوم الجمعه بعد القداس', 10),
  ('اولى وتانيه', 'يوم الاثنين 6- 8 م', 20),
  ('اولى وتانيه', 'يوم الجمعه بعد القداس', 10),
  ('تالته ورابعه', 'الجمعه بعد القداس', 30),
  ('رابعه وخامسه', 'الجمعه بعد القداس', 30),
  ('اعدادي بنين', 'الخميس الساعه 6.00 م الى 8.30 م', 20),
  ('اعدادي بنات', 'الاربعاء من 6 الى 8.30 م', 20),
  ('ثانوي بنين', 'الخميس 7-8.30', 20),
  ('ثانوي بنات', 'الاربعاء 6 -8 م', 20),
  ('شباب جامعه', 'الجمعه 6-8', 10),
  ('اجتماع الرجال', 'الجمعه 8-9.30', 10),
  ('اجتماع السيدات', 'الاثنين 6-8 م', 10),
  ('اجتماع الفلك', 'الاحد 7.30 -9', 10),
  ('بي سيو', 'قدرات فائقه الاحد 6 -7.30', 30),
  ('خدام هوس ايروف', '', 30),
  ('خدام الكشافه', 'حاصلين على إعداد خدام', 30),
  ('خدام اسرة ايوب الصديق', '', 30);