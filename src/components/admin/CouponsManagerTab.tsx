import React, { useState } from 'react';
import { Coupon, CouponType } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Calendar,
  DollarSign,
  Percent,
  Search,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface CouponsManagerTabProps {
  onDataChanged: () => void;
}

export const CouponsManagerTab: React.FC<CouponsManagerTabProps> = ({ onDataChanged }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(dbStore.getCoupons());
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const handleSaveCoupon = (data: Partial<Coupon>) => {
    if (editingCoupon) {
      dbStore.updateCoupon(editingCoupon.id, data);
      showNotification(`Kupon "${data.code || editingCoupon.code}" berhasil diperbarui!`);
      setEditingCoupon(null);
    } else {
      dbStore.addCoupon({
        code: (data.code || 'PROMO').toUpperCase().trim(),
        type: data.type || 'PERCENTAGE',
        value: Number(data.value) || 10,
        minimum_transaction: Number(data.minimum_transaction) || 0,
        maximum_discount: data.maximum_discount ? Number(data.maximum_discount) : undefined,
        usage_limit: Number(data.usage_limit) || 100,
        per_user_limit: 1,
        start_at: new Date().toISOString(),
        expires_at: data.expires_at || new Date(Date.now() + 86400000 * 30).toISOString(),
        is_active: data.is_active ?? true,
      });
      showNotification(`Kupon promo baru berhasil dibuat!`);
      setIsNewModalOpen(false);
    }
    setCoupons([...dbStore.getCoupons()]);
    onDataChanged();
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (window.confirm(`Hapus kode kupon "${code}"?`)) {
      dbStore.deleteCoupon(id);
      showNotification(`Kupon "${code}" dihapus.`);
      setCoupons([...dbStore.getCoupons()]);
      onDataChanged();
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    dbStore.updateCoupon(coupon.id, { is_active: !coupon.is_active });
    showNotification(`Status kupon "${coupon.code}" diubah.`);
    setCoupons([...dbStore.getCoupons()]);
    onDataChanged();
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {feedbackMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-emerald-500 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Kupon Promo & Voucher Diskon
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat voucher diskon pelanggan, atur minimal belanja, kuota pemakaian, dan tanggal masa aktif.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Buat Kupon Promo Baru</span>
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Kode Kupon</th>
                <th className="py-3.5 px-4">Tipe Diskon</th>
                <th className="py-3.5 px-4">Besaran Potongan</th>
                <th className="py-3.5 px-4">Min. Transaksi</th>
                <th className="py-3.5 px-4">Masa Berlaku</th>
                <th className="py-3.5 px-4">Penggunaan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {coupon.type === 'PERCENTAGE' ? 'Persentase (%)' : 'Nominal Flat (Rp)'}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    {coupon.type === 'PERCENTAGE'
                      ? `${coupon.value}%`
                      : `Rp ${coupon.value.toLocaleString('id-ID')}`}
                    {coupon.maximum_discount ? (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Maks. Rp {coupon.maximum_discount.toLocaleString('id-ID')}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    Rp {coupon.minimum_transaction.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {new Date(coupon.expires_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {coupon.times_used || 0} / {coupon.usage_limit || '∞'}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                        coupon.is_active
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {coupon.is_active ? 'AKTIF' : 'NONAKTIF'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingCoupon(coupon)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-pointer"
                        title="Edit Kupon"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Kupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(editingCoupon || isNewModalOpen) && (
        <CouponModal
          coupon={editingCoupon}
          onClose={() => {
            setEditingCoupon(null);
            setIsNewModalOpen(false);
          }}
          onSave={handleSaveCoupon}
        />
      )}
    </div>
  );
};

interface CouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onSave: (data: Partial<Coupon>) => void;
}

const CouponModal: React.FC<CouponModalProps> = ({ coupon, onClose, onSave }) => {
  const [code, setCode] = useState(coupon?.code || '');
  const [type, setType] = useState<CouponType>(coupon?.type || 'PERCENTAGE');
  const [value, setValue] = useState(coupon?.value?.toString() || '15');
  const [minTrans, setMinTrans] = useState(coupon?.minimum_transaction?.toString() || '100000');
  const [maxDiscount, setMaxDiscount] = useState(coupon?.maximum_discount?.toString() || '30000');
  const [limit, setLimit] = useState(coupon?.usage_limit?.toString() || '100');
  const [expiryDays, setExpiryDays] = useState('30');
  const [isActive, setIsActive] = useState(coupon?.is_active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return alert('Kode kupon wajib diisi');
    const expires = new Date(Date.now() + 86400000 * Number(expiryDays)).toISOString();

    onSave({
      code: code.toUpperCase().trim(),
      type,
      value: Number(value) || 0,
      minimum_transaction: Number(minTrans) || 0,
      maximum_discount: type === 'PERCENTAGE' && maxDiscount ? Number(maxDiscount) : undefined,
      usage_limit: Number(limit) || 100,
      expires_at: expires,
      is_active: isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">
            {coupon ? 'Edit Kupon Promo' : 'Buat Kupon Promo Baru'}
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Kode Voucher / Promo *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Contoh: BERSIHIKN25"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 uppercase font-mono font-bold text-emerald-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tipe Diskon</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CouponType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium cursor-pointer"
              >
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="FIXED_AMOUNT">Potongan Flat (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {type === 'PERCENTAGE' ? 'Besaran (%)' : 'Potongan (Rp)'} *
              </label>
              <input
                type="number"
                required
                min="1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-emerald-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Min. Belanja (Rp)</label>
              <input
                type="number"
                step="10000"
                value={minTrans}
                onChange={(e) => setMinTrans(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            {type === 'PERCENTAGE' ? (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Maks. Potongan (Rp)</label>
                <input
                  type="number"
                  step="5000"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            ) : (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Batas Kuota Pemakaian</label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Masa Aktif (Hari ke depan)</label>
              <input
                type="number"
                min="1"
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Status Kupon</label>
              <select
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium cursor-pointer"
              >
                <option value="true">Aktif (Dapat Digunakan)</option>
                <option value="false">Nonaktif (Ditutup)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
              Simpan Kupon
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
