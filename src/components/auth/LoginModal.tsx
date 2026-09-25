import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAuth } from '../../lib/auth/authContext';
import { UserRole } from '../../types/database';
import { LogIn } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Silakan masukkan alamat email');
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (
      (normalizedEmail === 'superadmin@bersih.in' || normalizedEmail === 'munir@bersih.in' || role === 'SUPER_ADMIN') &&
      password !== 'superadmin11'
    ) {
      setError('Kata sandi Akun Master salah! Gunakan password: superadmin11');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await login(email, role);
      onClose();
    } catch {
      setError('Gagal masuk. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Masuk ke Bersih.in">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
            {error}
          </div>
        )}

        {/* Quick fill button for Master Account */}
        <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-xl flex items-center justify-between gap-2 text-xs">
          <div>
            <strong className="text-purple-950 block font-bold">Akun Master (Superadmin)</strong>
            <span className="text-purple-700 text-[11px]">Akses edit layanan, harga & bagi hasil</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('superadmin@bersih.in');
              setPassword('superadmin11');
              setRole('SUPER_ADMIN');
            }}
            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
          >
            Pilih Akun Master
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Peran Pengguna (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="CUSTOMER">Customer (Pelanggan)</option>
              <option value="CLEANER">Mitra Cleaner</option>
              <option value="ADMIN">Admin Operasional</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" isLoading={isLoading}>
            <LogIn className="w-4 h-4 mr-2" />
            Masuk
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Belum punya akun?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-emerald-600 font-semibold hover:underline"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};
