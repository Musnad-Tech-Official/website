import React from "react";
import {
  SiVite,
  SiNextdotjs,
  SiReact,
  SiFigma,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiNodedotjs,
  SiNestjs,
  SiGraphql,
  SiPhp,
  SiPostgresql,
  SiMysql,
  SiMongodb,
  SiSupabase,
  SiDocker,
  SiExpo,
  SiFirebase,
  SiSpringboot,
  SiElectron,
  SiClerk,
} from "react-icons/si";
import { FaJava } from "react-icons/fa6";
import type { TechId } from "./tech-data";

export interface TechIconProps {
  id: TechId;
  className?: string;
}

const ICON_MAP: Record<TechId, React.ComponentType<{ className?: string }>> = {
  vite: SiVite,
  nextjs: SiNextdotjs,
  react: SiReact,
  "react-native": SiReact,
  expo: SiExpo,
  figma: SiFigma,
  typescript: SiTypescript,
  javascript: SiJavascript,
  tailwind: SiTailwindcss,
  nodejs: SiNodedotjs,
  nestjs: SiNestjs,
  springboot: SiSpringboot,
  java: FaJava,
  electron: SiElectron,
  graphql: SiGraphql,
  clerk: SiClerk,
  firebase: SiFirebase,
  supabase: SiSupabase,
  postgresql: SiPostgresql,
  mysql: SiMysql,
  mongodb: SiMongodb,
  php: SiPhp,
  docker: SiDocker,
};

export function TechIcon({ id, className = "w-4.5 h-4.5" }: TechIconProps) {
  const IconComponent = ICON_MAP[id];
  const isSquareBadge = id === "typescript" || id === "javascript";

  return (
    <span
      className={`shrink-0 flex items-center justify-center w-8 h-8 ${
        isSquareBadge ? "rounded-lg" : "rounded-full"
      } bg-neutral-900 text-white dark:bg-black/90 dark:text-white shadow-xs ring-1 ring-border/50 dark:ring-white/15`}
    >
      {IconComponent && <IconComponent className={className} />}
    </span>
  );
}

