
'use client';

import { Project } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, Lock, Globe, Terminal } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';

interface ProjectCardProps {
    project: Project;
}

function normalizeMockupSrc(src?: string | null) {
    if (!src || src.startsWith('http')) return src;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    if (!basePath || src.startsWith(`${basePath}/`)) return src;

    return src.startsWith('/') ? `${basePath}${src}` : `${basePath}/${src}`;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const mockupSrc = normalizeMockupSrc(project.mockup);

    const handleOpen = () => setIsModalOpen(true);

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl glass-panel p-6 shadow-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-primary/50 cursor-pointer"
                onClick={handleOpen}
            >
                {/* Optional HUD accent on hover */}
                <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-300 ease-out" />

                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <h3 className="font-bold text-xl leading-none tracking-tight flex items-center gap-2 group-hover:text-primary transition-colors">
                                {project.name}
                                {project.is_private && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                            {project.stargazers_count > 0 && (
                                <div className="flex items-center gap-1 text-xs font-mono">
                                    <Star className="h-3 w-3" />
                                    <span>{project.stargazers_count}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {project.techStack?.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-muted-foreground uppercase tracking-widest group-hover:border-primary/30 transition-colors">
                                {tech}
                            </span>
                        ))}
                        {(project.techStack?.length || 0) > 3 && (
                            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                +{(project.techStack?.length || 0) - 3}
                            </span>
                        )}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-muted-foreground uppercase">
                    <span className="flex items-center gap-1"><Terminal className="w-3 h-3"/> {project.language || 'DATA'}</span>
                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
            </motion.div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`[SYS.READ] ${project.name}`} className="sm:max-w-3xl glass-panel !bg-background/95">
                <div className="flex flex-col gap-8 md:flex-row">
                    {mockupSrc && (
                        <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-lg border border-white/10 md:h-auto md:w-64 bg-black/50">
                            <Image
                                src={mockupSrc}
                                alt={project.name}
                                fill
                                className="object-contain object-center p-2 group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}

                    <div className="flex min-w-0 flex-1 flex-col space-y-6">
                        <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4">
                            {!project.is_private && project.html_url && (
                                <a
                                    href={project.html_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:text-primary transition-colors"
                                >
                                    <Github className="h-4 w-4" />
                                    Source
                                </a>
                            )}
                            {(project.homepage || project.liveUrl) && (
                                <a
                                    href={project.liveUrl || project.homepage || '#'}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest hover:text-primary transition-colors"
                                >
                                    <Globe className="h-4 w-4" />
                                    Live Deploy
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                                >
                                    <Globe className="h-4 w-4" />
                                    Execute Demo
                                </a>
                            )}
                            {project.is_private && (
                                <span className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                                    <Lock className="h-4 w-4" />
                                    Classified
                                </span>
                            )}
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 font-sans tracking-wide">
                            <ReactMarkdown>
                                {project.longDescription || project.description}
                            </ReactMarkdown>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                            {project.techStack?.map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-primary/10 border border-primary/30 text-primary rounded-sm text-xs font-mono uppercase tracking-widest">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}
