-- Bersih.in Seed Data
-- Indonesian Home Cleaning Marketplace (Kab. Penajam Paser Utara, Kaltim)

INSERT INTO profiles (id, email, full_name, phone, role, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'budi.santoso@gmail.com', 'Budi Santoso', '081234567890', 'CUSTOMER', true),
('22222222-2222-2222-2222-222222222221', 'ahmad.cleaner@bersih.in', 'Ahmad Fauzi (Pro Cleaner)', '082155551234', 'CLEANER', true),
('33333333-3333-3333-3333-333333333331', 'admin@bersih.in', 'Farhan Pratama (Ops Admin)', '081122334455', 'ADMIN', true),
('44444444-4444-4444-4444-444444444441', 'superadmin@bersih.in', 'Munir Agus Shodikin (Master Admin)', '081199887766', 'SUPER_ADMIN', true)
ON CONFLICT (id) DO NOTHING;
