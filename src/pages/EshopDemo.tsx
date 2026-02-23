import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toteBagImg from "@/assets/2150916679.jpg";
import { Link } from "react-router-dom";
import {
    ShoppingBag, Search, X, Star, ShieldCheck, ShoppingCart, CreditCard,
    CheckCircle2, Package, ArrowRight, ArrowLeft, Heart, Truck, Plus, Minus,
    User, SlidersHorizontal, Mail, Facebook, Instagram, Twitter, Clock, LogOut, Zap
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
        id: 3, name: "Δερμάτινη Tote Bag Signature", price: 490, oldPrice: 650, img: toteBagImg,
        imgs: [toteBagImg],
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

const FAKE_ORDERS: Order[] = [
    { id: "#ORD-2026-4821", date: "15 Φεβ 2026", items: [], total: 484, status: "Παραδόθηκε" },
    { id: "#ORD-2026-3190", date: "02 Ιαν 2026", items: [], total: 299, status: "Παραδόθηκε" },
    { id: "#ORD-2025-9912", date: "18 Δεκ 2025", items: [], total: 185, status: "Ακυρώθηκε" },
];

const HERO_SLIDES = [
    { img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070", sub: "Συλλογή Άνοιξη 2026", title: "Η Νέα\nΕποχή Στυλ", cta: "Ανακαλύψτε Τώρα" },
    { img: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071", sub: "Exclusive Collection", title: "Κομψότητα\nΧωρίς Όρια", cta: "Δείτε Περισσότερα" },
    { img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070", sub: "Premium Essentials", title: "Διαχρονικό\nΣτυλ", cta: "Εξερευνήστε" },
];

/* ================================================================== */
/*  COMPONENT                                                          */
/* ================================================================== */
const EshopDemo = () => {
    type View = "home" | "product" | "checkout" | "success" | "profile";
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
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filterPrice, setFilterPrice] = useState<[number, number]>([0, 700]);
    const [filterSizes, setFilterSizes] = useState<string[]>([]);
    const prodRef = useRef<HTMLDivElement>(null);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [heroSlide, setHeroSlide] = useState(0);

    // Auto-advance hero slider
    const nextSlide = useCallback(() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length), []);
    useEffect(() => {
        if (view !== "home") return;
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, [view, nextSlide]);

    // --- Countdown Offer (persisted in localStorage) ---
    const [offerPrice, setOfferPrice] = useState(0);
    const [countdown, setCountdown] = useState({ h: "00", m: "00", s: "00" });
    useEffect(() => {
        const initOffer = () => {
            const now = Date.now();
            const storedEnd = localStorage.getItem("sgk_demo_offer_end");
            const storedPrice = localStorage.getItem("sgk_demo_offer_price");
            if (storedEnd && storedPrice && parseInt(storedEnd) > now) {
                setOfferPrice(parseInt(storedPrice));
                return parseInt(storedEnd);
            }
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            const endMs = end.getTime();
            const price = Math.floor(Math.random() * (1100 - 800 + 1)) + 800;
            localStorage.setItem("sgk_demo_offer_end", endMs.toString());
            localStorage.setItem("sgk_demo_offer_price", price.toString());
            setOfferPrice(price);
            return endMs;
        };
        const endTime = initOffer();
        const tick = setInterval(() => {
            const diff = Math.max(0, endTime - Date.now());
            if (diff <= 0) {
                localStorage.removeItem("sgk_demo_offer_end");
                localStorage.removeItem("sgk_demo_offer_price");
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

    return (
        <div className="min-h-screen bg-[#FAFAF8] text-[#111] font-sans">

            {/* ========== HEADER ========== */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-zinc-100">
                <div className="bg-[#111] text-white text-center py-2 text-[10px] font-bold tracking-[.2em] uppercase">
                    Δωρεάν Αποστολή σε παραγγελίες άνω των €150 · Επιστροφές 30 ημερών
                </div>
                <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <button onClick={() => { setView("home"); window.scrollTo(0, 0); }} className="text-xl sm:text-2xl font-black tracking-tighter shrink-0">MODA<span className="text-[#C5A267]">.</span>gr</button>
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
                        {/* Live Search Dropdown */}
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
                                                        <img src={p.img} className="w-full h-full object-cover" />
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
                        <Link to="/" className="hidden sm:flex items-center gap-1 text-[10px] font-black uppercase text-red-500 hover:text-red-700"><X size={12} /> Έξοδος</Link>
                        <button onClick={() => { setView("profile"); window.scrollTo(0, 0); }} className="relative"><User size={20} className="opacity-40 hover:opacity-100 transition-opacity" /></button>
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
                            {/* Hero Slider - full width on mobile, no gap from header */}
                            <div className="relative h-[60vh] sm:h-[70vh] rounded-none sm:rounded-3xl overflow-hidden mb-10 sm:mb-16 -mt-[170px] pt-[170px] sm:mt-0 sm:pt-0 sm:mx-4 md:mx-auto md:container md:px-0">
                                {/* Slides */}
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={heroSlide}
                                        src={HERO_SLIDES[heroSlide].img}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1.2, ease: "easeInOut" }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />

                                {/* Text content */}
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

                                {/* Navigation arrows */}
                                <button onClick={() => setHeroSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <ArrowLeft size={16} />
                                </button>
                                <button onClick={() => setHeroSlide(s => (s + 1) % HERO_SLIDES.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <ArrowRight size={16} />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                    {HERO_SLIDES.map((_, i) => (
                                        <button key={i} onClick={() => setHeroSlide(i)} className={`h-1.5 rounded-full transition-all duration-500 ${heroSlide === i ? "w-8 bg-white" : "w-3 bg-white/40"}`} />
                                    ))}
                                </div>
                            </div>

                            {/* Rest of content in container */}
                            <div className="container mx-auto px-4">
                                {/* Toolbar + Filters */}
                                <div ref={prodRef} className="scroll-mt-48">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                        <p className="text-sm opacity-50 font-bold">{filtered.length} Προϊόντα{activeCat !== "Όλα" && ` στα "${activeCat}"`}</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${filtersOpen ? "bg-[#111] text-white border-[#111]" : "border-zinc-200 hover:bg-zinc-50"}`}>
                                                <SlidersHorizontal size={14} /> Φίλτρα {(filterSizes.length > 0 || filterPrice[0] > 0 || filterPrice[1] < 700) && <span className="bg-[#C5A267] text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center">!</span>}
                                            </button>
                                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs font-bold bg-white border border-zinc-200 px-4 py-2 rounded-full outline-none">
                                                <option value="default">Ταξινόμηση</option>
                                                <option value="price-asc">Τιμή ↑</option>
                                                <option value="price-desc">Τιμή ↓</option>
                                                <option value="rating">Αξιολόγηση</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Filters Panel */}
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

                                    {/* Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
                                        {filtered.map(p => (
                                            <motion.div key={p.id} layout whileHover={{ y: -6 }} className="group cursor-pointer" onClick={() => openProd(p)}>
                                                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm group-hover:shadow-xl transition-all">
                                                    <img src={p.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
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
                                        {filtered.length === 0 && <div className="col-span-full py-20 text-center opacity-30"><p className="font-bold text-lg">Δεν βρέθηκαν προϊόντα</p><p className="text-sm mt-2">Δοκιμάστε διαφορετικά φίλτρα</p></div>}
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
                                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 shadow-lg"><img src={selProd.imgs[imgIdx]} className="w-full h-full object-cover" /></div>
                                    {selProd.imgs.length > 1 && <div className="flex gap-2">{selProd.imgs.map((im, i) => (
                                        <button key={i} onClick={() => setImgIdx(i)} className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all ${imgIdx === i ? "border-[#C5A267]" : "border-transparent opacity-50"}`}><img src={im} className="w-full h-full object-cover" /></button>
                                    ))}</div>}
                                </div>
                                <div>
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

                            {/* ========== REVIEWS SECTION ========== */}
                            <div className="mt-16 pt-16 border-t border-zinc-100">
                                <div className="grid lg:grid-cols-3 gap-12">
                                    {/* Summary */}
                                    <div className="lg:col-span-1">
                                        <h2 className="text-2xl font-black mb-6">Αξιολογήσεις</h2>
                                        <div className="flex items-end gap-3 mb-6">
                                            <span className="text-5xl font-black">{selProd.rating}</span>
                                            <div className="mb-1">
                                                <div className="flex gap-0.5 mb-1">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.floor(selProd.rating) ? "fill-[#C5A267] text-[#C5A267]" : "text-zinc-200"} />)}</div>
                                                <p className="text-xs opacity-40">{selProd.reviews} αξιολογήσεις</p>
                                            </div>
                                        </div>
                                        {/* Rating bars */}
                                        <div className="space-y-2">
                                            {[
                                                { stars: 5, pct: 78 },
                                                { stars: 4, pct: 15 },
                                                { stars: 3, pct: 5 },
                                                { stars: 2, pct: 1 },
                                                { stars: 1, pct: 1 },
                                            ].map(r => (
                                                <div key={r.stars} className="flex items-center gap-3">
                                                    <span className="text-xs font-bold w-3">{r.stars}</span>
                                                    <Star size={10} className="fill-[#C5A267] text-[#C5A267]" />
                                                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#C5A267] rounded-full" style={{ width: `${r.pct}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold opacity-30 w-8">{r.pct}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Individual Reviews */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {[
                                            { name: "Μαρία Κ.", date: "12 Φεβ 2026", stars: 5, text: "Εξαιρετική ποιότητα! Το ύφασμα είναι πραγματικά premium και η εφαρμογή τέλεια. Ήρθε σε 2 μέρες με όμορφη συσκευασία. Σίγουρα θα ξαναπαραγγείλω!", verified: true },
                                            { name: "Δημήτρης Π.", date: "28 Ιαν 2026", stars: 5, text: "Το πήρα δώρο στη γυναίκα μου και ενθουσιάστηκε. Πολύ κομψό, ακριβώς όπως στις φωτογραφίες. Άψογη εξυπηρέτηση.", verified: true },
                                            { name: "Ελένη Σ.", date: "15 Ιαν 2026", stars: 4, text: "Πολύ ωραίο προϊόν, μόνο το μέγεθος ήταν λίγο μεγαλύτερο από ό,τι περίμενα. Κατά τα άλλα εξαιρετικό!", verified: false },
                                        ].map((rev, i) => (
                                            <div key={i} className="p-6 bg-white rounded-2xl border border-zinc-100">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-[#C5A267]/10 flex items-center justify-center text-sm font-black text-[#C5A267]">
                                                            {rev.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-bold text-sm">{rev.name}</p>
                                                                {rev.verified && <span className="text-[8px] font-black uppercase tracking-widest bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Επιβεβαιωμένη Αγορά</span>}
                                                            </div>
                                                            <p className="text-[10px] opacity-30">{rev.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} size={10} className={j < rev.stars ? "fill-[#C5A267] text-[#C5A267]" : "text-zinc-200"} />)}</div>
                                                </div>
                                                <p className="text-sm leading-relaxed opacity-60">{rev.text}</p>
                                                <div className="mt-4 flex items-center gap-4">
                                                    <button className="text-[10px] font-bold opacity-30 hover:opacity-60 transition-opacity flex items-center gap-1">
                                                        <CheckCircle2 size={10} /> Χρήσιμη (3)
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="w-full py-4 rounded-xl border border-zinc-200 text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
                                            Δείτε όλες τις αξιολογήσεις ({selProd.reviews})
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== PROFILE ========== */}
                    {view === "profile" && (
                        <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="container mx-auto px-4 max-w-3xl">
                            <div className="bg-white rounded-3xl border border-zinc-100 shadow-lg overflow-hidden">
                                <div className="bg-[#111] text-white p-10 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-[#C5A267] flex items-center justify-center text-2xl font-black">ΔΠ</div>
                                    <div><h2 className="text-xl font-black">Δημήτρης Παππάς</h2><p className="text-xs opacity-50">dimitris@email.gr · Μέλος από Ιαν 2025</p></div>
                                </div>
                                <div className="p-8">
                                    <div className="grid sm:grid-cols-3 gap-4 mb-10">
                                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 text-center"><p className="text-2xl font-black">{FAKE_ORDERS.length}</p><p className="text-[10px] font-bold opacity-40 uppercase">Παραγγελίες</p></div>
                                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 text-center"><p className="text-2xl font-black">{wishlist.length}</p><p className="text-[10px] font-bold opacity-40 uppercase">Αγαπημένα</p></div>
                                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-100 text-center"><p className="text-2xl font-black">€{FAKE_ORDERS.filter(o => o.status === "Παραδόθηκε").reduce((s, o) => s + o.total, 0)}</p><p className="text-[10px] font-bold opacity-40 uppercase">Συνολ. Αγορές</p></div>
                                    </div>
                                    <h3 className="font-black text-lg mb-6 flex items-center gap-2"><Clock size={18} /> Ιστορικό Παραγγελιών</h3>
                                    <div className="space-y-4">
                                        {FAKE_ORDERS.map(o => (
                                            <div key={o.id} className="flex items-center justify-between p-5 bg-zinc-50 rounded-xl border border-zinc-100 hover:shadow-sm transition-all">
                                                <div><p className="font-bold text-sm">{o.id}</p><p className="text-xs opacity-40">{o.date}</p></div>
                                                <div className="text-right"><p className="font-black">€{o.total}</p><p className={`text-[10px] font-bold uppercase ${o.status === "Παραδόθηκε" ? "text-green-600" : "text-red-400"}`}>{o.status}</p></div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => { setView("home"); window.scrollTo(0, 0); }} className="w-full mt-8 py-4 bg-[#111] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#C5A267] transition-all flex items-center justify-center gap-2"><ArrowLeft size={14} /> Πίσω στο Κατάστημα</button>
                                </div>
                            </div>
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
                                        {cart.map(item => (<div key={`${item.id}-${item.selSize}`} className="flex gap-4 p-4 bg-white rounded-xl border border-zinc-100 group">
                                            <div onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) openProd(p); }} className="w-20 h-28 rounded-lg overflow-hidden shrink-0 cursor-pointer"><img src={item.img} className="w-full h-full object-cover" /></div>
                                            <div className="flex-1"><div className="flex justify-between mb-1"><h4 onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) openProd(p); }} className="font-bold text-sm cursor-pointer hover:text-[#C5A267] transition-colors">{item.name}</h4><button onClick={() => setCart(c => c.filter(x => !(x.id === item.id && x.selSize === item.selSize)))} className="text-red-400"><X size={14} /></button></div>
                                                <p className="text-[10px] opacity-40 mb-3">Μέγ: {item.selSize} · <span className="inline-block w-3 h-3 rounded-full border align-middle" style={{ backgroundColor: item.selColor }} /></p>
                                                <div className="flex items-center justify-between"><div className="flex items-center gap-3 bg-zinc-50 px-3 py-1 rounded-lg border border-zinc-100">
                                                    <button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}><Minus size={12} /></button>
                                                    <span className="text-xs font-black">{item.qty}</span>
                                                    <button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: x.qty + 1 } : x))}><Plus size={12} /></button>
                                                </div><span className="font-black">€{item.price * item.qty}</span></div></div>
                                        </div>))}
                                        <button onClick={() => setCheckStep(2)} className="w-full bg-[#111] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#C5A267] transition-all">Συνέχεια <ArrowRight size={12} className="inline ml-1" /></button>
                                    </div>)}
                                    {checkStep === 2 && (<div className="bg-white p-6 rounded-2xl border border-zinc-100">
                                        <h2 className="text-xl font-black mb-6">Στοιχεία Αποστολής</h2>
                                        <div className="grid sm:grid-cols-2 gap-4">{[{ l: "Ονοματεπώνυμο", v: "Δημήτρης Παππάς" }, { l: "Email", v: "dimitris@email.gr" }, { l: "Τηλέφωνο", v: "6971234567" }, { l: "Πόλη", v: "Αθήνα" }].map(f => (
                                            <div key={f.l} className="space-y-1"><label className="text-[10px] font-black uppercase opacity-30">{f.l}</label><input className="w-full p-3 bg-zinc-50 rounded-lg outline-none border border-zinc-100 font-bold text-sm" defaultValue={f.v} /></div>
                                        ))}<div className="sm:col-span-2 space-y-1"><label className="text-[10px] font-black uppercase opacity-30">Διεύθυνση</label><input className="w-full p-3 bg-zinc-50 rounded-lg outline-none border border-zinc-100 font-bold text-sm" defaultValue="Ερμού 15, 10563" /></div></div>
                                        <button onClick={() => setCheckStep(3)} className="w-full bg-[#111] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs mt-6 hover:bg-[#C5A267] transition-all">Πληρωμή <ArrowRight size={12} className="inline ml-1" /></button>
                                    </div>)}
                                    {checkStep === 3 && (<div className="bg-white p-6 rounded-2xl border border-zinc-100">
                                        <h2 className="text-xl font-black mb-6">Τρόπος Πληρωμής</h2>
                                        <div className="space-y-3 mb-6">{[{ l: "Πιστωτική Κάρτα", s: "**** 4242", sel: true }, { l: "Google / Apple Pay", s: "", sel: false }, { l: "Αντικαταβολή", s: "+€3", sel: false }].map((m, i) => (
                                            <div key={i} className={`p-4 rounded-xl border-2 flex items-center justify-between ${m.sel ? "border-[#C5A267] bg-[#C5A267]/5" : "border-zinc-100"}`}><div><p className="font-bold text-sm">{m.l}</p>{m.s && <p className="text-xs opacity-40">{m.s}</p>}</div>{m.sel && <CheckCircle2 size={16} className="text-[#C5A267]" />}</div>
                                        ))}</div>
                                        <button onClick={() => setView("success")} className="w-full bg-[#C5A267] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-[#b08e4e] transition-all">Ολοκλήρωση Παραγγελίας</button>
                                    </div>)}
                                </div>
                                <div className="lg:col-span-2"><div className="sticky top-[200px] bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                                    <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-4">Σύνοψη</h3>
                                    <div className="space-y-2 text-sm mb-4">{cart.map(i => <div key={i.id + i.selSize} className="flex justify-between"><span onClick={() => { const p = PRODUCTS.find(x => x.id === i.id); if (p) openProd(p); }} className="opacity-40 cursor-pointer hover:opacity-70 transition-opacity">{i.qty}x {i.name}</span><span className="font-bold">€{i.price * i.qty}</span></div>)}</div>
                                    <div className="pt-3 border-t border-zinc-200 space-y-1"><div className="flex justify-between text-sm"><span className="opacity-40">Μεταφορικά</span><span className="text-green-600 font-bold">ΔΩΡΕΑΝ</span></div><div className="flex justify-between text-xl font-black pt-2"><span>Σύνολο</span><span>€{cartTotal}</span></div></div>
                                </div></div>
                            </div>
                        </motion.div>
                    )}

                    {/* ========== SUCCESS ========== */}
                    {view === "success" && (
                        <motion.div key="ok" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 container mx-auto px-4">
                            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_20px_60px_rgba(34,197,94,.3)]"><CheckCircle2 size={48} /></div>
                            <h2 className="text-4xl font-black mb-3">Η Παραγγελία σας Καταχωρήθηκε!</h2>
                            <p className="text-sm opacity-40 mb-2">Αριθμός: <strong>#SGK-2026-{Math.floor(Math.random() * 9000) + 1000}</strong></p>
                            <p className="text-sm opacity-40 max-w-md mx-auto mb-10">Θα λάβετε email επιβεβαίωσης. Demo eshop από την <strong>SGK Software Development</strong>.</p>
                            <button onClick={() => { setView("home"); setCart([]); setCheckStep(1); }} className="bg-[#111] text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-[#C5A267] transition-all">Πίσω στο Κατάστημα</button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* ========== CART DRAWER ========== */}
            <AnimatePresence>{cartOpen && (<>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]" />
                <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col">
                    <div className="p-6 border-b border-zinc-100 flex justify-between items-center"><h3 className="text-lg font-black">Καλάθι ({cartCount})</h3><button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-zinc-100"><X size={18} /></button></div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">{cart.length === 0 ? (<div className="h-full flex flex-col items-center justify-center opacity-20"><ShoppingBag size={50} className="mb-3" /><p className="font-bold text-sm">Άδειο καλάθι</p></div>) : cart.map(item => (
                        <div key={`${item.id}-${item.selSize}`} className="flex gap-4 group">
                            <div onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) { setCartOpen(false); openProd(p); } }} className="w-16 h-22 rounded-lg overflow-hidden shrink-0 cursor-pointer"><img src={item.img} className="w-full h-full object-cover" /></div>
                            <div className="flex-1"><div className="flex justify-between"><h4 onClick={() => { const p = PRODUCTS.find(x => x.id === item.id); if (p) { setCartOpen(false); openProd(p); } }} className="font-bold text-xs cursor-pointer hover:text-[#C5A267] transition-colors">{item.name}</h4><button onClick={() => setCart(c => c.filter(x => !(x.id === item.id && x.selSize === item.selSize)))} className="text-red-400"><X size={12} /></button></div>
                                <p className="text-[9px] opacity-40 mb-2">{item.selSize}</p>
                                <div className="flex items-center justify-between"><div className="flex items-center gap-2 bg-zinc-50 px-2 py-1 rounded text-xs"><button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>-</button><span className="font-black">{item.qty}</span><button onClick={() => setCart(c => c.map(x => (x.id === item.id && x.selSize === item.selSize) ? { ...x, qty: x.qty + 1 } : x))}>+</button></div><span className="font-black text-sm">€{item.price * item.qty}</span></div></div>
                        </div>
                    ))}</div>
                    {cart.length > 0 && (<div className="p-6 border-t border-zinc-100 bg-zinc-50">
                        <div className="flex justify-between mb-4"><span className="text-xs opacity-40">Σύνολο</span><span className="text-xl font-black">€{cartTotal}</span></div>
                        <button onClick={() => { setCartOpen(false); setView("checkout"); setCheckStep(1); window.scrollTo(0, 0); }} className="w-full bg-[#111] text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#C5A267] transition-all">Ολοκλήρωση <ArrowRight size={12} className="inline ml-1" /></button>
                    </div>)}
                </motion.div>
            </>)}</AnimatePresence>

            {/* ========== FLOATING COUNTDOWN OFFER CTA ========== */}
            <div className="fixed bottom-6 right-6 z-[90]">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 2, type: "spring", stiffness: 200 }}
                >
                    <Link to="/estimate" className="block no-underline group">
                        <div className="relative">
                            {/* Pulsing glow behind */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#C5A267] to-[#e8c96d] rounded-2xl blur-xl opacity-40 animate-pulse" />

                            {/* Main CTA */}
                            <div className="relative bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] text-white px-6 py-4 rounded-2xl shadow-[0_15px_50px_rgba(197,162,103,.4)] border border-[#C5A267]/30 group-hover:scale-105 transition-transform">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A267] to-[#e8c96d] flex items-center justify-center shrink-0 shadow-lg">
                                        <Zap size={20} className="text-[#111]" />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-black leading-tight">🔥 Θέλω κι εγώ τέτοιο Eshop!</p>
                                        <p className="text-[10px] text-[#C5A267] font-bold mt-0.5">Προσφορά από €{offerPrice} — Κάνε το δικό σου</p>
                                    </div>
                                    <ArrowRight size={16} className="text-[#C5A267] shrink-0 group-hover:translate-x-1 transition-transform" />
                                </div>
                                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-white/10">
                                    <Clock size={10} className="opacity-50" />
                                    <span className="text-[9px] opacity-40 font-bold uppercase tracking-wider">Η προσφορά λήγει σε</span>
                                    <div className="flex items-center gap-1 font-mono text-[11px] font-black ml-auto">
                                        <span className="bg-[#C5A267]/20 text-[#C5A267] px-2 py-0.5 rounded">{countdown.h}</span>
                                        <span className="opacity-40">:</span>
                                        <span className="bg-[#C5A267]/20 text-[#C5A267] px-2 py-0.5 rounded">{countdown.m}</span>
                                        <span className="opacity-40">:</span>
                                        <span className="bg-[#C5A267]/20 text-[#e8c96d] px-2 py-0.5 rounded">{countdown.s}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* ========== FOOTER ========== */}
            <footer className="bg-[#111] text-white mt-16">
                <div className="container mx-auto px-4 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div><h4 className="text-lg font-black mb-4">MODA<span className="text-[#C5A267]">.</span>gr</h4><p className="text-xs opacity-40 leading-relaxed">Premium fashion demo eshop από την SGK Software Development.</p></div>
                    <div><h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Κατηγορίες</h5><div className="space-y-2 text-xs opacity-40">{CATS.slice(1).map(c => <p key={c} className="hover:opacity-100 cursor-pointer">{c}</p>)}</div></div>
                    <div><h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Πληροφορίες</h5><div className="space-y-2 text-xs opacity-40">{["Τρόποι Αποστολής", "Πολιτική Επιστροφών", "Όροι Χρήσης", "Απόρρητο", "Επικοινωνία"].map(c => <p key={c} className="hover:opacity-100 cursor-pointer">{c}</p>)}</div></div>
                    <div><h5 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-50">Newsletter</h5><p className="text-xs opacity-40 mb-3">Εγγραφείτε για προσφορές.</p>
                        <div className="flex gap-2"><input value={newsletter} onChange={e => setNewsletter(e.target.value)} placeholder="Email..." className="flex-1 px-3 py-2 bg-white/10 rounded-lg text-xs outline-none border border-white/10" /><button className="px-3 bg-[#C5A267] rounded-lg"><Mail size={14} /></button></div>
                        <div className="flex gap-3 mt-6 opacity-40">{[Facebook, Instagram, Twitter].map((Ic, i) => <Ic key={i} size={16} className="hover:opacity-100 cursor-pointer" />)}</div>
                    </div>
                </div>
                <div className="border-t border-white/10 py-4 text-center text-[9px] opacity-20 font-bold">© 2026 MODA.gr — Demo by SGK Software Development</div>
            </footer>
        </div>
    );
};

export default EshopDemo;
