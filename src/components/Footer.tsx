import { Link } from "react-router-dom";
import logo from "../assets/sgk-logo.png";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-secondary/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 items-start mb-10">
          <div className="flex flex-col gap-4">
            <img src={logo} alt="SGK Logo" className="h-10 w-auto self-start opacity-80" />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Πρωτοπόρες λύσεις AI και web development για σύγχρονες επιχειρήσεις που θέλουν να ξεχωρίσουν.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold">Πλοήγηση</h4>
            <div className="flex flex-col gap-2">
              <a href="/#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">Υπηρεσίες</a>
              <a href="/#portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">Portfolio</a>
              <a href="/#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Σχετικά</a>
              <a href="/#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold">Νομικά</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Πολιτική Απορρήτου</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Όροι Χρήσης</Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SGK Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
