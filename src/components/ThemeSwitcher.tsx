'use client';

import { useEffect, useState } from "react";
import { Palette, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

type ColorPalette = 'default' | 'ocean' | 'forest' | 'cyberpunk';

export function ThemeSwitcher() {
    // next-themes handles dark/light mode
    const { theme: mode, setTheme: setMode, resolvedTheme } = useTheme();

    // We handle color palette manually
    const [palette, setPalette] = useState<ColorPalette>('default');
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initial mount and palette loading
    useEffect(() => {
        setMounted(true);
        // Load custom color palette
        const savedPalette = localStorage.getItem('portfolio-theme-color') as ColorPalette;
        if (savedPalette) {
            setPalette(savedPalette);
            document.documentElement.setAttribute('data-theme', savedPalette);
        }
    }, []);

    const changePalette = (p: ColorPalette) => {
        setPalette(p);
        document.documentElement.setAttribute('data-theme', p);
        localStorage.setItem('portfolio-theme-color', p);
    };

    const toggleDarkMode = () => {
        setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
    };

    const palettes: { id: ColorPalette; label: string; color: string }[] = [
        { id: 'default', label: 'Default', color: 'bg-zinc-500' },
        { id: 'ocean', label: 'Ocean', color: 'bg-sky-500' },
        { id: 'forest', label: 'Forest', color: 'bg-green-600' },
        { id: 'cyberpunk', label: 'Cyberpunk', color: 'bg-pink-500' },
    ];

    if (!mounted) return null;

    const isDark = resolvedTheme === 'dark';

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="mb-2 w-48 rounded-lg border bg-popover p-2 shadow-lg"
                    >
                        {/* Dark Mode Toggle */}
                        <div className="mb-2 border-b pb-2">
                            <button
                                onClick={toggleDarkMode}
                                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                                <span className="flex items-center gap-2">
                                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                                    {isDark ? 'Dark Mode' : 'Light Mode'}
                                </span>
                                <span className={cn("h-4 w-8 rounded-full bg-muted p-1 transition-colors", isDark && "bg-primary")}>
                                    <span className={cn("block h-2 w-2 rounded-full bg-background transition-transform", isDark && "translate-x-4")} />
                                </span>
                            </button>
                        </div>

                        {/* Color Palette List */}
                        <div className="space-y-1">
                            <span className="px-2 text-xs font-semibold text-muted-foreground">Color Palette</span>
                            {palettes.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => changePalette(p.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                        palette === p.id && "bg-accent text-accent-foreground font-medium"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={cn("h-3 w-3 rounded-full", p.color)} />
                                        {p.label}
                                    </span>
                                    {palette === p.id && <span className="text-xs">✓</span>}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Change Theme"
            >
                <Palette className="h-6 w-6" />
            </button>
        </div>
    );
}
