'use client';

import { motion } from "framer-motion";
import { GitBranch, Cpu, Globe, ArrowDown, Zap, Layers, Database, Server } from "lucide-react";

export interface ArchitectureStep {
  step: number;
  badge: string;
  title: string;
  description: string;
  tag?: string;
  connector?: string;
  type?: 'source' | 'process' | 'edge' | 'db' | 'custom';
}

export interface ArchitectureDiagramData {
  title?: string;
  subtitle?: string;
  badge?: string;
  steps?: ArchitectureStep[];
}

export interface ArchitectureDiagramProps {
  content?: string;
  data?: ArchitectureDiagramData;
}

const DEFAULT_DATA: ArchitectureDiagramData = {
  title: "ByteByteGo Architecture // Zero-Maintenance System",
  subtitle: "3-Tier Automated Pipeline",
  badge: "Automated Pipeline",
  steps: [
    {
      step: 1,
      badge: "Step 1 • Upstream Source",
      title: "Individual Tracking Repositories",
      description: "Each repository controls its narrative by committing a root PORTFOLIO.json contract file (tagline, public description, live URL, thumbnail).",
      tag: "PORTFOLIO.json",
      connector: "Octokit REST API Fetch & Taxonomy Merge",
      type: "source"
    },
    {
      step: 2,
      badge: "Step 2 • Data Ingestion & Build",
      title: "Portfolio Showcase Ingestion Engine",
      description: "Build script queries GitHub REST API, fetches contract files, applies taxonomy overrides (category, techStack), and outputs compiled datasets.",
      tag: "project-overrides.json",
      connector: "Next.js 14 SSG Pre-rendering & Global CDN Push",
      type: "process"
    },
    {
      step: 3,
      badge: "Step 3 • Edge Production",
      title: "Statically Deployed Showcase Host",
      description: "Statically optimized pages (/, /blog, /blog/[slug]) served globally via AWS Route53 & Vercel Edge CDN with zero runtime server latency.",
      tag: "moliang.ai",
      type: "edge"
    }
  ]
};

export function ArchitectureDiagram({ content, data }: ArchitectureDiagramProps) {
  let activeData = DEFAULT_DATA;

  if (data) {
    activeData = { ...DEFAULT_DATA, ...data };
  } else if (content && content.trim().length > 0) {
    try {
      const parsed = JSON.parse(content.trim());
      if (parsed && typeof parsed === "object") {
        activeData = {
          title: parsed.title || DEFAULT_DATA.title,
          subtitle: parsed.subtitle || DEFAULT_DATA.subtitle,
          badge: parsed.badge || DEFAULT_DATA.badge,
          steps: Array.isArray(parsed.steps) && parsed.steps.length > 0 ? parsed.steps : DEFAULT_DATA.steps
        };
      }
    } catch {
      // Fall back to default data if content is not JSON
      activeData = DEFAULT_DATA;
    }
  }

  const getStepIcon = (type?: string, index?: number) => {
    switch (type) {
      case 'source':
        return <GitBranch className="w-5 h-5" />;
      case 'process':
        return <Cpu className="w-5 h-5" />;
      case 'edge':
        return <Globe className="w-5 h-5" />;
      case 'db':
        return <Database className="w-5 h-5" />;
      case 'server':
        return <Server className="w-5 h-5" />;
      default:
        if (index === 0) return <GitBranch className="w-5 h-5" />;
        if (index === 1) return <Cpu className="w-5 h-5" />;
        return <Globe className="w-5 h-5" />;
    }
  };

  const getStepColors = (type?: string, index?: number) => {
    const colorIndex = type ? type : (index === 0 ? 'source' : index === 1 ? 'process' : 'edge');
    switch (colorIndex) {
      case 'source':
        return {
          iconBg: "bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400",
          badgeText: "text-blue-600 dark:text-blue-400",
          tag: "text-foreground/60 dark:text-muted-foreground bg-secondary/10 dark:bg-white/10",
          border: "border-border/70 dark:border-white/15",
          dot: "bg-blue-500"
        };
      case 'process':
        return {
          iconBg: "bg-secondary/15 dark:bg-primary/20 text-secondary dark:text-primary",
          badgeText: "text-secondary dark:text-primary",
          tag: "text-foreground/60 dark:text-muted-foreground bg-secondary/10 dark:bg-white/10",
          border: "border-secondary/40 dark:border-primary/40 ring-1 ring-secondary/20 dark:ring-primary/20",
          dot: "bg-secondary dark:bg-primary"
        };
      case 'edge':
      default:
        return {
          iconBg: "bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400",
          badgeText: "text-emerald-600 dark:text-emerald-400",
          tag: "text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20",
          border: "border-border/70 dark:border-white/15",
          dot: "bg-emerald-500"
        };
    }
  };

  return (
    <div className="not-prose my-8 p-6 md:p-8 rounded-2xl glass-panel border border-border/60 dark:border-white/10 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5 dark:from-white/5 dark:to-white/5 shadow-lg space-y-6 w-full">
      {/* Diagram Header */}
      <div className="flex items-center justify-between border-b border-border/50 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-secondary dark:text-primary font-bold">
          <Layers className="w-4 h-4" />
          <span>{activeData.title}</span>
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-foreground/70 dark:text-muted-foreground bg-secondary/10 dark:bg-white/10 px-2.5 py-1 rounded-full border border-secondary/20 dark:border-white/10">
          <Zap className="w-3 h-3 text-amber-500" /> {activeData.badge || "Automated Architecture"}
        </span>
      </div>

      {/* ByteByteGo Vertical Pipeline Flow */}
      <div className="space-y-4 relative">
        {activeData.steps?.map((stepItem, idx) => {
          const colors = getStepColors(stepItem.type, idx);
          const isLast = idx === (activeData.steps?.length || 0) - 1;

          return (
            <div key={idx} className="space-y-4">
              <motion.div
                whileHover={{ x: 4 }}
                className={`rounded-xl p-5 bg-card/90 dark:bg-white/5 ${colors.border} shadow-sm space-y-3 relative`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`p-2.5 rounded-lg ${colors.iconBg}`}>
                      {getStepIcon(stepItem.type, idx)}
                    </span>
                    <div>
                      <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${colors.badgeText}`}>
                        {stepItem.badge || `Step ${stepItem.step}`}
                      </span>
                      <h4 className="font-bold text-base text-foreground leading-none mt-1">
                        {stepItem.title}
                      </h4>
                    </div>
                  </div>
                  {stepItem.tag && (
                    <span className={`hidden sm:inline-block font-mono text-xs px-2.5 py-1 rounded-md ${colors.tag}`}>
                      {stepItem.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/80 dark:text-muted-foreground leading-relaxed pl-12">
                  {stepItem.description}
                </p>
              </motion.div>

              {/* Downward Flow Connector */}
              {!isLast && (
                <div className="flex items-center justify-center gap-2 py-1 text-secondary dark:text-primary">
                  <div className="h-4 w-0.5 bg-secondary/40 dark:bg-primary/40" />
                  <ArrowDown className="w-4 h-4 animate-bounce text-secondary dark:text-primary" />
                  {stepItem.connector && (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/60 dark:text-muted-foreground font-semibold">
                      {stepItem.connector}
                    </span>
                  )}
                  <div className="h-4 w-0.5 bg-secondary/40 dark:bg-primary/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Legend */}
      <div className="pt-4 border-t border-border/40 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] text-foreground/60 dark:text-muted-foreground">
        <div className="flex items-center gap-4">
          {activeData.steps?.slice(0, 3).map((stepItem, idx) => {
            const colors = getStepColors(stepItem.type, idx);
            return (
              <span key={idx} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                {stepItem.badge?.split('•')[1]?.trim() || stepItem.title}
              </span>
            );
          })}
        </div>
        <span>ByteByteGo Architecture Spec</span>
      </div>
    </div>
  );
}
