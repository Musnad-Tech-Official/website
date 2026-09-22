import type { Metadata } from "next";
import { Poppins, Tajawal } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";
import { NavbarUtilities } from "@/components/navbar-utilities";
import { getAnnouncement } from "@/data/announcement";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ClerkProvider } from "@clerk/nextjs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Musnad Tech",
  description: "Empowering Next-Generation Digital Experiences",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate that the incoming `locale` is supported
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Load message bundle for this locale
  const messages = await getMessages();

  const isRtl = locale === "ar";
  const activeFont = isRtl ? tajawal : poppins;
  const announcement = getAnnouncement(locale);

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      suppressHydrationWarning
      className={`${poppins.variable} ${tajawal.variable} ${activeFont.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              scriptProps={{ async: true }}
            >
              <Navbar
                locale={locale}
                direction={isRtl ? "rtl" : "ltr"}
                announcement={announcement}
                utilities={<NavbarUtilities />}
              />
              <main className="flex-1 flex flex-col">{children}</main>
              <Footer locale={locale} direction={isRtl ? "rtl" : "ltr"} />
            </ThemeProvider>
          </NextIntlClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
