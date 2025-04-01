import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    "https://feedlruynztprotufcks.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZWRscnV5bnp0cHJvdHVmY2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3OTk5ODMsImV4cCI6MjA1NzM3NTk4M30.IpA-doiF2B1VH0V74lD0QKNqsOLZqFmdJB_9clvt13w"
)