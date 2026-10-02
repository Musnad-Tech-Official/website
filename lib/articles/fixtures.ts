import type { Article } from "./types";

export const INITIAL_ARTICLES_FIXTURES: Article[] = [
  {
    id: "art-1",
    slug: "nextjs-clean-architecture-enterprise",
    titleEn: "Architecting Resilient Enterprise Next.js Applications",
    titleAr: "بناء تطبيقات Next.js للمؤسسات بمعمارية قوية ونظيفة",
    excerptEn: "A deep dive into modular domain-driven boundaries, resilient server actions, and localized routing.",
    excerptAr: "نظرة عميقة في هندسة النطاقات المعيارية، دوال الخادم المقاومة للأخطاء، والتوجيه المترجم.",
    contentHtmlEn: `<h2>Building for Scale and Maintainability</h2><p>In modern web engineering, separation of concerns is paramount. When architecting large-scale applications with Next.js, isolating presentation widgets from domain-level server actions ensures our systems remain testable and resilient.</p><blockquote>"Clean architecture is not about writing more code; it is about writing code that can survive change."</blockquote><h3>Key Engineering Principles</h3><ul><li>Stateless Server Components for maximum initial payload performance.</li><li>Atomic Server Actions with explicit Clerk authentication verification.</li><li>Decoupled Rich Text management utilizing headless Tiptap editors.</li></ul><pre><code>// Example Server Action Guard
export async function verifyAdminAuth() {
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}</code></pre>`,
    contentHtmlAr: `<h2>البناء القابل للتوسع والاستدامة</h2><p>في هندسة الويب الحديثة، يعتبر فصل الاهتمامات مبدأً جوهرياً. عند تصميم تطبيقات ضخمة بواسطة Next.js، يضمن عزل مكونات العرض عن دوال الخادم بقاء النظام قابلاً للاختبار والصمود.</p><blockquote>"المعمارية النظيفة لا تعني كتابة كود إضافي، بل كتابة كود يستطيع الصمود أمام التغييرات."</blockquote><h3>المبادئ الهندسية الأساسية</h3><ul><li>مكونات خادم بدون حالة (Stateless RSC) لأقصى سرعة تحميل أولي.</li><li>دوال خادم ذرية ومحمية بالتحقق الصارم من صلاحيات المدير.</li><li>محررات نصوص متقدمة ومرنة تمنح الكاتب حرية التنسيق ولصق الوسائط.</li></ul>`,
    category: "Engineering",
    categorySlug: "engineering",
    tags: ["Next.js", "Architecture", "TypeScript"],
    layoutVariant: "featured",
    status: "published",
    readTimeEn: "6 min read",
    readTimeAr: "6 دقائق للقراءة",
    authorName: "Musnad Engineering",
    authorRole: "Platform Architecture Team",
    publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "art-2",
    slug: "supabase-postgres-security-rls-guide",
    titleEn: "Supabase & Postgres: Zero-Trust Row Level Security (RLS)",
    titleAr: "قواعد أمان Supabase و Postgres: الحماية الصارمة على مستوى الصفوف (RLS)",
    excerptEn: "How to design Bulletproof RLS policies that enforce multi-tenant access control and Clerk role claims directly in PostgreSQL.",
    excerptAr: "كيفية تصميم سياسات RLS حصينة تعتمد على أدوار المستخدمين في Clerk مباشرة داخل محرك PostgreSQL.",
    contentHtmlEn: `<h2>Why Defense in Depth Matters</h2><p>Row Level Security ensures that even if an API route has an unintentional logic leak, PostgreSQL itself enforces security policies before returning a single byte of data to the caller.</p><h3>Example Admin Policy</h3><pre><code>CREATE POLICY "Admins full control" 
  ON public.articles FOR ALL 
  TO authenticated 
  USING ((auth.jwt() -> 'metadata' ->> 'role') = 'admin');</code></pre>`,
    contentHtmlAr: `<h2>أهمية الأمان متعدد الطبقات</h2><p>تضمن سياسات Row Level Security أنه حتى لو حدث خطأ برمجي غير مقصود في واجهة برمجة التطبيقات، فإن قاعدة بيانات PostgreSQL نفسها ستمنع تسريب البيانات غير المصرح بها.</p>`,
    category: "Security",
    categorySlug: "security",
    tags: ["Supabase", "PostgreSQL", "RLS", "Security"],
    layoutVariant: "default",
    status: "published",
    readTimeEn: "4 min read",
    readTimeAr: "4 دقائق للقراءة",
    authorName: "Musnad Security",
    authorRole: "DevOps & Security Team",
    publishedAt: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "art-3",
    slug: "design-systems-modern-web-aesthetics",
    titleEn: "Crafting High-Performance Design Systems with Tailwind CSS",
    titleAr: "بناء أنظمة التصميم الحديثة وعالية الأداء باستخدام Tailwind CSS",
    excerptEn: "Best practices for token-driven color palettes, typography hierarchies, and dark mode harmony without CSS bloat.",
    excerptAr: "أفضل الممارسات لتصميم أنظمة ألوان معيارية وهرمية خطوط متناسقة مع الوضع الليلي بدون تضخيم لملفات الأنماط.",
    contentHtmlEn: `<h2>Cohesive Aesthetic Foundations</h2><p>A great design system relies on semantic tokens rather than arbitrary color codes. By leveraging HSL tailored palettes and CSS variables, switching between light and dark modes feels completely native and buttery smooth.</p>`,
    contentHtmlAr: `<h2>أسس بصرية متناسقة ومريحة</h2><p>يعتمد نظام التصميم الناجح على المتغيرات الدلالية بدلاً من القيم العشوائية، مما يتيح التبديل السلس بين الوضع الليلي والنهاري بأداء فائق.</p>`,
    category: "Design",
    categorySlug: "design",
    tags: ["Design System", "CSS", "UI/UX"],
    layoutVariant: "default",
    status: "draft",
    readTimeEn: "5 min read",
    readTimeAr: "5 دقائق للقراءة",
    authorName: "Musnad Design",
    authorRole: "Design Systems Lead",
    publishedAt: undefined,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
