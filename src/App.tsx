// App.tsx
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Coffee,
  Menu as MenuIcon,
  X,
  Calendar,
  Star,
  Users,
  FileText,
  Check,
  Clock,
  User,
  LogIn,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  MapPin,
} from "lucide-react";

import { cn } from "./lib/utils";

// --- IMPORT FIREBASE ---
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db } from "./lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

// --- Types ---
type Page = "landing" | "login" | "home";
type UserRole = "customer" | "admin";

interface Reservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  guests: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt?: string; // Tambahan untuk sorting dari database
}

// --- Components ---
const Navbar = ({
  currentPage,
  onNavigate,
  isLoggedIn,
  onLogout,
  userRole,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  userRole: UserRole;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6",
      )}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate("landing")}
        >
          <Coffee
            className={cn(
              "h-8 w-8 transition-colors",
              isScrolled ? "text-cafe-brown" : "text-cafe-brown lg:text-white",
            )}
          />
          <span
            className={cn(
              "font-serif text-2xl font-bold transition-colors",
              isScrolled ? "text-cafe-brown" : "text-cafe-brown lg:text-white",
            )}
          >
            PesenKopi
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <button
            onClick={() => onNavigate("landing")}
            className={cn(
              "text-sm font-medium tracking-wide transition-colors hover:text-cafe-gold",
              isScrolled
                ? "text-cafe-brown"
                : "text-cafe-brown lg:text-white/90",
            )}
          >
            HOME
          </button>
          <button
            className={cn(
              "text-sm font-medium tracking-wide transition-colors hover:text-cafe-gold",
              isScrolled
                ? "text-cafe-brown"
                : "text-cafe-brown lg:text-white/90",
            )}
          >
            MENU
          </button>
          <button
            className={cn(
              "text-sm font-medium tracking-wide transition-colors hover:text-cafe-gold",
              isScrolled
                ? "text-cafe-brown"
                : "text-cafe-brown lg:text-white/90",
            )}
          >
            ABOUT
          </button>

          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate("home")}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors",
                  isScrolled
                    ? "border-cafe-brown text-cafe-brown hover:bg-cafe-brown hover:text-white"
                    : "border-cafe-brown text-cafe-brown lg:border-white/50 lg:text-white lg:hover:bg-white/10",
                )}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {userRole === "admin" ? "Dashboard" : "My Account"}
                </span>
              </button>
              <button
                onClick={onLogout}
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors hover:text-red-500",
                  isScrolled
                    ? "text-cafe-brown"
                    : "text-cafe-brown lg:text-white/90",
                )}
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className={cn(
                "flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-all hover:scale-105",
                isScrolled
                  ? "bg-cafe-brown text-white"
                  : "bg-cafe-brown text-white lg:bg-white lg:text-cafe-brown",
              )}
            >
              <span>Sign In</span>
              <LogIn className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-cafe-brown" />
          ) : (
            <MenuIcon
              className={cn(
                "w-6 h-6",
                isScrolled
                  ? "text-cafe-brown"
                  : "text-cafe-brown lg:text-white",
              )}
            />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t mt-4"
          >
            <div className="flex flex-col px-6 py-4 space-y-4">
              <button
                onClick={() => {
                  onNavigate("landing");
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-cafe-brown"
              >
                HOME
              </button>
              <button className="text-left py-2 text-cafe-brown">MENU</button>
              <button className="text-left py-2 text-cafe-brown">ABOUT</button>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      onNavigate("home");
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 text-cafe-brown font-medium"
                  >
                    {userRole === "admin" ? "Dashboard" : "My Account"}
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-left py-2 text-red-600"
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    onNavigate("login");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-cafe-brown text-white py-3 rounded-md w-full"
                >
                  <span>Sign In</span>
                  <LogIn className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const LandingPage = ({ onStart }: { onStart: () => void }) => {
  return (
    <div className="min-h-screen">
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop"
            alt="Cafe Interior"
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cafe-brown/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
              Experience Coffee <br />
              <span className="italic font-light text-cafe-cream">
                Like Never Before
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
              Reserve your perfect spot. Whether it's a quiet corner for deep
              work or a spacious table for friends, we have space for your
              moments.
            </p>
            <button
              onClick={onStart}
              className="group bg-white text-cafe-brown px-8 py-4 rounded-full text-lg font-medium hover:bg-cafe-cream transition-all duration-300 hover:scale-105 flex items-center space-x-3 mx-auto shadow-2xl"
            >
              <span>Book a Table</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-cafe-cream px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-cafe-brown mb-4">
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-cafe-gold mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Star,
                title: "Premium Quality",
                desc: "Sourced from the finest local beans.",
              },
              {
                icon: Clock,
                title: "No Waiting",
                desc: "Your table is ready when you arrive.",
              },
              {
                icon: Users,
                title: "Perfect Ambiance",
                desc: "Designed for comfort and connection.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center"
              >
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-cafe-gold">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-cafe-olive">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-cafe-brown text-cafe-cream py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Coffee className="h-6 w-6 text-cafe-gold" />
                <span className="font-serif text-2xl font-bold">PesenKopi</span>
              </div>
              <p className="text-cafe-cream/70 font-light leading-relaxed">
                Crafting moments and pouring happiness, one cup at a time. Your
                neighborhood sanctuary.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-serif mb-6 text-white">Contact</h4>
              <ul className="space-y-4 text-cafe-cream/70 font-light">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 mt-0.5 text-cafe-gold" />
                  <span>123 Coffee Lane, Brew District, Malang</span>
                </li>
                <li>hello@pesenkopi.com</li>
                <li>+62 812 3456 7890</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-serif mb-6 text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cafe-gold hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cafe-gold hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-cafe-gold hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-cafe-cream/50 text-sm font-light">
            © 2026 PesenKopi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="min-h-screen bg-cafe-cream flex items-center justify-center p-6 pt-24">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cafe-gold to-cafe-brown" />

        <div className="text-center mb-10">
          <div className="bg-cafe-brown/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coffee className="w-8 h-8 text-cafe-brown" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-cafe-brown mb-2">
            Welcome Back
          </h2>
          <p className="text-cafe-olive">Sign in to manage your reservations</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={onLogin}
            className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 rounded-full">
                Test Accounts
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-cafe-olive bg-cafe-brown/5 p-4 rounded-lg">
            <p className="mb-1">
              For testing purposes, login with any Google account.
            </p>
            <p>
              To view <span className="font-semibold">Admin Panel</span>, you
              would normally configure specific admin emails in the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Untuk indikator loading

  // --- KODE MENYIMPAN RESERVASI KE FIREBASE ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // addDoc akan membuat dokumen baru di collection "reservasi"
      await addDoc(collection(db, "reservasi"), {
        customerName: name,
        date: date,
        time: time,
        guests: guests,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      alert(`Reservation successful! We'll see you on ${date} at ${time}.`);

      // Reset form
      setDate("");
      setTime("");
      setGuests(2);
      setName("");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif text-cafe-brown mb-3">
            Book Your Table
          </h1>
          <p className="text-cafe-olive">
            Select your preferred time and we'll have everything ready for you.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-sm font-medium text-cafe-brown uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-cafe-gold focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-cafe-brown uppercase tracking-wider">
                  Number of Guests
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-cafe-gold focus:border-transparent transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-cafe-brown uppercase tracking-wider">
                  Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-cafe-gold focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-cafe-brown uppercase tracking-wider">
                  Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-gray-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-cafe-gold focus:border-transparent transition-all appearance-none"
                  >
                    <option value="" disabled>
                      Select a time
                    </option>
                    {[
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-cafe-brown text-white py-4 rounded-xl font-medium text-lg hover:bg-cafe-olive transition-colors shadow-lg flex justify-center items-center"
            >
              {isSubmitting ? "Submitting..." : "Confirm Reservation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminHomePage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- KODE MENAMPILKAN DATA DARI FIREBASE ---
  useEffect(() => {
    // Membuat query ke collection "reservasi", diurutkan dari yang terbaru
    const q = query(collection(db, "reservasi"), orderBy("createdAt", "desc"));

    // onSnapshot akan realtime-update setiap ada perubahan data
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Reservation[];

        setReservations(data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      },
    );

    // Cleanup saat komponen dibongkar
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: Reservation["status"],
  ) => {
    try {
      // Mengubah status dokumen spesifik di Firebase
      const reservasiRef = doc(db, "reservasi", id);
      await updateDoc(reservasiRef, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-cafe-brown mb-2">
              Dashboard
            </h1>
            <p className="text-cafe-olive">Manage incoming reservations</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="bg-cafe-brown/10 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-cafe-brown" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">
                  Total
                </p>
                <p className="text-xl font-bold text-cafe-brown">
                  {reservations.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden shadow-lg border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cafe-brown/5 text-cafe-brown text-sm uppercase tracking-wider font-semibold border-b border-gray-100">
                  <th className="p-5">Customer</th>
                  <th className="p-5">Date & Time</th>
                  <th className="p-5">Guests</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      Loading reservations...
                    </td>
                  </tr>
                ) : reservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      No reservations found.
                    </td>
                  </tr>
                ) : (
                  reservations.map((res) => (
                    <tr
                      key={res.id}
                      className="bg-white hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-5">
                        <div className="font-medium text-cafe-brown">
                          {res.customerName}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{res.id.slice(0, 6)}
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-cafe-brown">{res.date}</div>
                        <div className="text-sm text-gray-500">{res.time}</div>
                      </td>
                      <td className="p-5 text-cafe-brown">{res.guests} pax</td>
                      <td className="p-5">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                            res.status === "confirmed" &&
                              "bg-green-100 text-green-700",
                            res.status === "pending" &&
                              "bg-yellow-100 text-yellow-700",
                            res.status === "cancelled" &&
                              "bg-red-100 text-red-700",
                          )}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                        {res.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(res.id, "confirmed")
                            }
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Confirm"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {(res.status === "pending" ||
                          res.status === "confirmed") && (
                          <button
                            onClick={() =>
                              handleStatusChange(res.id, "cancelled")
                            }
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("customer");

  // --- KODE LOGIN DENGAN FIREBASE ---
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setIsLoggedIn(true);
      setCurrentPage("home");

      // Untuk testing: Jika email admin, set role ke admin
      // TODO: Ganti email di bawah ini dengan email milikmu yang akan dijadikan Admin
      if (user.email === "mirejrohmad@gmail.com") {
        setUserRole("admin");
      } else {
        setUserRole("customer");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUserRole("customer");
      setCurrentPage("landing");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-cafe-cream selection:bg-cafe-gold/30">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userRole={userRole}
      />

      <main>
        <AnimatePresence mode="wait">
          {currentPage === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage
                onStart={() =>
                  isLoggedIn ? setCurrentPage("home") : setCurrentPage("login")
                }
              />
            </motion.div>
          )}

          {currentPage === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage onLogin={handleLogin} />
            </motion.div>
          )}

          {currentPage === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {userRole === "admin" ? <AdminHomePage /> : <HomePage />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
