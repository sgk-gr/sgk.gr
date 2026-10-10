import { useEffect, useState } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function useThemeMode() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        try {
            const saved = localStorage.getItem("km_theme_mode");
            if (saved !== null) {
                return saved === "dark";
            }
            return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        try {
            localStorage.setItem("km_theme_mode", isDark ? "dark" : "light");
        } catch {}
    }, [isDark]);

    const toggleTheme = () => setIsDark(prev => !prev);

    return { isDark, setIsDark, toggleTheme };
}

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
    const { isDark, toggleTheme } = useThemeMode();

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={cn(
                "h-9 px-2.5 sm:px-3 rounded-xl border shadow-xs transition-all duration-200 gap-1.5 select-none active:scale-95 cursor-pointer shrink-0",
                isDark
                    ? "bg-[#282826] border-[#383835] text-[#e3e3dc] hover:bg-[#333330] hover:text-[#f4f4f0] hover:border-[#4a4a46]"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50/70 hover:border-amber-300 hover:text-amber-900",
                className
            )}
            title={isDark ? "Άναμμα φωτός (Light Mode)" : "Σβήσιμο φωτός (Dark Mode)"}
            aria-label={isDark ? "Άναμμα φωτός" : "Σβήσιμο φωτός"}
        >
            {isDark ? (
                <>
                    <LightbulbOff className="h-4 w-4 text-slate-400 shrink-0 transition-transform hover:rotate-12" />
                    {showLabel && (
                        <span className="hidden sm:inline text-xs font-semibold text-[#d4d4cd]">
                            Φως OFF
                        </span>
                    )}
                </>
            ) : (
                <>
                    <Lightbulb className="h-4 w-4 text-amber-500 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)] shrink-0 transition-transform hover:rotate-12" />
                    {showLabel && (
                        <span className="hidden sm:inline text-xs font-semibold text-slate-700">
                            Φως ON
                        </span>
                    )}
                </>
            )}
        </Button>
    );
}

export function FloatingThemeToggle() {
    const { isDark, toggleTheme } = useThemeMode();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={cn(
                "fixed bottom-4 left-4 z-40 p-2.5 rounded-full shadow-lg border transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center",
                isDark
                    ? "bg-[#222220] border-[#383835] text-amber-400 hover:bg-[#2c2c29] hover:border-[#4a4a46] shadow-black/50"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 shadow-slate-300/50"
            )}
            title={isDark ? "Άναμμα φωτός (Light Mode)" : "Σβήσιμο φωτός (Dark Mode)"}
            aria-label={isDark ? "Light Mode" : "Dark Mode"}
        >
            {isDark ? (
                <LightbulbOff className="h-5 w-5 text-slate-400" />
            ) : (
                <Lightbulb className="h-5 w-5 text-amber-500 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
            )}
        </button>
    );
}

export default ThemeToggle;
