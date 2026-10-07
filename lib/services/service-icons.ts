import type React from "react";
import {
  LuCode,
  LuCloud,
  LuDatabase,
  LuTerminal,
  LuSparkles,
  LuLayoutGrid,
  LuCpu,
  LuShieldCheck,
  LuLayers,
  LuWorkflow,
  LuGlobe,
  LuSmartphone,
} from "react-icons/lu";

export const SERVICE_AVAILABLE_ICONS: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }> }
> = {
  LuCode: { label: "Code & Engineering", icon: LuCode },
  LuCloud: { label: "Cloud & Infrastructure", icon: LuCloud },
  LuDatabase: { label: "Data & Warehouses", icon: LuDatabase },
  LuTerminal: { label: "Terminal & CLI Tools", icon: LuTerminal },
  LuSparkles: { label: "AI & Smart Agents", icon: LuSparkles },
  LuLayoutGrid: { label: "Design Systems & UI", icon: LuLayoutGrid },
  LuCpu: { label: "Systems Architecture", icon: LuCpu },
  LuShieldCheck: { label: "Security & Compliance", icon: LuShieldCheck },
  LuLayers: { label: "Distributed Platforms", icon: LuLayers },
  LuWorkflow: { label: "DevOps & Pipelines", icon: LuWorkflow },
  LuGlobe: { label: "Global Web Platforms", icon: LuGlobe },
  LuSmartphone: { label: "Mobile Applications", icon: LuSmartphone },
};

export function getServiceIconComponent(
  iconName: string
): React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }> {
  return SERVICE_AVAILABLE_ICONS[iconName]?.icon || LuCode;
}
