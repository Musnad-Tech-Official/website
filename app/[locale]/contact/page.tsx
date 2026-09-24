import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getContactInfo } from "@/data/contact";
import {
  ContactHeader,
  ContactForm,
  ContactInfoCards,
} from "@/components/contact";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const tHeader = await getTranslations({ locale, namespace: "Contact.header" });
  const tBreadcrumb = await getTranslations({ locale, namespace: "Contact.breadcrumb" });
  const contactInfo = getContactInfo(locale);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex-1 pb-16 sm:pb-24 lg:pb-32">
      {/* 1. Page Header with Breadcrumbs, Eyebrow, Title & Subtitle */}
      <ContactHeader
        eyebrow={tHeader("eyebrow")}
        title={tHeader("title")}
        subtitle={tHeader("subtitle")}
        homeLabel={tBreadcrumb("home")}
        contactLabel={tBreadcrumb("contact")}
        breadcrumbLabel={tBreadcrumb("label")}
      />

      {/* 2. Main Contact Grid (Form + Sidebar Info Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Contact Form */}
        <section
          aria-labelledby="contact-form-heading"
          className="lg:col-span-7"
        >
          <h2 id="contact-form-heading" className="sr-only">
            {tHeader("title")}
          </h2>
          <ContactForm />
        </section>

        {/* Right Column: Other ways to reach us & What happens next */}
        <aside
          aria-label={tBreadcrumb("contact")}
          className="lg:col-span-5"
        >
          <ContactInfoCards contactInfo={contactInfo} />
        </aside>
      </div>
    </div>
  );
}
