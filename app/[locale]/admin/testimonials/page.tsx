import * as React from "react";
import { getTestimonialsAction } from "@/lib/testimonials/actions";
import { TestimonialsClient } from "@/components/admin/testimonials/testimonials-client";

interface AdminTestimonialsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminTestimonialsPage({
  params,
}: AdminTestimonialsPageProps) {
  const { locale } = await params;
  const testimonials = await getTestimonialsAction(true); // include inactive for admin

  return <TestimonialsClient initialTestimonials={testimonials} locale={locale} />;
}
