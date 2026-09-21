import { Navbar } from "@/components/navbar/navbar";
import { UIShowcase } from "@/components/ui-showcase";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const isRtl = locale === "ar";

  const announcement = isRtl
    ? {
        text: "تم إطلاق مكتبة مكونات ونظام تصميم مسند للتقنية للجيل القادم!",
        tag: "جديد",
        href: "/services",
        linkText: "استكشف الآن",
      }
    : {
        text: "Musnad UI Design System & Component Library is officially live!",
        tag: "New",
        href: "/services",
        linkText: "Explore components",
      };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      <Navbar
        locale={locale}
        direction={isRtl ? "rtl" : "ltr"}
        announcement={announcement}
      />

      <div className="flex-1">
        <UIShowcase />
      </div>
    </div>
  );
}



