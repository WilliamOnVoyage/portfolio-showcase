'use client';

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export function NavBar() {
    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 bg-background/80 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <a href="#" className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase font-mono text-sm hover:text-primary/80 transition-colors">
                    <Terminal className="w-4 h-4" />
                    Moliang_Zhou
                </a>
                
                <div className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
                    <a href="#featured" className="hover:text-primary transition-colors">Projects</a>
                    <a href="#publications" className="hover:text-primary transition-colors">Publications</a>
                </div>

            </div>
        </motion.nav>
    );
}
