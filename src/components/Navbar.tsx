import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/sgk-logo.png";

const navItems = [
  { label: "Υπηρεσίες", href: "/#services" },
  { label: "Λύσεις", href: "/#solutions" },
  { label: "Πελάτες", href: "/#portfolio" },
  { label: "Σχετικά", href: "/#about" },
  { label: "Insights", href: "/#insights" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="/" className="flex items-center">
            <img src={logo} alt="SGK" className="h-12 md:h-14 w-auto brightness-0 invert" />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[17px] font-bold text-white hover:text-white/80 transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="hidden md:block">
          <Link
            to="/estimate"
            className="group flex items-center gap-2 px-8 py-3.5 text-[17px] font-bold border-2 border-white rounded-sm hover:bg-white hover:text-black transition-all duration-300 text-white"
          >
            Εκτίμηση Έργου
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                to="/estimate"
                className="px-5 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md text-center"
                onClick={() => setIsOpen(false)}
              >
                Εκτίμηση Έργου
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
