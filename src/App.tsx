import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth/authContext';
import { Navbar } from './components/marketing/Navbar';
import { HeroSection } from './components/marketing/HeroSection';
import { ServiceCards } from './components/marketing/ServiceCards';
import { HowItWorks } from './components/marketing/HowItWorks';
import { Benefits } from './components/marketing/Benefits';
import { ServiceAreaSection } from './components/marketing/ServiceAreaSection';
import { Testimonials } from './components/marketing/Testimonials';
import { FAQSection } from './components/marketing/FAQSection';
import { CTASection } from './components/marketing/CTASection';
import { Footer } from './components/marketing/Footer';
import { ServicesPage } from './components/marketing/ServicesPage';
import { AboutPage } from './components/marketing/AboutPage';
import { ContactPage } from './components/marketing/ContactPage';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { ServiceDetailModal } from './components/booking/ServiceDetailModal';
import { BookingWizard } from './components/booking/BookingWizard';
import { BookingSuccessModal } from './components/booking/BookingSuccessModal';
import { MidtransSnapModal } from './components/payment/MidtransSnapModal';
import { OwnerBankSettingsModal } from './components/admin/OwnerBankSettingsModal';
import { MitraRegistrationModal } from './components/mitra/MitraRegistrationModal';
import { OrderTrackingView } from './components/booking/OrderTrackingView';
import { MyBookingsView } from './components/booking/MyBookingsView';
import { CustomerDashboardView } from './components/dashboard/CustomerDashboardView';
import { SuperadminDashboardView } from './components/admin/SuperadminDashboardView';
import { MitraDashboardView } from './components/mitra/MitraDashboardView';
import { dbStore } from './lib/database/supabaseClient';
import { Service, Booking } from './types/database';
import { PricingBreakdown } from './lib/pricing/pricingEngine';
import { Sparkles, Shield, User, ArrowRight, CheckCircle2, Landmark, Briefcase, MapPin, UserPlus, Phone, MessageCircle } from 'lucide-react';
import { Button } from './components/ui/Button';

function MainContent() {
  const { user, isAuthenticated, switchRole } = useAuth();
  const [currentView, setCurrentView] = useState<
    'home' | 'services' | 'about' | 'faq' | 'contact' | 'booking' | 'tracking' | 'my-bookings' | 'superadmin' | 'mitra-dashboard'
  >('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMitraRegisterOpen, setIsMitraRegisterOpen] = useState(false);
  const [isOwnerBankModalOpen, setIsOwnerBankModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  const isSuperAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const isCleaner = user?.role === 'CLEANER';

  // Detail Modal State
  const [detailModalService, setDetailModalService] = useState<Service | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Booking Success Modal State
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [completedBreakdown, setCompletedBreakdown] = useState<PricingBreakdown | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Midtrans Snap & Tracking State
  const [paymentBooking, setPaymentBooking] = useState<Booking | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [trackedBookingId, setTrackedBookingId] = useState<string>('');

  const services = dbStore.getServices();
  const categories = dbStore.getCategories();
  const reviews = dbStore.getReviews();

  const handleStartBooking = (service?: Service) => {
    if (service) {
      setSelectedServiceForBooking(service);
    } else {
      setSelectedServiceForBooking(services[0]);
    }
    setCurrentView('booking');
  };

  const handleOpenDetailModal = (service: Service) => {
    setDetailModalService(service);
    setIsDetailModalOpen(true);
  };

  const handleBookingComplete = (booking: Booking, breakdown: PricingBreakdown) => {
    setCompletedBooking(booking);
    setCompletedBreakdown(breakdown);
    setIsSuccessModalOpen(true);
  };

  const handleOpenPayment = (booking: Booking) => {
    setPaymentBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (updatedBooking: Booking) => {
    setIsPaymentModalOpen(false);
    setTrackedBookingId(updatedBooking.id);
    setCurrentView('tracking');
  };

  const handleNavigateToTrack = (bookingId: string) => {
    setTrackedBookingId(bookingId);
    setCurrentView('tracking');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Bar for Roles */}
      {isSuperAdmin ? (
        <div className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-black bg-purple-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest text-white shadow-xs">
                <Shield className="w-3 h-3" />
                SUPERADMIN MODE
              </span>
              <span className="text-slate-300 hidden md:inline font-medium">
                Pusat Kendali Operasional Bersih.in Kab. Penajam Paser Utara
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-400">Login Sebagai:</span>
              <span className="font-bold text-emerald-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {user?.role} ({user?.full_name})
              </span>

              <button
                onClick={() => setCurrentView('superadmin')}
                className="inline-flex items-center gap-1 font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 px-3 py-1 rounded-md transition-colors shadow-xs ml-1 cursor-pointer"
                title="Buka Panel Master: Edit Layanan, Harga & Bagi Hasil"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Panel Master (Edit Layanan & Harga)</span>
              </button>

              <button
                onClick={() => setIsOwnerBankModalOpen(true)}
                className="inline-flex items-center gap-1 font-bold text-emerald-200 hover:text-white bg-emerald-800 hover:bg-emerald-700 px-2.5 py-1 rounded-md border border-emerald-600 transition-colors shadow-xs cursor-pointer"
                title="Atur No Rekening Owner & Payout"
              >
                <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rekening Owner</span>
              </button>
            </div>
          </div>
        </div>
      ) : isCleaner ? (
        <div className="bg-teal-900 text-white text-xs py-2 px-4 border-b border-teal-800">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-black bg-teal-600 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest text-white shadow-xs">
                <Briefcase className="w-3 h-3" />
                KARYAWAN CLEANER MODE
              </span>
              <span className="text-teal-200 hidden md:inline font-medium">
                Petugas Kebersihan Resmi Bersih.in • Penugasan Wilayah: Kab. Penajam Paser Utara
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-teal-300">Login: <strong>{user?.full_name}</strong></span>
              <button
                onClick={() => setCurrentView('mitra-dashboard')}
                className="font-bold text-teal-100 hover:text-white bg-teal-800 hover:bg-teal-700 px-2.5 py-1 rounded-md border border-teal-700 transition-colors ml-1 cursor-pointer"
              >
                Dashboard Tugas
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onStartBooking={() => handleStartBooking()}
        onOpenOwnerSettings={isSuperAdmin ? () => setIsOwnerBankModalOpen(true) : undefined}
        onOpenMitraRegister={() => setIsMitraRegisterOpen(true)}
      />

      {/* View Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <HeroSection
              onStartBooking={() => handleStartBooking()}
              onViewServices={() => setCurrentView('services')}
              onOpenRegister={() => setIsRegisterOpen(true)}
              onOpenMitraRegister={() => setIsMitraRegisterOpen(true)}
            />
            <ServiceCards
              services={services}
              onSelectService={(service) => handleStartBooking(service)}
              onViewDetail={(service) => handleOpenDetailModal(service)}
              onEditService={() => setCurrentView('superadmin')}
            />
            <HowItWorks />
            <Benefits />
            <ServiceAreaSection />
            <Testimonials reviews={reviews} />
            <FAQSection />
            <CTASection onStartBooking={() => handleStartBooking()} />
          </>
        )}

        {currentView === 'services' && (
          <ServicesPage
            services={services}
            categories={categories}
            onSelectService={(service) => handleStartBooking(service)}
            onViewDetail={(service) => handleOpenDetailModal(service)}
            onEditService={() => setCurrentView('superadmin')}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'faq' && <FAQSection />}

        {currentView === 'contact' && (
          <ContactPage onOpenMitraRegister={() => setIsMitraRegisterOpen(true)} />
        )}

        {currentView === 'booking' && (
          <BookingWizard
            initialService={selectedServiceForBooking}
            onCancel={() => setCurrentView('home')}
            onBookingComplete={handleBookingComplete}
            onOpenServiceDetail={(service) => handleOpenDetailModal(service)}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTrackingView
            initialBookingId={trackedBookingId}
            onOpenPaymentModal={handleOpenPayment}
            onStartNewBooking={() => handleStartBooking()}
          />
        )}

        {/* Role-Based Dashboard Routing */}
        {currentView === 'my-bookings' && (
          isSuperAdmin ? (
            <SuperadminDashboardView
              onOpenOwnerSettings={() => setIsOwnerBankModalOpen(true)}
              onTrackBooking={handleNavigateToTrack}
              onSwitchToCustomerView={() => setCurrentView('home')}
            />
          ) : isCleaner ? (
            <MitraDashboardView
              onTrackBooking={handleNavigateToTrack}
              onSwitchToCustomerView={() => setCurrentView('home')}
            />
          ) : (
            <CustomerDashboardView
              onTrackBooking={handleNavigateToTrack}
              onPayBooking={handleOpenPayment}
              onNewBooking={() => handleStartBooking()}
            />
          )
        )}

        {currentView === 'mitra-dashboard' && (
          <MitraDashboardView
            onTrackBooking={handleNavigateToTrack}
            onSwitchToCustomerView={() => setCurrentView('home')}
          />
        )}

        {currentView === 'superadmin' && (
          <SuperadminDashboardView
            onOpenOwnerSettings={() => setIsOwnerBankModalOpen(true)}
            onTrackBooking={handleNavigateToTrack}
            onSwitchToCustomerView={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenMitraRegister={() => setIsMitraRegisterOpen(true)}
      />

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      {/* Mitra Cleaner Registration Modal */}
      <MitraRegistrationModal
        isOpen={isMitraRegisterOpen}
        onClose={() => setIsMitraRegisterOpen(false)}
      />

      {/* Service Detail & SOP Modal */}
      <ServiceDetailModal
        service={detailModalService}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onBookNow={(service) => handleStartBooking(service)}
      />

      {/* Booking Success & Receipt Modal */}
      <BookingSuccessModal
        booking={completedBooking}
        breakdown={completedBreakdown}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onProceedToPayment={(booking) => {
          setIsSuccessModalOpen(false);
          handleOpenPayment(booking);
        }}
      />

      {/* Midtrans Snap Payment Modal */}
      <MidtransSnapModal
        isOpen={isPaymentModalOpen}
        booking={paymentBooking}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenOwnerSettings={isSuperAdmin ? () => {
          setIsPaymentModalOpen(false);
          setIsOwnerBankModalOpen(true);
        } : undefined}
      />

      {/* Pengaturan Rekening Owner & Payout Modal (Superadmin) */}
      <OwnerBankSettingsModal
        isOpen={isOwnerBankModalOpen}
        onClose={() => setIsOwnerBankModalOpen(false)}
      />

      {/* Floating WhatsApp Customer Service Button */}
      <aside aria-label="Customer Service Quick Contact">
        <a
          href="https://wa.me/6285648373440?text=Halo%20Customer%20Service%20Bersih.in,%20saya%20butuh%20bantuan"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-900/25 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group border border-emerald-400/30 focus:outline-none focus:ring-4 focus:ring-emerald-300/40"
          aria-label="Hubungi Customer Service"
          title="Hubungi Customer Service"
        >
          <MessageCircle className="w-7 h-7 text-white fill-white/20 group-hover:scale-105 transition-transform" />
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
          </span>
          <span className="absolute right-16 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            Chat CS
          </span>
        </a>
      </aside>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
