-- Run this in Supabase SQL Editor to create testimonials table

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Customer',
  avatar_url TEXT,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read testimonials" ON testimonials
  FOR SELECT USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Allow admin write testimonials" ON testimonials
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample testimonials
INSERT INTO testimonials (name, role, avatar_url, text, rating) VALUES
('N. Maula', 'Local Guide', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', 'Bagus banget hasil fotonya jernih, murah, aksesoris dan propertinya sangat banyak untuk pendukung foto, tempatnya nyaman, bersih, sejuk, adminnya informatif, parkiran luas, lokasinya juga sangat strategis di pusat kotaa. bakal balik kesini lagi kalau foto. thx', 5),
('Z. Naura', 'Local Guide', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 'kalian kalo bingung foto self studio dimana atau mau sama temn temn keluarga dan pasangan kalian? ini seriuss rekomen bangett karnaa dengan harganya ramah dikantong, tempatnya bagus nyaman dan kameranya hd cerah juga trud pelayanannya ramah dan baik banget, kakanya gercep semua dan ditempatnya juga jualin berbagai jajanan sama minuman enak banget and worth to buyy gaiss, kalo ada bintang 10 aku kasi 10 bintang buat pama studio', 5),
('C. Sherlyna', 'Local Guide', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', 'Keren bgt , hospitality abang² nya juga ramah . Ada Snack sama minuman juga . Buat yang ga pede foto ada musik dlm studionya biar bisa lebih rileks . Ada tempat nongkinya jg adem , bisa smooking juga . Ohyaa parkirannya luas yaa barangkali mau bawa mbl / truk mah masuk aja', 5);
