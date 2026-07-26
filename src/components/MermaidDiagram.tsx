'use client';

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "next-themes";

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [svgContent, setSvgContent] = useState<string>("");
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    let isMounted = true;
    const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "neutral",
      fontFamily: "var(--font-geist-mono), monospace",
      securityLevel: "loose",
      themeVariables: isDark
        ? {
            darkMode: true,
            background: "transparent",
            primaryColor: "#00b4d8",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#00b4d8",
            lineColor: "#00e5ff",
            secondaryColor: "#7b2cbf",
            tertiaryColor: "#1e1e2e",
          }
        : {
            darkMode: false,
            background: "transparent",
            primaryColor: "#0284c7",
            primaryTextColor: "#0f172a",
            primaryBorderColor: "#0284c7",
            lineColor: "#0284c7",
            secondaryColor: "#e0f2fe",
            tertiaryColor: "#f8fafc",
          },
    });

    mermaid
      .render(uniqueId, chart.trim())
      .then(({ svg }) => {
        if (isMounted) {
          setSvgContent(svg);
        }
      })
      .catch((err) => {
        console.error("Mermaid render error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [chart, isDark]);

  return (
    <div
      ref={containerRef}
      className="my-8 p-6 rounded-2xl bg-secondary/5 dark:bg-white/5 border border-border/60 dark:border-white/10 flex justify-center items-center overflow-x-auto shadow-sm"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
