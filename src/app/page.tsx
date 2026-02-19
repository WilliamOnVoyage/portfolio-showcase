
import dynamic from "next/dynamic";
import projectsData from "@/data/projects.json";
import { Project } from "@/types";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ProjectCard } from "@/components/ProjectCard";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const BlackHoleBackground = dynamic(() => import("@/components/BlackHole").then(mod => mod.BlackHoleBackground), {
  ssr: false,
});

export default function Home() {
  const allProjects = projectsData as Project[];
  const projects = allProjects.filter(p => !p.hidden);

  // Define Featured Projects explicitly via override `featured: true` or manual check
  const featured = projects.filter(p => p.featured);

  // Professional / Org projects
  const collab = projects.filter(p => p.category === "Professional Collaboration" || p.category === "Project Aegis Suite");

  // The rest (Archive)
  const archive = projects.filter(p => !p.featured && p.category !== "Professional Collaboration" && p.category !== "Project Aegis Suite");

  return (
    <main className="min-h-screen text-foreground relative overflow-hidden">
      <BlackHoleBackground />
      <Hero />
      <ThemeSwitcher />

      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Featured Section */}
        {featured.length > 0 && (
          <section id="featured" className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight">Featured Projects</h2>
              <p className="text-muted-foreground">Detailed case studies of my most significant work.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map(p => (
                <div key={p.id} className="md:col-span-1">
                  {/* We can make featured cards bigger or styled differently here if needed. 
                       For now, ProjectCard handles it nicely. */}
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Section */}
        {collab.length > 0 && (
          <section id="collab" className="space-y-8">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight">Professional Work & Research</h2>
              <p className="text-muted-foreground">Collaborations, research suites, and organizational contributions.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collab.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </section>
        )}

        {/* Archive Section with Filter */}
        <section id="archive" className="space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">The Archive</h2>
            <p className="text-muted-foreground">A complete list of repositories, experiments, and exercises.</p>
          </div>
          <ProjectGrid projects={archive} />
        </section>
      </div>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} WilliamOnVoyage. All rights reserved.</p>
      </footer>
    </main>
  );
}
