
'use client';

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export function Hero() {
    return (
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center p-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl space-y-6"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent pb-2">
                    Building the Future of AI
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground">
                    Hi, I&apos;m William. I&apos;m an engineer specializing in scalable machine learning systems,
                    generative AI, blockchain and data analytics.
                    Welcome to my digital garden.
                </p>

                <div className="flex gap-4 justify-center pt-8">
                    <a
                        href="#featured"
                        className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                    >
                        View Work
                    </a>
                    <a
                        href="https://github.com/WilliamOnVoyage"
                        target="_blank"
                        className="px-6 py-3 rounded-full border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        GitHub Profile
                    </a>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 animate-bounce"
            >
                <ArrowDown className="text-muted-foreground w-6 h-6" />
            </motion.div>
        </section>
    );
}
