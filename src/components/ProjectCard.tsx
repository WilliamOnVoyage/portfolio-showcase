
'use client';

import { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Star, Lock, Globe } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => {
        if (project.is_private || project.longDescription) {
            setIsModalOpen(true);
        } else {
            window.open(project.html_url, '_blank');
        }
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md cursor-pointer"
                onClick={handleOpen}
            >
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                                {project.name}
                                {project.is_private && <Lock className="h-3 w-3 text-muted-foreground" />}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {project.description}
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                            {project.stargazers_count > 0 && (
                                <div className="flex items-center gap-1 text-xs">
                                    <Star className="h-3 w-3" />
                                    <span>{project.stargazers_count}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {project.techStack?.slice(0, 3).map((tech) => (
                            <Badge key={tech} variant="secondary" className="text-[10px]">
                                {tech}
                            </Badge>
                        ))}
                        {(project.techStack?.length || 0) > 3 && (
                            <Badge variant="outline" className="text-[10px]">
                                +{(project.techStack?.length || 0) - 3}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project.language}</span>
                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
            </motion.div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={project.name}>
                <div className="space-y-4">
                    {project.mockup && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-md bg-muted">
                            <Image
                                src={project.mockup}
                                alt={project.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}

                    <p className="text-sm text-muted-foreground">
                        {project.longDescription || project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {project.techStack?.map((tech) => (
                            <Badge key={tech}>{tech}</Badge>
                        ))}
                    </div>

                    <div className="flex gap-4 pt-4">
                        {!project.is_private && project.html_url && (
                            <a
                                href={project.html_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-medium hover:underline"
                            >
                                <Github className="h-4 w-4" />
                                View on GitHub
                            </a>
                        )}
                        {(project.homepage || project.liveUrl) && (
                            <a
                                href={project.liveUrl || project.homepage || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-medium hover:underline"
                            >
                                <Globe className="h-4 w-4" />
                                Live Site
                            </a>
                        )}
                        {project.demoUrl && (
                            <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 text-sm font-medium hover:underline text-primary"
                            >
                                <Globe className="h-4 w-4" />
                                Watch Demo
                            </a>
                        )}
                        {project.is_private && (
                            <span className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Lock className="h-4 w-4" />
                                Private Repository
                            </span>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
