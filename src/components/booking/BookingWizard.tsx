import React, { useState, useMemo, useEffect } from 'react';
import { Service, Address, Booking } from '../../types/database';
import { dbStore } from '../../lib/database/supabaseClient';
import { useAuth } from '../../lib/auth/authContext';
import { calculateBookingPrice, PricingBreakdown } from '../../lib/pricing/pricingEngine';
import { getAvailableTimeSlots, TimeSlot } from '../../lib/booking/availability';
import { formatRupiah, formatDuration } from '../../lib/utils/formatters';
import { Button } from '../ui/Button';
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Home, 
  Building, 
  MapPin, 
  Calendar as CalendarIcon, 
  Clock, 
  Tag, 
  FileText, 
  AlertCircle, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight,
  Info,
  Navigation
} from 'lucide-react';
import {
  PPU_DISTRICTS,
  getKelurahanListByDistrict,
  findPpuDistrict,
  isValidPpuAddress,
  KABUPATEN_NAME,
  PROVINSI_NAME,
} from '../../lib/constants/ppuLocations';

interface BookingWizardProps {
  initialService?: Service | null;
  onCancel: () => void;
  onBookingComplete: (booking: Booking, breakdown: PricingBreakdown) => void;
  onOpenServiceDetail: (service: Service) => void;
}

const PROPERTY_TYPES = [
  { id: 'Rumah', label: 'Rumah Tinggal', desc: 'Rumah tapak / townhouse', icon: Home },
  { id: 'Apartemen', label: 'Apartemen / Studio', desc: 'Unit vertikal / kondominium', icon: Building },
  { id: 'Kost', label: 'Kamar Kost', desc: 'Kamar kost eksklusif / standar', icon: Home },
  { id: 'Kantor', label: 'Kantor / Ruko', desc: 'Ruang kerja & tempat usaha', icon: Building },
];

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialService,
  onCancel,
  onBookingComplete,
  onOpenServiceDetail,
}) => {
  const { user } = useAuth();
  const services = useMemo(() => dbStore.getServices().filter((s) => s.is_active), []);
  const categories = useMemo(() => dbStore.getCategories(), []);
  const allAddons = useMemo(() => dbStore.getAddons().filter((a) => a.is_active), []);
  const savedAddresses = useMemo(() => dbStore.getAddresses(user?.id), [user?.id]);

  // Wizard Step: 1 to 7
  const [step, setStep] = useState<number>(1);

  // Step 1: Service
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService?.id || services[0]?.id || ''
  );

  // Step 2: Property details
  const [propertyType, setPropertyType] = useState<string>('Rumah');
  const [propertyArea, setPropertyArea] = useState<number>(70);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(1);

  // Step 3: Add-ons
  const [addonQuantities, setAddonQuantities] = useState<Record<string, number>>({});

  // Step 4: Location (Focus Kabupaten Penajam Paser Utara)
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    savedAddresses[0]?.id || 'new'
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(savedAddresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    label: 'Rumah Penajam',
    recipient_name: user?.full_name || 'Budi Santoso',
    phone: user?.phone || '081234567890',
    address: 'Jl. Propinsi KM 1,5 RT 08',
    city: KABUPATEN_NAME,
    district: 'Penajam',
    kelurahan: 'Penajam',
    postal_code: '76141',
    latitude: -1.2587,
    longitude: 116.7725,
  });

  // Pure service area validation
  const isServiceAreaValid = (city?: string, district?: string): boolean => {
    return isValidPpuAddress(district || city);
  };

  const areaCoverageError = useMemo(() => {
    if (selectedAddressId === 'new') {
      if (newAddress.district && !isServiceAreaValid(newAddress.city, newAddress.district)) {
        return 'Maaf, layanan Bersih.in saat ini khusus berfokus di Kabupaten Penajam Paser Utara (Kecamatan Penajam, Sepaku/IKN, Waru, dan Babulu).';
      }
    } else {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr && addr.district && !isServiceAreaValid(addr.city, addr.district)) {
        return 'Maaf, alamat terpilih berada di luar cakupan Kabupaten Penajam Paser Utara.';
      }
    }
    return null;
  }, [selectedAddressId, newAddress.city, newAddress.district, savedAddresses]);

  // Step 5: Schedule
  const getTomorrowString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };
  const [scheduledDate, setScheduledDate] = useState<string>(getTomorrowString());
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Step 6: Coupon & Notes
  const [couponInput, setCouponInput] = useState<string>('');
  const [activeCouponCode, setActiveCouponCode] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Selected Service Object
  const selectedService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  // Selected or Active Address
  const activeAddress = useMemo(() => {
    if (selectedAddressId !== 'new') {
      return savedAddresses.find((a) => a.id === selectedAddressId) || null;
    }
    return newAddress;
  }, [selectedAddressId, savedAddresses, newAddress]);

  // Pricing Calculation from Engine
  const selectedAddonList = useMemo(() => {
    return Object.entries(addonQuantities)
      .filter(([_, qty]) => qty > 0)
      .map(([addonId, quantity]) => ({ addonId, quantity }));
  }, [addonQuantities]);

  const pricingBreakdown = useMemo(() => {
    return calculateBookingPrice({
      serviceId: selectedServiceId,
      propertyType,
      propertyArea,
      bedrooms,
      bathrooms,
      selectedAddonIds: selectedAddonList,
      couponCode: activeCouponCode,
      city: activeAddress?.city,
      district: activeAddress?.district,
    });
  }, [
    selectedServiceId,
    propertyType,
    propertyArea,
    bedrooms,
    bathrooms,
    selectedAddonList,
    activeCouponCode,
    activeAddress,
  ]);

  // Available slots for selected date
  const availableSlots = useMemo(() => {
    return getAvailableTimeSlots(scheduledDate, pricingBreakdown.estimatedDurationMinutes);
  }, [scheduledDate, pricingBreakdown.estimatedDurationMinutes]);

  const selectedSlot = useMemo(() => {
    if (selectedSlotId) {
      const match = availableSlots.find((s) => s.id === selectedSlotId && s.isAvailable);
      if (match) return match;
    }
    return availableSlots.find((s) => s.isAvailable) || null;
  }, [availableSlots, selectedSlotId]);

  const handleUpdateAddon = (addonId: string, delta: number) => {
    setAddonQuantities((prev) => {
      const current = prev[addonId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [addonId]: next };
    });
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!selectedServiceId;
      case 2:
        return propertyArea >= 15 && bedrooms >= 0 && bathrooms >= 0;
      case 3:
        return true;
      case 4:
        if (selectedAddressId === 'new') {
          if (!newAddress.address || !newAddress.recipient_name || !newAddress.phone) {
            return false;
          }
          return isServiceAreaValid(newAddress.city, newAddress.district);
        } else {
          const addr = savedAddresses.find((a) => a.id === selectedAddressId);
          return !!addr && isServiceAreaValid(addr.city, addr.district);
        }
      case 5:
        return !!selectedSlot && selectedSlot.isAvailable;
      case 6:
        return true;
      case 7:
        return !isSubmitting;
      default:
        return true;
    }
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);

    try {
      let finalAddressId = selectedAddressId;
      if (selectedAddressId === 'new') {
        const createdAddress = dbStore.addAddress({
          user_id: user?.id || 'demo-user',
          label: newAddress.label,
          recipient_name: newAddress.recipient_name,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          province: 'Kalimantan Timur',
          postal_code: newAddress.postal_code,
          latitude: newAddress.latitude,
          longitude: newAddress.longitude,
          is_default: savedAddresses.length === 0,
        });
        finalAddressId = createdAddress.id;
      }

      const datePart = scheduledDate.replace(/-/g, '');
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingNumber = `BRS-${datePart}-${randomSuffix}`;

      const newBooking = dbStore.createBooking({
        booking_number: bookingNumber,
        customer_id: user?.id || 'demo-user',
        cleaner_id: null,
        address_id: finalAddressId,
        service_id: selectedService.id,
        property_type: propertyType,
        property_area: propertyArea,
        scheduled_date: scheduledDate,
        start_time: selectedSlot ? selectedSlot.startTime : '08:00',
        end_time: selectedSlot ? selectedSlot.endTime : '10:00',
        base_price: pricingBreakdown.basePrice + pricingBreakdown.areaPriceAdjustment + pricingBreakdown.roomAdjustment,
        addon_price: pricingBreakdown.addonTotal,
        discount_amount: pricingBreakdown.discountAmount,
        transport_fee: pricingBreakdown.transportFee,
        total_price: pricingBreakdown.totalPrice,
        status: 'PENDING_PAYMENT',
        payment_status: 'PENDING',
        customer_notes: customerNotes,
        addons: selectedAddonList.map((item) => {
          const addonObj = dbStore.getAddons().find((a) => a.id === item.addonId);
          const unitPrice = addonObj?.price || 0;
          return {
            id: 'ba-' + Math.random().toString(36).substring(2, 7),
            booking_id: '',
            addon_id: item.addonId,
            quantity: item.quantity,
            unit_price: unitPrice,
            total_price: unitPrice * item.quantity,
            addon: addonObj,
          };
        }),
      });

      if (pricingBreakdown.appliedCoupon) {
        dbStore.useCoupon(pricingBreakdown.appliedCoupon.id, newBooking.id, user?.id || 'demo-user');
      }

      setTimeout(() => {
        setIsSubmitting(false);
        onBookingComplete(newBooking, pricingBreakdown);
      }, 600);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const stepLabels = [
    { num: 1, title: 'Layanan' },
    { num: 2, title: 'Properti' },
    { num: 3, title: 'Add-on' },
    { num: 4, title: 'Lokasi' },
    { num: 5, title: 'Jadwal' },
    { num: 6, title: 'Rincian' },
    { num: 7, title: 'Checkout' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
          </button>
          <div className="text-xs font-medium text-slate-500">
            Langkah <span className="font-bold text-slate-800">{step}</span> dari 7
          </div>
        </div>

        {/* 7-Step Stepper Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {stepLabels.map((s) => {
              const isPast = step > s.num;
              const isCurrent = step === s.num;
              return (
                <div
                  key={s.num}
                  className="flex flex-col items-center text-center cursor-pointer group"
                  onClick={() => {
                    if (s.num < step) setStep(s.num);
                  }}
                >
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPast
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium mt-1.5 line-clamp-1 ${
                      isCurrent
                        ? 'text-emerald-700 font-bold'
                        : isPast
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            
            {/* STEP 1: SERVICE SELECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">1. Pilih Layanan Kebersihan</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Pilih paket yang paling sesuai dengan kebutuhan hunian atau ruang kerja Anda.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((srv) => {
                    const isSelected = srv.id === selectedServiceId;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedServiceId(srv.id)}
                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer text-left flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/40 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {categories.find(c => c.id === srv.category_id)?.name || 'Cleaning'}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-base">{srv.name}</h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase">Mulai Dari</span>
                            <span className="font-bold text-slate-900 text-sm">
                              {formatRupiah(srv.base_price)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenServiceDetail(srv);
                            }}
                            className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                          >
                            <Info className="w-3.5 h-3.5" />
                            Detail SOP
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: PROPERTY DETAILS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">2. Tipe & Luas Properti</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Spesifikasi ruangan membantu kami menentukan durasi kerja dan jumlah cleaner optimal.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tipe Properti
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PROPERTY_TYPES.map((pt) => {
                      const isSelected = propertyType === pt.id;
                      const Icon = pt.icon;
                      return (
                        <button
                          type="button"
                          key={pt.id}
                          onClick={() => setPropertyType(pt.id)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                          <div className="font-bold text-xs text-slate-900">{pt.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{pt.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Estimasi Luas Bangunan
                    </label>
                    <span className="text-lg font-extrabold text-emerald-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                      {propertyArea} m²
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="5"
                    value={propertyArea}
                    onChange={(e) => setPropertyArea(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Studio (20 m²)</span>
                    <span>Standar (70 m²)</span>
                    <span>Menengah (150 m²)</span>
                    <span>Besar (&gt;250 m²)</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Jumlah Kamar Tidur</span>
                      <span className="text-[11px] text-slate-500">Standar paket termasuk 2 kamar</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setBedrooms(Math.max(1, bedrooms - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{bedrooms}</span>
                      <button
                        type="button"
                        onClick={() => setBedrooms(Math.min(8, bedrooms + 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">Jumlah Kamar Mandi</span>
                      <span className="text-[11px] text-slate-500">Standar paket termasuk 1 kamar mandi</span>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setBathrooms(Math.max(1, bathrooms - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center font-bold text-sm text-slate-900">{bathrooms}</span>
                      <button
                        type="button"
                        onClick={() => setBathrooms(Math.min(6, bathrooms + 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ADD-ONS */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">3. Tambahan Layanan (Add-on)</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tingkatkan hasil kebersihan dengan perawatan perabot ekstra sesuai kebutuhan Anda.
                  </p>
                </div>

                <div className="space-y-3">
                  {allAddons.map((addon) => {
                    const quantity = addonQuantities[addon.id] || 0;
                    return (
                      <div
                        key={addon.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                          quantity > 0
                            ? 'border-emerald-500 bg-emerald-50/40'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{addon.name}</h4>
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              +{addon.duration_minutes} mnt
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{addon.description}</p>
                          <span className="text-xs font-extrabold text-emerald-700 block">
                            +{formatRupiah(addon.price)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateAddon(addon.id, -1)}
                            disabled={quantity === 0}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-bold text-sm text-slate-900">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateAddon(addon.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">4. Alamat & Wilayah Layanan (PPU)</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Layanan Bersih.in berfokus penuh di <strong>Kabupaten Penajam Paser Utara</strong> (Kecamatan Penajam, Sepaku / IKN, Waru, dan Babulu).
                  </p>
                </div>

                {areaCoverageError && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Diluar Cakupan Area Layanan</strong>
                      {areaCoverageError}
                    </div>
                  </div>
                )}

                {savedAddresses.length > 0 && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Pilih dari Alamat Tersimpan:
                    </label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => {
                              setSelectedAddressId(addr.id);
                              setIsAddingNewAddress(false);
                            }}
                            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-xs text-slate-900">{addr.label}</span>
                              {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{addr.address}</p>
                            <div className="text-[11px] text-slate-500 mt-2 font-medium">
                              {addr.recipient_name} ({addr.phone})
                            </div>
                          </div>
                        );
                      })}

                      <div
                        onClick={() => {
                          setSelectedAddressId('new');
                          setIsAddingNewAddress(true);
                        }}
                        className={`p-4 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center cursor-pointer transition-all ${
                          selectedAddressId === 'new'
                            ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800'
                            : 'border-slate-300 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <Plus className="w-5 h-5 mb-1 text-emerald-600" />
                        <span className="text-xs font-bold">Gunakan Alamat Baru (PPU)</span>
                      </div>
                    </div>
                  </div>
                )}

                {(isAddingNewAddress || savedAddresses.length === 0) && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Detail Alamat Lengkap di Penajam Paser Utara
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        Wilayah Resmi PPU
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Penerima</label>
                        <input
                          type="text"
                          required
                          value={newAddress.recipient_name}
                          onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp</label>
                        <input
                          type="tel"
                          required
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kabupaten
                        </label>
                        <div className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-200 bg-emerald-50/50 font-bold text-emerald-900 flex items-center justify-between">
                          <span>Kab. Penajam Paser Utara</span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">PPU</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kecamatan
                        </label>
                        <select
                          value={newAddress.district}
                          onChange={(e) => {
                            const selectedDistName = e.target.value;
                            const matchedDistrict = findPpuDistrict(selectedDistName);
                            const firstKel = matchedDistrict?.kelurahanList[0];
                            setNewAddress({
                              ...newAddress,
                              district: matchedDistrict ? matchedDistrict.name : selectedDistName,
                              kelurahan: firstKel ? firstKel.name : '',
                              postal_code: firstKel ? firstKel.postalCode : '76141',
                              latitude: matchedDistrict ? matchedDistrict.latitude : -1.2587,
                              longitude: matchedDistrict ? matchedDistrict.longitude : 116.7725,
                            });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-semibold text-slate-800"
                        >
                          {PPU_DISTRICTS.map((d) => (
                            <option key={d.id} value={d.name}>
                              Kec. {d.name} {d.name === 'Sepaku' ? '(IKN)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Kelurahan / Desa ({getKelurahanListByDistrict(newAddress.district).length} Terdaftar)
                        </label>
                        <select
                          value={newAddress.kelurahan}
                          onChange={(e) => {
                            const kelName = e.target.value;
                            const kelList = getKelurahanListByDistrict(newAddress.district);
                            const foundKel = kelList.find((k) => k.name === kelName);
                            setNewAddress({
                              ...newAddress,
                              kelurahan: kelName,
                              postal_code: foundKel ? foundKel.postalCode : newAddress.postal_code,
                            });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-800"
                        >
                          {getKelurahanListByDistrict(newAddress.district).map((k) => (
                            <option key={k.name} value={k.name}>
                              {k.type} {k.name} {k.notes ? `(${k.notes})` : ''} - {k.postalCode}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Alamat Jalan, Nomor Rumah, RT/RW, Patokan
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                        placeholder="Contoh: Jl. Propinsi KM 1,5 RT 08, Kel. Penajam (Depan Masjid / Samping Kantor)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          Koordinat GPS: <strong>{newAddress.latitude}, {newAddress.longitude}</strong> • Kode Pos: <strong>{newAddress.postal_code || '76141'}</strong>
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        ✓ Zona Layanan Aktif PPU
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: SCHEDULE */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">5. Jadwal & Jam Pembersihan</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Waktu operasional: <strong>08:00 – 19:00 WITA</strong>. Slot dihitung otomatis berdasarkan ketersediaan mitra.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Pilih Tanggal Pengerjaan
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pilih Slot Jam Kedatangan (WITA)
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      return (
                        <button
                          type="button"
                          key={slot.id}
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlotId(slot.id)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            !slot.isAvailable
                              ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                              : isSelected
                              ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-slate-900 text-sm">
                              {slot.startTime} – {slot.endTime} WITA
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                          </div>
                          <span
                            className={`text-[11px] block font-medium ${
                              slot.isAvailable ? 'text-emerald-700' : 'text-slate-500'
                            }`}
                          >
                            {slot.isAvailable
                              ? `${slot.availableCleaners} Mitra Cleaner Siap Ditugaskan`
                              : slot.reason || 'Slot Tidak Tersedia'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: PRICE BREAKDOWN & COUPONS */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">6. Rincian Biaya & Kupon Diskon</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Transparansi total tanpa biaya tersembunyi.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Punya Kode Voucher / Promo?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Contoh: BERSIHBARU / GAJIANHEMAT"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveCouponCode(couponInput)}
                    >
                      Terapkan
                    </Button>
                  </div>

                  {pricingBreakdown.appliedCoupon && (
                    <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Kupon {pricingBreakdown.appliedCoupon.code} berhasil diterapkan! Hemat{' '}
                      {formatRupiah(pricingBreakdown.discountAmount)}
                    </div>
                  )}

                  {pricingBreakdown.couponError && (
                    <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 pt-1">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      {pricingBreakdown.couponError}
                    </div>
                  )}

                  <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span>Voucher aktif:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput('BERSIHBARU');
                        setActiveCouponCode('BERSIHBARU');
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200"
                    >
                      BERSIHBARU (Diskon 20%)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput('HEMAT25K');
                        setActiveCouponCode('HEMAT25K');
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold hover:bg-emerald-200"
                    >
                      HEMAT25K (Rp 25.000)
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                  <div className="bg-slate-100/80 px-4 py-3 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                    <span>Komponen Biaya</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="divide-y divide-slate-100 px-4 py-2 space-y-2">
                    <div className="flex justify-between py-1 text-slate-700">
                      <div>
                        <span className="font-semibold block">{selectedService.name}</span>
                        <span className="text-[11px] text-slate-400">Tarif dasar pengerjaan</span>
                      </div>
                      <span className="font-semibold">{formatRupiah(pricingBreakdown.basePrice)}</span>
                    </div>

                    {pricingBreakdown.areaPriceAdjustment > 0 && (
                      <div className="flex justify-between py-1 text-slate-700">
                        <div>
                          <span className="font-semibold block">Penyesuaian Luas ({propertyArea} m²)</span>
                          <span className="text-[11px] text-slate-400">Tambahan waktu & tenaga tier luas</span>
                        </div>
                        <span className="font-semibold">+{formatRupiah(pricingBreakdown.areaPriceAdjustment)}</span>
                      </div>
                    )}

                    {pricingBreakdown.roomAdjustment > 0 && (
                      <div className="flex justify-between py-1 text-slate-700">
                        <div>
                          <span className="font-semibold block">Kamar Tambahan ({bedrooms} KT, {bathrooms} KM)</span>
                        </div>
                        <span className="font-semibold">+{formatRupiah(pricingBreakdown.roomAdjustment)}</span>
                      </div>
                    )}

                    {pricingBreakdown.addonDetails.map((item, idx) => (
                      <div key={idx} className="flex justify-between py-1 text-slate-700">
                        <div>
                          <span className="font-semibold block">
                            {item.addon.name} (x{item.quantity})
                          </span>
                        </div>
                        <span className="font-semibold">+{formatRupiah(item.totalPrice)}</span>
                      </div>
                    ))}

                    <div className="flex justify-between py-1 text-slate-700">
                      <div>
                        <span className="font-semibold block">Biaya Transportasi Mitra</span>
                        <span className="text-[11px] text-slate-400">
                          Kec. {activeAddress?.district || 'Penajam'} {activeAddress?.kelurahan ? `(${activeAddress.kelurahan})` : ''}
                        </span>
                      </div>
                      <span className="font-semibold">+{formatRupiah(pricingBreakdown.transportFee)}</span>
                    </div>

                    {pricingBreakdown.discountAmount > 0 && (
                      <div className="flex justify-between py-1 text-emerald-700 font-bold">
                        <div>
                          <span>Diskon Promo ({pricingBreakdown.appliedCoupon?.code})</span>
                        </div>
                        <span>-{formatRupiah(pricingBreakdown.discountAmount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 px-4 py-3.5 border-t border-slate-200 flex justify-between items-center text-sm">
                    <span className="font-extrabold text-slate-900">Total Pembayaran</span>
                    <span className="text-lg font-extrabold text-emerald-700">
                      {formatRupiah(pricingBreakdown.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: CHECKOUT & NOTES */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">7. Konfirmasi & Checkout Pesanan</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tinjau kembali rincian pemesanan Anda sebelum menuju proses pembayaran.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Paket Layanan</span>
                      <strong className="text-sm text-slate-900 block">{selectedService.name}</strong>
                      <span className="text-slate-600">
                        {propertyType} • {propertyArea} m² ({bedrooms} KT, {bathrooms} KM)
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Jadwal WITA</span>
                      <strong className="text-sm text-slate-900 block">
                        {scheduledDate} ({selectedSlot?.startTime} – {selectedSlot?.endTime} WITA)
                      </strong>
                      <span className="text-slate-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Estimasi durasi: {formatDuration(pricingBreakdown.estimatedDurationMinutes)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Alamat Pengerjaan</span>
                    <strong className="text-slate-800 block">{activeAddress?.recipient_name} ({activeAddress?.phone})</strong>
                    <p className="text-slate-600 mt-0.5">{activeAddress?.address}, {activeAddress?.district}, {activeAddress?.city}</p>
                  </div>

                  {pricingBreakdown.addonDetails.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">Add-on Terpilih</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                        {pricingBreakdown.addonDetails.map((a, i) => (
                          <li key={i}>
                            {a.addon.name} x {a.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Catatan Tambahan untuk Mitra Cleaner (Opsional):
                    </label>
                    <textarea
                      rows={3}
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Contoh: Kunci rumah dititipkan ke sekuriti cluster, harap berhati-hati ada kucing di teras depan..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-900">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">Jaminan Kepuasan Bersih.in 100%</strong>
                    Pembersihan ulang gratis jika ada bagian yang terlewat dalam kurun 24 jam setelah selesai.
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              {step > 1 ? (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setStep(step - 1)}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              ) : (
                <Button variant="ghost" size="md" onClick={onCancel}>
                  Batal
                </Button>
              )}

              {step < 7 ? (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Lanjut ke Langkah {step + 1}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleFinalSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 shadow-md"
                >
                  {isSubmitting ? 'Membuat Pesanan...' : 'Konfirmasi & Buat Pesanan'}
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Right Sticky Order Summary */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5 sticky top-6">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Ringkasan Pemesanan
            </h4>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Layanan</span>
                <span className="font-bold text-slate-900 text-sm">{selectedService.name}</span>
                <span className="text-slate-500 block">
                  {propertyType} • {propertyArea} m²
                </span>
              </div>

              {step >= 4 && activeAddress && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Lokasi</span>
                  <span className="font-medium text-slate-800 line-clamp-1">
                    {activeAddress.kelurahan ? `${activeAddress.kelurahan}, ` : ''}{activeAddress.district || 'Penajam'}, {activeAddress.city || 'PPU'}
                  </span>
                </div>
              )}

              {step >= 5 && selectedSlot && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jadwal</span>
                  <span className="font-medium text-slate-800">
                    {scheduledDate} ({selectedSlot.startTime} WITA)
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Estimasi Durasi</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {formatDuration(pricingBreakdown.estimatedDurationMinutes)}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Total Estimasi</span>
                {pricingBreakdown.discountAmount > 0 && (
                  <span className="text-emerald-700 font-bold">Hemat {formatRupiah(pricingBreakdown.discountAmount)}</span>
                )}
              </div>
              <div className="text-2xl font-extrabold text-emerald-800">
                {formatRupiah(pricingBreakdown.totalPrice)}
              </div>
              <p className="text-[10px] text-slate-500">
                Sudah termasuk peralatan, chemical hospital-grade & transport.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
