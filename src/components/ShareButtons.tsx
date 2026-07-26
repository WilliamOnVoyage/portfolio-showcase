'use client';

import { useState } from "react";
import { Share2, Check, Copy, Linkedin, Twitter } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return url || window.location.href;
    }
    return url || "";
  };

  const handleCopy = async () => {
    const targetUrl = getShareUrl();
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleTwitterShare = () => {
    const targetUrl = getShareUrl();
    const shareText = encodeURIComponent(`"${title}" by @MoliangZhou`);
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
        targetUrl
      )}`,
      "_blank"
    );
  };

  const handleLinkedinShare = () => {
    const targetUrl = getShareUrl();
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        targetUrl
      )}`,
      "_blank"
    );
  };

  return (
    <div className="glass-panel rounded-xl p-4 space-y-3 font-mono border border-border/50 dark:border-white/10">
      <div className="flex items-center gap-2 text-xs text-secondary dark:text-primary font-bold uppercase tracking-widest border-b border-border/50 dark:border-white/10 pb-2">
        <Share2 className="w-4 h-4" />
        <span>Share Article</span>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleTwitterShare}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-secondary/5 dark:bg-white/5 hover:bg-secondary/15 dark:hover:bg-white/10 text-xs text-foreground transition-all border border-border/50 dark:border-white/10 hover:border-secondary hover:text-secondary font-medium"
        >
          <span className="flex items-center gap-2">
            <Twitter className="w-3.5 h-3.5" /> Share on X
          </span>
          <span className="text-[10px] text-foreground/50 dark:text-muted-foreground">↗</span>
        </button>

        <button
          onClick={handleLinkedinShare}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-secondary/5 dark:bg-white/5 hover:bg-secondary/15 dark:hover:bg-white/10 text-xs text-foreground transition-all border border-border/50 dark:border-white/10 hover:border-secondary hover:text-secondary font-medium"
        >
          <span className="flex items-center gap-2">
            <Linkedin className="w-3.5 h-3.5" /> Share on LinkedIn
          </span>
          <span className="text-[10px] text-foreground/50 dark:text-muted-foreground">↗</span>
        </button>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-secondary/15 dark:bg-primary/10 hover:bg-secondary/25 dark:hover:bg-primary/20 text-xs text-secondary dark:text-primary transition-all border border-secondary/30 dark:border-primary/30 font-bold"
        >
          <span className="flex items-center gap-2">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Link Copied!" : "Copy Direct Link"}
          </span>
        </button>
      </div>
    </div>
  );
}
