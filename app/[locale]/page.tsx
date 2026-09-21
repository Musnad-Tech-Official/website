import { UIShowcase } from "@/components/ui-showcase";

export default function Page() {
  return (
    <div className="w-full bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <UIShowcase />
    </div>
  );
}
