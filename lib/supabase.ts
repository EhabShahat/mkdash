import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Task = {
  id: string
  name: string
  subtitle: string
  max_volunteers: number
  created_at: string
}

export type Volunteer = {
  id: string
  task_id: string
  name: string
  device_fingerprint: string
  created_at: string
}

export type AppSetting = {
  id: string
  key: string
  value: any
  updated_at: string
}