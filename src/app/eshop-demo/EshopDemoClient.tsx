"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toteBagImg from "@/assets/2150916679.jpg";
import Link from "next/link";
import sgkLogo from "@/assets/sgk-logo.png";
import {
    ShoppingBag, Search, X, Star, ShieldCheck, ShoppingCart, CreditCard,
    CheckCircle2, Package, ArrowRight, ArrowLeft, Heart, Truck, Plus, Minus,
    User, SlidersHorizontal, Mail, Facebook, Instagram, Twitter, Clock, LogOut, Zap, Lock
} from "lucide-react";

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */
interface Product {
    id: number; name: string; price: number; oldPrice?: number;
    img: string; imgs: string[]; cat: string; rating: number; reviews: number;
    badge?: string; desc: string; colors: string[]; sizes: string[];
}
interface CartItem extends Product { qty: number; selSize: string; selColor: string; }
interface Order { id: string; date: string; items: CartItem[]; total: number; status: string; }

const CATS = ["Όλα", "Φορέματα", "Πλεκτά", "Παλτό", "Τσάντες", "Αξεσουάρ"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "One Size"];

const PRODUCTS: Product[] = [
    {
        id: 1, name: "Φόρεμα Midi Silk Noir", price: 299, oldPrice: 420, img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800"],
        cat: "Φορέματα", rating: 4.9, reviews: 124, badge: "Νέα Άφιξη",
        desc: "Κομψό midi φόρεμα από 100% Ιταλικό μετάξι. Κρυφό φερμουάρ, τελειωμένο στο χέρι.",
        colors: ["#000", "#8B0000", "#1a1a3e"], sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 2, name: "Cashmere Ζιβάγκο Premium", price: 185, img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800"],
        cat: "Πλεκτά", rating: 4.8, reviews: 89,
        desc: "Από βιώσιμο cashmere, ριμπ τελείωμα σε μανίκια και στρίφωμα. Χαλαρή εφαρμογή.",
        colors: ["#C4A882", "#2F2F2F", "#F5F5DC"], sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 3, name: "Δερμάτινη Tote Bag Signature", price: 490, oldPrice: 650,
        img: typeof toteBagImg === 'string' ? toteBagImg : (toteBagImg as any).src,
        imgs: [typeof toteBagImg === 'string' ? toteBagImg : (toteBagImg as any).src],
        cat: "Τσάντες", rating: 5.0, reviews: 42, badge: "Limited",
        desc: "Χειροποίητη, full-grain δέρμα, εσωτερική θήκη laptop, ορειχάλκινα εξαρτήματα.",
        colors: ["#5C4033", "#000"], sizes: ["One Size"]
    },
    {
        id: 4, name: "Oversized Trench Παλτό", price: 380, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800"],
        cat: "Παλτό", rating: 4.7, reviews: 67,
        desc: "Αδιάβροχο gabardine, διπλοκούμπωτο, αποσπώμενη ζώνη, πλήρως φοδραρισμένο.",
        colors: ["#C4A882", "#2F2F2F"], sizes: ["S", "M", "L"]
    },
    {
        id: 5, name: "Χρυσά Κρίκοι Σκουλαρίκια", price: 95, img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800"],
        cat: "Αξεσουάρ", rating: 4.6, reviews: 210,
        desc: "18K επίχρυσα, υποαλλεργικά, ελαφριά, ιδανικά για καθημερινή χρήση.",
        colors: ["#FFD700", "#C0C0C0"], sizes: ["One Size"]
    },
    {
        id: 6, name: "Maxi Φόρεμα Floral", price: 259, oldPrice: 340, img: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80&w=800"],
        cat: "Φορέματα", rating: 4.5, reviews: 38, badge: "-24%",
        desc: "Αέρινο maxi φόρεμα με floral τύπωμα. 100% βαμβάκι, τέλειο για ανοιξιάτικες εξόδους.",
        colors: ["#FFF5EE", "#E8D5B7"], sizes: ["XS", "S", "M", "L", "XL"]
    },
    {
        id: 7, name: "Μάλλινο Πόντσο Cape", price: 220, img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800"],
        cat: "Παλτό", rating: 4.4, reviews: 31,
        desc: "Μαλακό μάλλινο πόντσο, one size, ιδανικό για layering στο φθινόπωρο.",
        colors: ["#8B7355", "#333"], sizes: ["One Size"]
    },
    {
        id: 8, name: "Δερμάτινη Crossbody Mini", price: 180, img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800",
        imgs: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800"],
        cat: "Τσάντες", rating: 4.8, reviews: 95,
        desc: "Μικρή crossbody τσάντα από γνήσιο δέρμα, ρυθμιζόμενο λουράκι.",
        colors: ["#000", "#8B4513", "#800020"], sizes: ["One Size"]
    },
];

const ORDER_HISTORY: Order[] = [
    { id: "#MODA-2026-4821", date: "15 Φεβ 2026", items: [], total: 484, status: "Παραδόθηκε" },
    { id: "#ORD-2026-3190", date: "02 Ιαν 2026", items: [], total: 299, status: "Παραδόθηκε" },
    { id: "#ORD-2025-9912", date: "18 Δεκ 2025", items: [], total: 185, status: "Ακυρώθηκε" },
];

const HERO_SLIDES = [
    { img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070", sub: "Συλλογή Άνοιξη 2026", title: "Η Νέα\nΕποχή Στυλ", cta: "Ανακαλύψτε Τώρα" },
    { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071", sub: "Exclusive Collection", title: "Κομψότητα\nΧωρίς Όρια", cta: "Δείτε Περισσότερα" },
    { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070", sub: "Premium Essentials", title: "Διαχρονικό\nΣτυλ", cta: "Εξερευνήστε" },
];

export default function EshopDemoClient() {
    type View = "home" | "product" | "checkout" | "success" | "profile" | "shipping" | "returns" | "terms" | "privacy";
    const [view, setView] = useState<View>("home");
    const [selProd, setSelProd] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [selSize, setSelSize] = useState(""); const [selColor, setSelColor] = useState("");
    const [activeCat, setActiveCat] = useState("Όλα");
    const [search, setSearch] = useState(""); const [sortBy, setSortBy] = useState("default");
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [imgIdx, setImgIdx] = useState(0); const [checkStep, setCheckStep] = useState(1);
    const [newsletter, setNewsletter] = useState("");
    const [newsSuccess, setNewsSuccess] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 700]);
    const [filterSizes, setFilterSizes] = useState<string[]>([]);
    const prodRef = useRef<HTMLDivElement>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [heroSlide, setHeroSlide] = useState(0);

    const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "cod">("card");
    const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "" });
    const updateCard = (field: string, val: string) => {
        const newData = { ...cardData, [field]: val };
        setCardData(newData);
        setCardErrors(prev => prev.filter(e => e !== field));
        
        if (field === "number") {
            if (val.startsWith("4")) setCardType("visa");
            else if (val.startsWith("5")) setCardType("mastercard");
            else setCardType(null);
        }
    };
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardErrors, setCardErrors] = useState<string[]>([]);
    const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);

    // Form Data State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        zip: "",
        notes: ""
    });
    const [formErrors, setFormErrors] = useState<string[]>([]);

    // Auth State
    const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    const [authForm, setAuthForm] = useState({ fullName: "", email: "", password: "" });
    const [authError, setAuthError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("moda_auth_session");
        if (savedUser) setUser(JSON.parse(savedUser));
        
        const savedView = localStorage.getItem("moda_active_view");
        if (savedView) setView(savedView as View);
        
        const savedStep = localStorage.getItem("moda_checkout_step");
        if (savedStep) setCheckStep(parseInt(savedStep));
        
        const savedCart = localStorage.getItem("moda_active_cart");
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedProdId = localStorage.getItem("moda_selected_prod");
        if (savedProdId) {
            const p = PRODUCTS.find(x => x.id === parseInt(savedProdId));
            if (p) setSelProd(p);
            else if (savedView === "product") setView("home");
        } else if (savedView === "product") {
            setView("home");
        }

        setMounted(true);
    }, []);

    useEffect(() => {
        if (selProd) localStorage.setItem("moda_selected_prod", selProd.id.toString());
        else localStorage.removeItem("moda_selected_prod");
    }, [selProd]);

    useEffect(() => {
        localStorage.setItem("moda_active_view", view);
    }, [view]);

    useEffect(() => {
        localStorage.setItem("moda_checkout_step", checkStep.toString());
    }, [checkStep]);

    useEffect(() => {
        localStorage.setItem("moda_active_cart", JSON.stringify(cart));
    }, [cart]);

    const handleRegister = () => {
        if (!authForm.fullName || !authForm.email || !authForm.password) return setAuthError("Συμπληρώστε όλα τα πεδία");
        const users = JSON.parse(localStorage.getItem("moda_user_db") || "[]");
        if (users.find((u: any) => u.email === authForm.email)) return setAuthError("Το email υπάρχει ήδη");
        
        const newUser = { fullName: authForm.fullName, email: authForm.email, password: authForm.password };
        users.push(newUser);
        localStorage.setItem("moda_user_db", JSON.stringify(users));
        setUser({ fullName: authForm.fullName, email: authForm.email });
        localStorage.setItem("moda_auth_session", JSON.stringify({ fullName: authForm.fullName, email: authForm.email }));
        setView("home");
        setAuthError("");
    };

    const handleLogin = () => {
        const users = JSON.parse(localStorage.getItem("moda_user_db") || "[]");
        const found = users.find((u: any) => u.email === authForm.email && u.password === authForm.password);
        if (found) {
            setUser({ fullName: found.fullName, email: found.email });
            localStorage.setItem("moda_auth_session", JSON.stringify({ fullName: found.fullName, email: found.email }));
            setView("home");
            setAuthError("");
        } else {
            setAuthError("Λάθος email ή κωδικός");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("moda_auth_session");
        setView("home");
    };

    const nextSlide = useCallback(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), []);
    useEffect(() => {
        if (view !== "home") return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [view, nextSlide]);

    const [offerPrice, setOfferPrice] = useState(0);
    const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" });
    useEffect(() => {
        const initOffer = () => {
            const now = Date.now();
            const storedEnd = localStorage.getItem("moda_offer_end");
            const storedPrice = localStorage.getItem("moda_offer_price");
            if (storedEnd && storedPrice && parseInt(storedEnd) > now) {
                setOfferPrice(parseInt(storedPrice));
                return parseInt(storedEnd);
            }
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const endMs = end.getTime();
            const price = Math.floor(Math.random() * (800 - 700 + 1)) + 700;
            localStorage.setItem("moda_offer_end", endMs.toString());
            localStorage.setItem("moda_offer_price", price.toString());
            setOfferPrice(price);
            return endMs;
        };
        const endTime = initOffer();
        const tick = setInterval(() => {
            const diff = Math.max(0, endTime - Date.now());
            if (diff <= 0) {
                localStorage.removeItem("moda_offer_end");
                localStorage.removeItem("moda_offer_price");
                clearInterval(tick);
                return;
            }
            const ts = Math.floor(diff / 1000);
            setCountdown({
                h: String(Math.floor(ts / 3600)).padStart(2, "0"),
                m: String(Math.floor((ts % 3600) / 60)).padStart(2, "0"),
                s: String(ts % 60).padStart(2, "0"),
            });
        }, 1000);
        return () => clearInterval(tick);
    }, []);

    const searchResults = useMemo(() => {
        if (!search.trim()) return [];
        return PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
    }, [search]);

    const filtered = useMemo(() => {
        let list = PRODUCTS.filter(p => {
            if (activeCat !== "Όλα" && p.cat !== activeCat) return false;
            if (!p.name.toLowerCase().includes(search.toLowerCase())) return false;
            if (p.price < filterPrice[0] || p.price > filterPrice[1]) return false;
            if (filterSizes.length > 0 && !p.sizes.some(s => filterSizes.includes(s))) return false;
            return true;
        });
        if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
        if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
        if (sortBy === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
        return list;
    }, [activeCat, search, sortBy, filterPrice, filterSizes]);

    const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const cartCount = cart.reduce((s, i) => s + i.qty, 0);

    const addToCart = (p: Product) => {
        const sz = selSize || p.sizes[0]; const cl = selColor || p.colors[0];
        setCart(prev => {
            const ex = prev.find(i => i.id === p.id && i.selSize === sz && i.selColor === cl);
            if (ex) return prev.map(i => (i.id === p.id && i.selSize === sz && i.selColor === cl) ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...p, qty: 1, selSize: sz, selColor: cl }];
        });
        setCartOpen(true);
    };

    const openProd = (p: Product) => { setSelProd(p); setImgIdx(0); setSelSize(p.sizes[0]); setSelColor(p.colors[0]); setView("product"); window.scrollTo(0, 0); };
    const toggleWish = (id: number) => setWishlist(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
    const selectCat = (c: string) => { setActiveCat(c); setTimeout(() => prodRef.current?.scrollIntoView({ behavior: "smooth" }), 100); };
    const toggleFilterSize = (s: string) => setFilterSizes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);

    const validateCheckout = () => {
        const required: (keyof typeof formData)[] = ["fullName", "email", "phone", "city", "address", "zip"];
        const errs = required.filter(f => !formData[f].trim());
        setFormErrors(errs);
        if (errs.length === 0) {
            setCheckStep(3);
            window.scrollTo(0, 0);
            return true;
        }
        return false;
    };

    const handleCheckoutSubmit = () => {
        if (paymentMethod === "card") {
            const errs = [];
            if (!cardData.number || cardData.number.length < 10) errs.push("number");
            if (!cardData.expiry || !cardData.expiry.includes("/")) errs.push("expiry");
            if (!cardData.cvv || cardData.cvv.length < 3) errs.push("cvv");
            
            if (errs.length > 0) {
                setCardErrors(errs);
                return;
            }
        }

        setIsProcessing(true);
        // Simulate real API call
        setTimeout(() => {
            setIsProcessing(false);
            setView("success");
            setCart([]);
            setCheckStep(1);
            window.scrollTo(0, 0);
        }, 2500);
    };

    return (
        <div suppressHydrationWarning={true} className="min-h-screen bg-[#FAFAF8] text-[#111] font-sans">

            {/* ========== HEADER ========== */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-100">
                <div className="bg-[#111] text-white text-center py-2 text-[10px] font-bold tracking-[.2em] uppercase">
                    Δωρεάν Αποστολή σε παραγγελίες άνω των €150 · Επιστροφές 30 ημερών
                </div>
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <button onClick={() => { setView("home"); window.scrollTo(0, 0); }} className="flex items-center gap-2 group shrink-0">
                        <div className="text-2xl sm:text-3xl font-black tracking-tighter">
                            <span className="text-[#111]">MODA</span>
                        </div>
                    </button>
                    <div ref={searchRef} className="hidden md:flex flex-1 max-w-md mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 z-10" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                            placeholder="Αναζήτηση προϊόντος..."
                            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-zinc-50 border border-zinc-100 text-sm outline-none focus:ring-2 ring-[#C5A267]/30 relative z-10"
                        />
                        <AnimatePresence>
                            {searchFocused && search.trim().length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-zinc-100 shadow-2xl overflow-hidden z-50"
                                >
                                    {searchResults.length > 0 ? (
                                        <div className="py-2">
                                            <p className="px-4 py-2 text-[9px] font-black uppercase tracking-widest opacity-30">{searchResults.length} αποτελέσματα</p>
                                            {searchResults.map(p => (
                                                <button
                                                    key={p.id}
                                                    onMouseDown={() => { openProd(p); setSearch(""); }}
                                                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors text-left"
                                                >
                                                    <div className="w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                                                        <img src={p.img} className="w-full h-full object-cover" alt={p.name} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-sm truncate">{p.name}</p>
                                                        <p className="text-[10px] opacity-40">{p.cat}</p>
                                                    </div>
                                                    <div className="shrink-0">
                                                        <span className="font-black text-sm">€{p.price}</span>
                                                        {p.oldPrice && <span className="text-[10px] line-through opacity-30 ml-1">€{p.oldPrice}</span>}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center">
                                            <p className="text-sm font-bold opacity-30">Δεν βρέθηκαν αποτελέσματα</p>
                                            <p className="text-xs opacity-20 mt-1">Δοκιμάστε διαφορετική αναζήτηση</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <button onClick={() => { setView("profile"); window.scrollTo(0, 0); }} className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-[#111] text-white flex items-center justify-center text-[10px] font-black group-hover:bg-[#C5A267] transition-all uppercase">
                                    {user.fullName.substring(0, 2)}
                                </div>
                                <span className="hidden lg:inline text-[10px] font-black uppercase tracking-widest">{user.fullName.split(" ")[0]}</span>
                            </button>
                        ) : (
                            <button onClick={() => { setView("profile"); setAuthMode("login"); window.scrollTo(0, 0); }} className="relative flex items-center gap-2 group">
                                <User size={20} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100">Είσοδος</span>
                            </button>
                        )}
                        <button className="relative" onClick={() => setCartOpen(true)}>
                            <ShoppingBag size={20} />
                            {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#C5A267] text-white w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black">{cartCount}</span>}
                        </button>
                    </div>
                </div>
                {view === "home" && (
                    <div className="border-t border-zinc-50 overflow-x-auto no-scrollbar">
                        <div className="container mx-auto px-4 flex items-center gap-1 py-1.5">
                            {CATS.map(c => (
                                <button key={c} onClick={() => selectCat(c)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeCat === c ? "bg-[#111] text-white" : "hover:bg-zinc-100"}`}>{c}</button>
                            ))}
                        </div>
                    </div>
                )}
            </header>

            <main className={`${view === "home" ? "pt-[170px]" : "pt-[130px]"} pb-20`}>
                <AnimatePresence mode="wait">

                    {/* ========== HOME ========== */}
                    {view === "home" && (
                        <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className="relative h-[60vh] sm:h-[70vh] rounded-none sm:rounded-3xl overflow-hidden mb-10 sm:mb-16 -mt-[170px] pt-[170px] sm:mt-0 sm:pt-0 sm:mx-4 md:mx-auto md:container md:px-0">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={heroSlide}
                                        src={HERO_SLIDES[heroSlide].img}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="Fashion Hero"
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`text-${heroSlide}`}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className="absolute bottom-8 left-8 md:bottom-16 md:left-16 z-20"
                                    >
                                        <p className="text-white/70 text-xs font-bold uppercase tracking-[.3em] mb-3">{HERO_SLIDES[heroSlide].sub}</p>
                                        <h1 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tight leading-none whitespace-pre-line">{HERO_SLIDES[heroSlide].title}</h1>
                                        <button onClick={() => prodRef.current?.scrollIntoView({ behavior: "smooth" })} className="bg-white text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#C5A267] hover:text-white transition-all shadow-xl">{HERO_SLIDES[heroSlide].cta}</button>
                                    </motion.div>
                                </AnimatePresence>

                                <button onClick={() => setHeroSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <ArrowLeft size={16} />
                                </button>
                                <button onClick={() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <ArrowRight size={16} />
                                </button>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {HERO_SLIDES.map((_, i) => (
                                        <button key={i} onClick={() => setHeroSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === i ? "w-8 bg-white" : "w-3 bg-white/40"}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="container mx-auto px-4">
                                <div ref={prodRef} className="scroll-mt-48">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <p className="text-sm opacity-50 font-bold">{filtered.length} Προϊόντα{activeCat !== "Όλα" && ` στα "${activeCat}"`}</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${filtersOpen ? "bg-[#111] text-white border-[#111]" : "border-zinc-200 hover:bg-zinc-50"}`}>
                                                <SlidersHorizontal size={14} /> Φίλτρα {(filterSizes.length > 0 || filterPrice[0] > 0 || filterPrice[1] < 700) && <span className="bg-[#C5A267] text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center ml-1">!</span>}
                                            </button>
                                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs font-bold bg-white border border-zinc-200 px-4 py-2 rounded-full outline-none">
                                                <option value="default">Ταξινόμηση</option>
                                                <option value="price-asc">Τιμή ↑</option>
                                                <option value="price-desc">Τιμή ↓</option>
                                                <option value="rating">Αξιολόγηση</option>
                                            </select>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {filtersOpen && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
                                                <div className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm grid sm:grid-cols-2 gap-8">
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest mb-4">Εύρος Τιμής: €{filterPrice[0]} – €{filterPrice[1]}</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs opacity-40 w-8">Από</span>
                                                                <input type="range" min={0} max={700} step={10} value={filterPrice[0]} onChange={e => setFilterPrice([+e.target.value, filterPrice[1]])} className="flex-1 accent-[#C5A267]" />
                                                                <span className="text-xs font-bold w-10">€{filterPrice[0]}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs opacity-40 w-8">Έως</span>
                                                                <input type="range" min={0} max={700} step={10} value={filterPrice[1]} onChange={e => setFilterPrice([filterPrice[0], +e.target.value])} className="flex-1 accent-[#C5A267]" />
                                                                <span className="text-xs font-bold w-10">€{filterPrice[1]}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest mb-4">Μέγεθος</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {ALL_SIZES.map(s => (
                                                                <button key={s} onClick={() => toggleFilterSize(s)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterSizes.includes(s) ? "bg-[#111] text-white" : "bg-zinc-50 border border-zinc-100 hover:border-zinc-300"}`}>{s}</button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="sm:col-span-2 flex justify-end">
                                                        <button onClick={() => { setFilterPrice([0, 700]); setFilterSizes([]); }} className="text-xs font-bold text-red-500 hover:text-red-700">Καθαρισμός Φίλτρων</button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
                                        {filtered.map(p => (
                                            <motion.div key={p.id} layout whileHover={{ y: -6 }} className="group cursor-pointer" onClick={() => openProd(p)}>
                                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm group-hover:shadow-xl transition-all">
                                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                    {p.badge && <span className="absolute top-3 left-3 bg-[#C5A267] text-white text-[9px] font-black px-3 py-1 rounded-full">{p.badge}</span>}
                                                    <button onClick={e => { e.stopPropagation(); toggleWish(p.id); }} className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${wishlist.includes(p.id) ? "bg-red-500 text-white" : "bg-white/70 text-zinc-600 hover:bg-white"}`}>
                                                        <Heart size={14} className={wishlist.includes(p.id) ? "fill-current" : ""} />
                                                    </button>
                                                    <div className="absolute inset-x-3 bottom-3 translate-y-16 group-hover:translate-y-0 transition-transform duration-300">
                                                        <button onClick={e => { e.stopPropagation(); addToCart(p); }} className="w-full py-3 bg-[#111] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl hover:bg-[#C5A267] transition-colors">
                                                            Στο Καλάθι
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 px-1">
                                                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-30 mb-0.5">{p.cat}</p>
                                                    <h3 className="font-bold text-sm mb-1 leading-tight">{p.name}</h3>
                                                    <div className="flex items-center gap-1 mb-1">{[...Array(5)].map((_, i) => <Star key={i} size={9} className={i < Math.floor(p.rating) ? "fill-[#C5A267] text-[#C5A267]" : "text-zinc-200"} />)}<span className="text-[8px] opacity-30 ml-1">({p.reviews})</span></div>
                                                    <div className="flex items-center gap-2"><span className="text-base font-black">€{p.price}</span>{p.oldPrice && <span className="text-xs line-through opacity-30">€{p.oldPrice}</span>}</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== PRODUCT ========== */}
                    {view === "product" && selProd && (
                        <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4">
                            <button onClick={() => setView("home")} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 mb-8"><ArrowLeft size={14} /> Πίσω</button>
                            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
                                <div className="space-y-3">
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-lg"><img src={selProd.imgs[imgIdx]} className="w-full h-full object-cover" alt={selProd.name} /></div>
                                    {selProd.imgs.length > 1 && <div className="flex gap-2">{selProd.imgs.map((im, i) => (
                                        <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${imgIdx === i ? "border-[#C5A267]" : "border-transparent opacity-50"}`}><img src={im} className="w-full h-full object-cover" alt={`${selProd.name} view ${i}`} /></button>
                                    ))}</div>}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-1">{selProd.cat}</p>
                                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">{selProd.name}</h1>
                                    <div className="flex items-center gap-2 mb-4">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.floor(selProd.rating) ? "fill-[#C5A267] text-[#C5A267]" : "text-zinc-200"} />)}<span className="text-xs opacity-40">({selProd.reviews} αξιολογήσεις)</span></div>
                                    <div className="flex items-end gap-3 mb-6 pb-6 border-b border-zinc-100">
                                        <span className="text-3xl font-black">€{selProd.price}</span>{selProd.oldPrice && <span className="text-lg line-through opacity-30 mb-0.5">€{selProd.oldPrice}</span>}
                                    </div>
                                    <p className="text-sm leading-relaxed opacity-60 mb-8">{selProd.desc}</p>

                                    <div className="mb-6"><p className="text-xs font-black uppercase tracking-widest mb-3">Χρώμα</p><div className="flex gap-2">{selProd.colors.map(c => (
                                        <button key={c} onClick={() => setSelColor(c)} className={`w-9 h-9 rounded-full border-2 transition-all ${selColor === c ? "border-[#C5A267] scale-110" : "border-zinc-200"}`} style={{ backgroundColor: c }} />
                                    ))}</div></div>

                                    <div className="mb-8"><p className="text-xs font-black uppercase tracking-widest mb-3">Μέγεθος</p><div className="flex flex-wrap gap-2">{selProd.sizes.map(s => (
                                        <button key={s} onClick={() => setSelSize(s)} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${selSize === s ? "bg-[#111] text-white" : "bg-zinc-50 border border-zinc-100"}`}>{s}</button>
                                    ))}</div></div>

                                    <div className="flex gap-3 mb-8">
                                        <button onClick={() => addToCart(selProd)} className="flex-1 bg-[#111] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#C5A267] transition-all shadow-xl flex items-center justify-center gap-2"><ShoppingCart size={16} /> Προσθήκη στο Καλάθι</button>
                                        <button onClick={() => toggleWish(selProd.id)} className={`p-4 rounded-2xl border transition-all ${wishlist.includes(selProd.id) ? "bg-red-500 text-white border-red-500" : "border-zinc-200"}`}><Heart size={18} className={wishlist.includes(selProd.id) ? "fill-current" : ""} /></button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">{[{ ic: <Truck size={14} />, t: "Express Αποστολή" }, { ic: <Package size={14} />, t: "Δωρεάν Επιστροφές" }, { ic: <ShieldCheck size={14} />, t: "Ασφαλής Πληρωμή" }, { ic: <CheckCircle2 size={14} />, t: "Εγγύηση Ποιότητας" }].map((x, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-zinc-50 border border-zinc-100"><span className="opacity-40">{x.ic}</span><span className="text-[9px] font-bold uppercase">{x.t}</span></div>
                                    ))}</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== PROFILE / AUTH ========== */}
                    {view === "profile" && (
                        <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="container mx-auto px-4 max-w-3xl">
                            {!user ? (
                                <div className="bg-white rounded-[32px] border border-zinc-100 shadow-2xl overflow-hidden">
                                    <div className="grid md:grid-cols-2 text-left">
                                        <div className="bg-[#111] p-12 text-white flex flex-col justify-between min-h-[400px]">
                                            <div>
                                                <h2 className="text-3xl font-black mb-4">{authMode === "login" ? "Καλώς Ήρθατε Ξανά" : "Γίνετε Μέλος"}</h2>
                                                <p className="text-sm opacity-50 leading-relaxed">
                                                    {authMode === "login" 
                                                        ? "Συνδεθείτε για να έχετε πρόσβαση στις παραγγελίες σας και στα αγαπημένα σας προϊόντα." 
                                                        : "Δημιουργήστε λογαριασμό για να απολαύσετε προσωποποιημένη εμπειρία αγορών."}
                                                </p>
                                            </div>
                                            <div className="pt-8 border-t border-white/10 text-[10px] font-black uppercase tracking-widest opacity-30">
                                                Premium Fashion Experience
                                            </div>
                                        </div>
                                        <div className="p-12">
                                            <div className="flex gap-4 mb-8">
                                                <button onClick={() => { setAuthMode("login"); setAuthError(""); }} className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${authMode === "login" ? "border-[#C5A267] text-[#111]" : "border-transparent opacity-30 hover:opacity-100"}`}>Είσοδος</button>
                                                <button onClick={() => { setAuthMode("register"); setAuthError(""); }} className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all ${authMode === "register" ? "border-[#C5A267] text-[#111]" : "border-transparent opacity-30 hover:opacity-100"}`}>Εγγραφή</button>
                                            </div>

                                            <div className="space-y-4">
                                                {authMode === "register" && (
                                                    <div className="space-y-1 text-left">
                                                        <label className="text-[10px] font-black uppercase opacity-40">Ονοματεπώνυμο</label>
                                                        <input 
                                                            value={authForm.fullName}
                                                            onChange={e => setAuthForm({...authForm, fullName: e.target.value})}
                                                            placeholder="π.χ. Ιωάννης Παππάς"
                                                            className="w-full p-4 bg-zinc-50 rounded-2xl outline-none border border-zinc-100 focus:border-[#C5A267] transition-all text-sm font-bold"
                                                        />
                                                    </div>
                                                )}
                                                <div className="space-y-1 text-left">
                                                    <label className="text-[10px] font-black uppercase opacity-40">Email</label>
                                                    <input 
                                                        value={authForm.email}
                                                        onChange={e => setAuthForm({...authForm, email: e.target.value})}
                                                        placeholder="email@example.com"
                                                        className="w-full p-4 bg-zinc-50 rounded-2xl outline-none border border-zinc-100 focus:border-[#C5A267] transition-all text-sm font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-1 text-left">
                                                    <label className="text-[10px] font-black uppercase opacity-40">Κωδικός</label>
                                                    <input 
                                                        type="password"
                                                        value={authForm.password}
                                                        onChange={e => setAuthForm({...authForm, password: e.target.value})}
                                                        placeholder="••••••••"
                                                        className="w-full p-4 bg-zinc-50 rounded-2xl outline-none border border-zinc-100 focus:border-[#C5A267] transition-all text-sm font-bold"
                                                    />
                                                </div>

                                                {authError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wide">{authError}</p>}

                                                <button 
                                                    onClick={authMode === "login" ? handleLogin : handleRegister}
                                                    className="w-full bg-[#111] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#C5A267] transition-all mt-4"
                                                >
                                                    {authMode === "login" ? "Σύνδεση" : "Δημιουργία Λογαριασμού"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-3xl border border-zinc-100 shadow-lg overflow-hidden">
                                    <div className="bg-[#111] text-white p-10 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-full bg-[#C5A267] flex items-center justify-center text-2xl font-black uppercase text-white shadow-xl">
                                                {user.fullName.substring(0, 2)}
                                            </div>
                                            <div className="text-left">
                                                <h2 className="text-xl font-black">{user.fullName}</h2>
                                                <p className="text-xs opacity-50">{user.email} · Μέλος από Απρ 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="grid sm:grid-cols-3 gap-4 mb-10 text-left">
                                            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 text-center hover:bg-white hover:shadow-md transition-all group">
                                                <p className="text-2xl font-black group-hover:text-[#C5A267] transition-colors">{ORDER_HISTORY.length}</p>
                                                <p className="text-[10px] font-bold opacity-40 uppercase">Παραγγελίες</p>
                                            </div>
                                            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 text-center hover:bg-white hover:shadow-md transition-all group">
                                                <p className="text-2xl font-black group-hover:text-[#C5A267] transition-colors">{wishlist.length}</p>
                                                <p className="text-[10px] font-bold opacity-40 uppercase">Αγαπημένα</p>
                                            </div>
                                            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 text-center hover:bg-white hover:shadow-md transition-all group">
                                                <p className="text-2xl font-black group-hover:text-[#C5A267] transition-colors">€{ORDER_HISTORY.filter(o => o.status === "Παραδόθηκε").reduce((s, o) => s + o.total, 0)}</p>
                                                <p className="text-[10px] font-bold opacity-40 uppercase">Συνολ. Αγορές</p>
                                            </div>
                                        </div>
                                        <h3 className="font-black text-lg mb-6 flex items-center gap-2 text-left shrink-0"><Clock size={18} /> Ιστορικό Παραγγελιών</h3>
                                        <div className="space-y-4">
                                            {ORDER_HISTORY.map(o => (
                                                <div key={o.id} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl border border-zinc-100 hover:shadow-sm hover:bg-white transition-all text-left">
                                                    <div><p className="font-bold text-sm">{o.id}</p><p className="text-xs opacity-40">{o.date}</p></div>
                                                    <div className="text-right"><p className="font-black">€{o.total}</p><p className={`text-[10px] font-bold uppercase ${o.status === "Παραδόθηκε" ? "text-green-600" : "text-red-400"}`}>{o.status}</p></div>
                                                </div>
                                            ))}
                                        </div>
                                        <button onClick={() => { setView("home"); window.scrollTo(0, 0); }} className="w-full mt-8 py-4 bg-[#111] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#C5A267] transition-all flex items-center justify-center gap-2 font-black"><ArrowLeft size={14} /> Επιστροφή στις Αγορές</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* ========== CHECKOUT ========== */}
                    {view === "checkout" && (
                        <motion.div key="check" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4 max-w-5xl">
                            <div className="flex items-center justify-center gap-2 mb-12">{["Καλάθι", "Στοιχεία", "Πληρωμή"].map((s, i) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black ${checkStep > i ? "bg-green-500 text-white" : checkStep === i + 1 ? "bg-[#111] text-white" : "bg-zinc-200"}`}>{checkStep > i ? <CheckCircle2 size={12} /> : i + 1}</div>
                                    <span className={`text-xs font-bold hidden sm:inline ${checkStep >= i + 1 ? "" : "opacity-30"}`}>{s}</span>
                                    {i < 2 && <div className={`w-8 h-0.5 mx-1 ${checkStep > i + 1 ? "bg-green-500" : "bg-zinc-200"}`} />}
                                </div>
                            ))}</div>
                            <div className="grid lg:grid-cols-5 gap-10">
                                <div className="lg:col-span-3">
                                    {checkStep === 1 && (<div className="space-y-4">
                                        <h2 className="text-xl font-black mb-4">Καλάθι ({cartCount})</h2>
                                        {cart.length === 0 ? <p className="py-10 text-center opacity-40">Το καλάθι σας είναι άδειο</p> : cart.map(item => (<div key={`${item.id}-${item.selSize}`} className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-100 group">
                                            <div onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) openProd(p); }} className="w-20 h-28 rounded-lg overflow-hidden shrink-0 cursor-pointer"><img src={item.img} className="w-full h-full object-cover" alt={item.name} /></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between mb-1"><h4 onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) openProd(p); }} className="font-bold text-sm cursor-pointer hover:text-[#C5A267] transition-colors">{item.name}</h4><button onClick={() => setCart(c => c.filter(x => !(x.id === item.id && x.selSize === item.selSize)))} className="text-red-400"><X size={14} /></button></div>
                                                <p className="text-[10px] opacity-40 mb-3">Μέγ: {item.selSize} · <span className="inline-block w-3 h-3 rounded-full border align-middle" style={{ backgroundColor: item.selColor }} /></p>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 bg-zinc-50 px-3 py-1 rounded-lg border border-zinc-100">
                                                        <button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}><Minus size={12} /></button>
                                                        <span className="text-xs font-black">{item.qty}</span>
                                                        <button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: x.qty + 1 } : x))}><Plus size={12} /></button>
                                                    </div>
                                                    <span className="font-black">€{item.price * item.qty}</span>
                                                </div>
                                            </div>
                                        </div>))}
                                        <button onClick={() => setCheckStep(2)} disabled={cart.length === 0} className="w-full bg-[#111] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#C5A267] transition-all disabled:opacity-50">Συνέχεια <ArrowRight size={12} className="inline ml-1" /></button>
                                    </div>)}
                                    {checkStep === 2 && (
                                        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                                            <h2 className="text-2xl font-black mb-8">Στοιχεία Αποστολής</h2>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Ονοματεπώνυμο</label>
                                                    <input 
                                                        value={formData.fullName}
                                                        onChange={e => { setFormData({...formData, fullName: e.target.value}); setFormErrors(prev => prev.filter(err => err !== "fullName")); }}
                                                        placeholder="π.χ. Ιωάννης Παπαδόπουλος"
                                                        className={`w-full p-4 bg-zinc-50 rounded-2xl outline-none border transition-all font-bold text-sm ${formErrors.includes("fullName") ? "border-red-500 ring-2 ring-red-100" : "border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20"}`} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Email</label>
                                                    <input 
                                                        value={formData.email}
                                                        onChange={e => { setFormData({...formData, email: e.target.value}); setFormErrors(prev => prev.filter(err => err !== "email")); }}
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        className={`w-full p-4 bg-zinc-50 rounded-2xl outline-none border transition-all font-bold text-sm ${formErrors.includes("email") ? "border-red-500 ring-2 ring-red-100" : "border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20"}`} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Τηλέφωνο</label>
                                                    <input 
                                                        value={formData.phone}
                                                        onChange={e => { setFormData({...formData, phone: e.target.value}); setFormErrors(prev => prev.filter(err => err !== "phone")); }}
                                                        placeholder="69XXXXXXXX"
                                                        className={`w-full p-4 bg-zinc-50 rounded-2xl outline-none border transition-all font-bold text-sm ${formErrors.includes("phone") ? "border-red-500 ring-2 ring-red-100" : "border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20"}`} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Πόλη</label>
                                                    <input 
                                                        value={formData.city}
                                                        onChange={e => { setFormData({...formData, city: e.target.value}); setFormErrors(prev => prev.filter(err => err !== "city")); }}
                                                        placeholder="π.χ. Αθήνα"
                                                        className={`w-full p-4 bg-zinc-50 rounded-2xl outline-none border transition-all font-bold text-sm ${formErrors.includes("city") ? "border-red-500 ring-2 ring-red-100" : "border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20"}`} 
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Διεύθυνση & Αριθμός</label>
                                                    <input 
                                                        value={formData.address}
                                                        onChange={e => { setFormData({...formData, address: e.target.value}); setFormErrors(prev => prev.filter(err => err !== "address")); }}
                                                        placeholder="π.χ. Ερμού 25"
                                                        className={`w-full p-4 bg-zinc-50 rounded-2xl outline-none border transition-all font-bold text-sm ${formErrors.includes("address") ? "border-red-500 ring-2 ring-red-100" : "border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20"}`} 
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Ταχυδρομικός Κώδικας</label>
                                                    <input 
                                                        value={formData.zip}
                                                        onChange={e => { setFormData({...formData, zip: e.target.value}); setFormErrors(prev => prev.filter(err => err !== "zip")); }}
                                                        placeholder="12345"
                                                        className={`w-full p-4 bg-zinc-50 rounded-2xl outline-none border transition-all font-bold text-sm ${formErrors.includes("zip") ? "border-red-500 ring-2 ring-red-100" : "border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20"}`} 
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Σημειώσεις Παραγγελίας (Προαιρετικό)</label>
                                                    <textarea 
                                                        value={formData.notes}
                                                        onChange={e => setFormData({...formData, notes: e.target.value})}
                                                        placeholder="Οδηγίες για τον courier κλπ."
                                                        className="w-full p-4 bg-zinc-50 rounded-2xl outline-none border border-zinc-100 focus:border-[#C5A267] focus:ring-1 ring-[#C5A267]/20 transition-all font-bold text-sm min-h-[100px]" 
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                                <button onClick={() => setCheckStep(1)} className="flex-1 border border-zinc-200 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-50 transition-colors">Επιστροφή στο καλάθι</button>
                                                <div className="flex-[2] flex flex-col gap-2">
                                                    <button onClick={validateCheckout} className="w-full bg-[#111] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#C5A267] transition-all shadow-xl shadow-black/10">Συνέχεια στην Πληρωμή <ArrowRight size={14} className="inline ml-1" /></button>
                                                    {formErrors.length > 0 && <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider text-center animate-pulse">Παρακαλούμε συμπληρώστε όλα τα απαιτούμενα πεδία</p>}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {checkStep === 3 && (
                                        <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm">
                                            <h2 className="text-2xl font-black mb-8">Τρόπος Πληρωμής</h2>
                                            <div className="space-y-4 mb-8">
                                                {/* Stripe Option */}
                                                <button 
                                                    onClick={() => setPaymentMethod("card")}
                                                    className={`w-full p-6 rounded-3xl border-2 transition-all flex flex-col gap-5 text-left ${paymentMethod === "card" ? "border-[#635BFF] bg-[#635BFF]/5" : "border-zinc-100 bg-white hover:border-zinc-200"}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-2.5 rounded-xl ${paymentMethod === "card" ? "bg-[#635BFF] text-white" : "bg-zinc-100 text-zinc-400"}`}>
                                                                <CreditCard size={22} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-base flex items-center gap-2">
                                                                    Πιστωτική / Χρεωστική Κάρτα
                                                                    <span className="bg-[#635BFF] text-white text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter">Stripe</span>
                                                                </p>
                                                                <p className="text-[10px] opacity-40 uppercase font-black tracking-widest mt-0.5">Ασφαλής πληρωμή μέσω Stripe</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                                            {paymentMethod === "card" && <CheckCircle2 size={18} className="text-[#635BFF]" />}
                                                        </div>
                                                    </div>
                                                    
                                                    {paymentMethod === "card" && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pt-6 border-t border-[#635BFF]/20 space-y-6">
                                                            <div className={`p-5 rounded-[20px] border-2 transition-all ${cardErrors.length > 0 ? "border-red-500 bg-red-50/30" : "border-zinc-100 bg-white"}`}>
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center gap-3 flex-1">
                                                                        <Lock size={14} className="opacity-20" />
                                                                        <input 
                                                                            value={cardData.number}
                                                                            onChange={e => updateCard("number", e.target.value)}
                                                                            placeholder="•••• •••• •••• ••••"
                                                                            className={`w-full outline-none text-sm font-mono tracking-widest bg-transparent ${cardErrors.includes("number") ? "text-red-500" : ""}`}
                                                                        />
                                                                    </div>
                                                                    <div className="flex gap-2 shrink-0">
                                                                        <div className={`w-8 h-5 rounded flex items-center justify-center text-[8px] font-black italic text-white transition-all ${cardType === "visa" ? "bg-[#1a1f71] opacity-100 scale-110 shadow-md" : "bg-zinc-200 opacity-20"}`}>VISA</div>
                                                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className={`h-4 transition-all ${cardType === "mastercard" ? "opacity-100 scale-110" : "opacity-10 grayscale"}`} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 pt-4 border-t border-zinc-100">
                                                                    <input 
                                                                        value={cardData.expiry}
                                                                        onChange={e => updateCard("expiry", e.target.value)}
                                                                        placeholder="MM / YY"
                                                                        className={`w-full outline-none text-xs font-bold uppercase tracking-tighter bg-transparent ${cardErrors.includes("expiry") ? "text-red-500" : ""}`}
                                                                    />
                                                                    <div className="w-px h-4 bg-zinc-100" />
                                                                    <input 
                                                                        value={cardData.cvv}
                                                                        onChange={e => updateCard("cvv", e.target.value)}
                                                                        placeholder="CVC"
                                                                        className={`w-3/4 outline-none text-xs font-mono text-center bg-transparent ${cardErrors.includes("cvv") ? "text-red-500" : ""}`}
                                                                    />
                                                                    <ShieldCheck size={14} className="opacity-20" />
                                                                </div>
                                                            </div>
                                                            
                                                            {cardErrors.length > 0 && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-pulse">Ελέγξτε τα στοιχεία της κάρτας</p>}

                                                            <div className="flex items-center justify-center gap-2 opacity-30">
                                                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3.5 grayscale" />
                                                                <span className="text-[9px] font-black uppercase tracking-widest">Secure Checkout · SSL Encrypted</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </button>

                                                {/* Bank Deposit */}
                                                <button 
                                                    onClick={() => setPaymentMethod("bank")}
                                                    className={`w-full p-5 rounded-2xl border-2 transition-all flex flex-col gap-4 text-left ${paymentMethod === "bank" ? "border-[#C5A267] bg-[#C5A267]/5" : "border-zinc-100 bg-white hover:border-zinc-200"}`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${paymentMethod === "bank" ? "bg-[#C5A267] text-white" : "bg-zinc-100 text-zinc-400"}`}><ShieldCheck size={20} /></div>
                                                            <div>
                                                                <p className="font-bold text-sm">Κατάθεση σε Τραπεζικό Λογαριασμό</p>
                                                                <p className="text-[10px] opacity-40 uppercase font-bold tracking-tight">Eurobank, Piraeus, Alpha Bank, Εθνική</p>
                                                            </div>
                                                        </div>
                                                        {paymentMethod === "bank" && <CheckCircle2 size={18} className="text-[#C5A267]" />}
                                                    </div>
                                                    
                                                    {paymentMethod === "bank" && (
                                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pt-4 border-t border-[#C5A267]/20">
                                                            <div className="bg-[#C5A267]/10 p-4 rounded-xl space-y-2">
                                                                <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase tracking-wider">Οδηγίες:</p>
                                                                <p className="text-[11px] leading-relaxed">Παρακαλούμε καταθέστε το ποσό στο IBAN της τράπεζας που σας εξυπηρετεί με αιτιολογία τον Αριθμό Παραγγελίας.</p>
                                                                <div className="pt-2">
                                                                    <p className="text-[10px] font-black">IBAN: GR74 0172 0000 0000 1234 5678 901</p>
                                                                    <p className="text-[9px] opacity-40">Δικαιούχος: Ιωαννίδου Ελένη</p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </button>

                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <button onClick={() => setCheckStep(2)} className="flex-1 border border-zinc-200 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-50 transition-colors">Πίσω στα στοιχεία</button>
                                                <button 
                                                    onClick={handleCheckoutSubmit}
                                                    disabled={isProcessing}
                                                    className="flex-[2] bg-[#111] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#C5A267] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                            Επεξεργασία...
                                                        </>
                                                    ) : (
                                                        <>Ολοκλήρωση Παραγγελίας <Zap size={14} className="text-[#C5A267]" /></>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="lg:col-span-2">
                                    <div className="sticky top-[200px] bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                                        <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Σύνοψη</h3>
                                        <div className="space-y-2 text-sm mb-4">{cart.map(i => <div key={i.id + i.selSize} className="flex justify-between"><span onClick={() => { const p = PRODUCTS.find(x => x.id === i.id); if (p) openProd(p); }} className="opacity-40 cursor-pointer hover:opacity-70 transition-opacity">{i.qty}x {i.name}</span><span className="font-bold">€{i.price * i.qty}</span></div>)}</div>
                                        <div className="pt-3 border-t border-zinc-200 space-y-1"><div className="flex justify-between text-sm"><span className="opacity-40">Μεταφορικά</span><span className="text-green-600 font-bold">ΔΩΡΕΑΝ</span></div><div className="flex justify-between text-xl font-black pt-2"><span>Σύνολο</span><span>€{cartTotal}</span></div></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== SUCCESS ========== */}
                    {view === "success" && (
                        <motion.div key="ok" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 container mx-auto px-4 max-w-2xl text-left">
                            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
                                <CheckCircle2 size={48} />
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-green-500 rounded-full" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-4xl font-black mb-4 tracking-tighter">Ευχαριστούμε για την παραγγελία!</h2>
                                <p className="text-sm opacity-50 mb-8">
                                    Αριθμός Παραγγελίας: <strong className="text-[#111]">#MODA-2026-8142</strong>
                                </p>
                            </div>

                            {paymentMethod === "bank" ? (
                                <div className="bg-[#C5A267]/5 border-2 border-dashed border-[#C5A267]/30 p-8 rounded-3xl mb-10 text-left">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-xl bg-[#C5A267] text-white flex items-center justify-center shrink-0">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm uppercase tracking-widest">Εκκρεμεί Κατάθεση</h4>
                                            <p className="text-xs opacity-60 leading-relaxed">Μόλις επιβεβαιώσουμε την πληρωμή θα προχωρήσουμε στην παραγγελία σας.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 pt-4 border-t border-[#C5A267]/20">
                                        <div>
                                            <p className="text-[10px] font-black uppercase opacity-40">IBAN</p>
                                            <p className="font-mono text-sm font-bold">GR74 0172 0000 0000 1234 5678 901</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase opacity-40">Δικαιούχος</p>
                                            <p className="text-sm font-bold">Ιωαννίδου Ελένη</p>
                                        </div>
                                        <p className="text-[10px] italic opacity-50 pt-2 text-center">* Παρακαλούμε χρησιμοποιήστε τον Αριθμό Παραγγελίας ως αιτιολογία κατά την κατάθεση.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-3xl mb-10 text-center">
                                    <p className="text-sm opacity-60 leading-relaxed">
                                        Η πληρωμή σας μέσω <strong className="text-[#635BFF]">Stripe</strong> ολοκληρώθηκε με επιτυχία. Θα λάβετε σύντομα ένα email επιβεβαίωσης με τις λεπτομέρειες της αποστολής.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button onClick={() => { setView("home"); setCart([]); setCheckStep(1); window.scrollTo(0, 0); }} className="bg-[#111] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#C5A267] transition-all">Πίσω στο Κατάστημα</button>
                                <button onClick={() => window.print()} className="border border-zinc-200 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-zinc-50 transition-all flex items-center justify-center gap-2">
                                    <Package size={14} className="opacity-40" /> Εκτύπωση Στοιχείων
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== LEGAL / INFO PAGES ========== */}
                    {(view === "shipping" || view === "returns" || view === "terms" || view === "privacy") && (
                        <motion.div key="legal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="container mx-auto px-4 max-w-4xl py-12 text-left">
                            <div className="bg-white rounded-[40px] p-8 md:p-16 border border-zinc-100 shadow-2xl">
                                <button onClick={() => setView("home")} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 mb-10 transition-all"><ArrowLeft size={14} /> Επιστροφή</button>
                                
                                <div className="space-y-6">
                                    {view === "shipping" && (
                                        <>
                                            <h1 className="text-4xl font-black mb-8 tracking-tighter">Τρόποι Αποστολής</h1>
                                            <div className="space-y-6 opacity-70 leading-relaxed font-medium">
                                                <p>Η MODA.gr συνεργάζεται με τις κορυφαίες εταιρείες Courier για να εξασφαλίσει την ασφαλή και γρήγορη μεταφορά των παραγγελιών σας.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Χρόνος Παράδοσης</h4>
                                                <ul className="list-disc pl-5 space-y-2">
                                                    <li>Εντός Αττικής & Μεγάλων Πόλεων: 1-2 εργάσιμες ημέρες.</li>
                                                    <li>Υπόλοιπη Ελλάδα: 2-3 εργάσιμες ημέρες.</li>
                                                    <li>Απομακρυσμένες / Δυσπρόσιτες Περιοχές: 3-5 εργάσιμες ημέρες.</li>
                                                </ul>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Έξοδα Αποστολής</h4>
                                                <p>Για παραγγελίες άνω των <strong className="text-[#C5A267]">€150</strong>, η αποστολή είναι <strong className="text-[#C5A267]">ΔΩΡΕΑΝ</strong>. Για παραγγελίες μικρότερης αξίας, το κόστος είναι €5.00.</p>
                                            </div>
                                        </>
                                    )}
                                    {view === "returns" && (
                                        <>
                                            <h1 className="text-4xl font-black mb-8 tracking-tighter">Πολιτική Επιστροφών</h1>
                                            <div className="space-y-6 opacity-70 leading-relaxed font-medium">
                                                <p>Έχετε το δικαίωμα να επιστρέψετε τα προϊόντα που αγοράσατε εντός <strong>30 ημερών</strong> από την ημερομηνία παραλαβής.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Προϋποθέσεις Επιστροφής</h4>
                                                <p>Το προϊόν πρέπει να βρίσκεται στην αρχική του κατάσταση, να μην έχει χρησιμοποιηθεί και να φέρει όλα τα καρτελάκια του κατασκευαστή.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Διαδικασία</h4>
                                                <p>Επικοινωνήστε μαζί μας στο <strong className="text-[#C5A267]">support@moda.gr</strong> για να ξεκινήσετε τη διαδικασία επιστροφής. Τα έξοδα της πρώτης επιστροφής είναι δωρεάν.</p>
                                            </div>
                                        </>
                                    )}
                                    {view === "terms" && (
                                        <>
                                            <h1 className="text-4xl font-black mb-8 tracking-tighter">Όροι Χρήσης</h1>
                                            <div className="space-y-6 opacity-70 leading-relaxed font-medium">
                                                <p>Καλώς ήρθατε στην MODA.gr. Η χρήση της ιστοσελίδας μας υπόκειται στους παρακάτω όρους, τους οποίους ο χρήστης οφείλει να διαβάσει προσεκτικά.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Προσωπικά Δεδομένα</h4>
                                                <p>Η προστασία των προσωπικών σας δεδομένων είναι προτεραιότητά μας. Όλες οι συναλλαγές πραγματοποιούνται μέσω ασφαλών κρυπτογραφημένων συστημάτων.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Ευθύνη Χρήστη</h4>
                                                <p>Ο χρήστης συμφωνεί να μην χρησιμοποιεί την ιστοσελίδα για παράνομες δραστηριότητες ή για τη διάδοση κακόβουλου λογισμικού.</p>
                                            </div>
                                        </>
                                    )}
                                    {view === "privacy" && (
                                        <>
                                            <h1 className="text-4xl font-black mb-8 tracking-tighter">Πολιτική Απορρήτου</h1>
                                            <div className="space-y-6 opacity-70 leading-relaxed font-medium">
                                                <p>Στην MODA.gr σεβόμαστε το απόρρητό σας. Η παρούσα πολιτική εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα δεδομένα σας.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Συλλογή Δεδομένων</h4>
                                                <p>Συλλέγουμε μόνο τα απαραίτητα στοιχεία για την ολοκλήρωση της παραγγελίας σας και την επικοινωνία μαζί σας.</p>
                                                <h4 className="text-sm font-black text-[#111] uppercase tracking-widest mt-8">Cookies</h4>
                                                <p>Χρησιμοποιούμε cookies για να βελτιώσουμε την εμπειρία περιήγησής σας και να θυμόμαστε τις προτιμήσεις σας.</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                <button onClick={() => { setView("home"); window.scrollTo(0, 0); }} className="mt-16 w-full py-5 bg-[#111] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#C5A267] transition-all flex items-center justify-center gap-2">Ξεκινήστε τις Αγορές σας <ArrowRight size={14} /></button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* ========== CART DRAWER ========== */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
                            <div className="p-6 border-b border-zinc-100 flex justify-between items-center"><h3 className="text-lg font-black">Καλάθι ({cartCount})</h3><button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-zinc-100"><X size={18} /></button></div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20"><ShoppingBag size={50} className="mb-3" /><p className="font-bold text-sm">Άδειο καλάθι</p></div>
                                ) : cart.map(item => (
                                    <div key={`${item.id}-${item.selSize}`} className="flex gap-4 group">
                                        <div onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) { setCartOpen(false); openProd(p); } }} className="w-16 h-22 rounded-lg overflow-hidden shrink-0 cursor-pointer"><img src={item.img} className="w-full h-full object-cover" alt={item.name} /></div>
                                        <div className="flex-1">
                                            <div className="flex justify-between"><h4 onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) { setCartOpen(false); openProd(p); } }} className="font-bold text-xs cursor-pointer hover:text-[#C5A267] transition-colors">{item.name}</h4><button onClick={() => setCart(c => c.filter(x => !(x.id === item.id && x.selSize === item.selSize)))} className="text-red-400"><X size={12} /></button></div>
                                            <p className="text-[9px] opacity-40 mb-2">{item.selSize}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 bg-zinc-50 px-2 py-1 rounded text-xs">
                                                    <button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>-</button>
                                                    <span className="font-black">{item.qty}</span>
                                                    <button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: x.qty + 1 } : x))}>+</button>
                                                </div>
                                                <span className="font-black text-sm">€{item.price * item.qty}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {cart.length > 0 && (
                                <div className="p-6 border-t border-zinc-100 bg-zinc-50">
                                    <div className="flex justify-between mb-4"><span className="text-xs opacity-40">Σύνολο</span><span className="text-xl font-black">€{cartTotal}</span></div>
                                    <button onClick={() => { setCartOpen(false); setView("checkout"); setCheckStep(1); window.scrollTo(0, 0); }} className="w-full bg-[#111] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#C5A267] transition-all">Ολοκλήρωση <ArrowRight size={12} className="inline ml-1" /></button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>



            {/* ========== FOOTER ========== */}
            <footer className="bg-[#111] text-white mt-16">
                <div className="container mx-auto px-4 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-2xl font-black mb-1 uppercase tracking-tighter text-white">MODA</h4>
                            <div className="w-12 h-1 bg-[#C5A267] rounded-full"></div>
                        </div>
                        <p className="text-xs opacity-40 leading-relaxed max-w-[240px]">
                            Η MODA είναι ο απόλυτος προορισμός για premium fashion items, συνδυάζοντας την κορυφαία ποιότητα με το σύγχρονο design. Εξερευνήστε τις νέες συλλογές μας.
                        </p>
                        <div className="pt-4 border-t border-white/5">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-3">Πιστοποιημένο Κατάστημα</p>
                            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-4 invert" />
                                <div className="w-10 h-6 bg-[#1a1f71] rounded-md flex items-center justify-center text-[10px] font-black italic text-white leading-none tracking-tighter shadow-sm border border-white/20">VISA</div>
                            </div>
                        </div>
                    </div>
                    <div><h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Κατηγορίες</h5><div className="space-y-2 text-xs opacity-40">{CATS.slice(1).map(c => <p key={c} onClick={() => selectCat(c)} className="hover:text-[#C5A267] cursor-pointer transition-colors">{c}</p>)}</div></div>
                    <div><h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Πληροφορίες</h5>
                        <div className="space-y-2 text-xs opacity-40">
                            <p onClick={() => { setView("shipping"); window.scrollTo(0, 0); }} className="hover:text-[#C5A267] cursor-pointer transition-colors">Τρόποι Αποστολής</p>
                            <p onClick={() => { setView("returns"); window.scrollTo(0, 0); }} className="hover:text-[#C5A267] cursor-pointer transition-colors">Πολιτική Επιστροφών</p>
                            <p onClick={() => { setView("terms"); window.scrollTo(0, 0); }} className="hover:text-[#C5A267] cursor-pointer transition-colors">Όροι Χρήσης</p>
                            <p onClick={() => { setView("privacy"); window.scrollTo(0, 0); }} className="hover:text-[#C5A267] cursor-pointer transition-colors">Απόρρητο</p>
                        </div>
                    </div>
                    <div><h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Newsletter</h5>
                        {!newsSuccess ? (
                            <div className="flex gap-2">
                                <input 
                                    value={newsletter} 
                                    onChange={e => setNewsletter(e.target.value)} 
                                    placeholder="Email..." 
                                    className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-xs outline-none focus:ring-1 ring-[#C5A267]" 
                                />
                                <button 
                                    onClick={() => { if(newsletter.includes("@")) setNewsSuccess(true); }}
                                    className="px-3 bg-[#C5A267] rounded-lg hover:bg-white hover:text-[#111] transition-all"
                                >
                                    <Mail size={14} />
                                </button>
                            </div>
                        ) : (
                            <p className="text-[10px] font-black text-[#C5A267] uppercase tracking-widest animate-bounce">✓ Ευχαριστούμε για την εγγραφή!</p>
                        )}
                    </div>
                </div>
                <div className="border-t border-white/10 py-6 text-center text-[9px] opacity-20 font-bold tracking-[.2em] uppercase">
                    © 2026 MODA — ALL RIGHTS RESERVED — DESIGNED BY SGK.GR
                </div>
            </footer>
        </div>
    );
}

