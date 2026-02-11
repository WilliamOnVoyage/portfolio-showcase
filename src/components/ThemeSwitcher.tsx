
'use client';

import { useEffect, useState } from "react";
import { Palette, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Theme = 'default' | 'ocean' | 'forest' | 'cyberpunk';

export function ThemeSwitcher() {
    const [theme, setTheme] = useState<Theme>('default');
    const [isDark, setIsDark] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load theme and dark mode from localStorage
    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as Theme;
        const savedDark = localStorage.getItem('darkMode');

        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Check saved preference or system preference if not saved
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedDark === 'true' || (!savedDark && prefersDark);

        setIsDark(shouldBeDark);
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

    }, []);

    const changeTheme = (t: Theme) => {
        setTheme(t);
        document.documentElement.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
        // Keep menu open to allow toggling dark mode too
    };

    const toggleDarkMode = () => {
        const newDark = !isDark;
        setIsDark(newDark);
        localStorage.setItem('darkMode', String(newDark));
        if (newDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const themes: { id: Theme; label: string; color: string }[] = [
        { id: 'default', label: 'Default', color: 'bg-zinc-500' },
        { id: 'ocean', label: 'Ocean', color: 'bg-sky-500' },
        { id: 'forest', label: 'Forest', color: 'bg-green-600' },
        { id: 'cyberpunk', label: 'Cyberpunk', color: 'bg-pink-500' },
    ];

    if (!mounted) return null;

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

                        {/* Themes List */}
                        <div className="space-y-1">
                            <span className="px-2 text-xs font-semibold text-muted-foreground">Color Palette</span>
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => changeTheme(t.id)}
                                    className={cn(
                                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                        theme === t.id && "bg-accent text-accent-foreground font-medium"
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={cn("h-3 w-3 rounded-full", t.color)} />
                                        {t.label}
                                    </span>
                                    {theme === t.id && <span className="text-xs">✓</span>}
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
