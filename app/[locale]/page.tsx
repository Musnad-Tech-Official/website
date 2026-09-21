import { Navbar } from "@/components/navbar/navbar";
import { NavbarUtilities } from "@/components/navbar-utilities";
import { UIShowcase } from "@/components/ui-showcase";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar
        locale={locale}
        direction={isRtl ? "rtl" : "ltr"}
        utilities={<NavbarUtilities />}
      />
      
    </div>
  );
}


