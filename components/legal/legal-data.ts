import type { LegalPageConfig } from "./legal-types";

/**
 * Returns structured configuration for the Privacy Policy page.
 */
export function getPrivacyPolicyData(
  t: (key: string) => string,
  tCommon: (key: string) => string
): LegalPageConfig {
  return {
    slug: "privacy-policy",
    breadcrumbHome: tCommon("breadcrumb.home"),
    breadcrumbLegal: tCommon("breadcrumb.legal"),
    breadcrumbCurrent: t("breadcrumbCurrent"),
    breadcrumbLabel: tCommon("breadcrumb.label"),
    eyebrow: tCommon("eyebrow"),
    title: t("title"),
    lastUpdatedLabel: tCommon("lastUpdatedLabel"),
    lastUpdatedDate: tCommon("lastUpdatedDate"),
    introNote: t("introNote"),
    onThisPageLabel: tCommon("onThisPage"),
    sections: [
      {
        id: "information-we-collect",
        number: "01",
        title: t("sections.s01.title"),
        paragraphs: [
          t("sections.s01.p1"),
          t("sections.s01.p2"),
        ],
      },
      {
        id: "how-we-use-information",
        number: "02",
        title: t("sections.s02.title"),
        bullets: [
          t("sections.s02.b1"),
          t("sections.s02.b2"),
          t("sections.s02.b3"),
          t("sections.s02.b4"),
        ],
      },
      {
        id: "cookies-and-analytics",
        number: "03",
        title: t("sections.s03.title"),
        paragraphs: [t("sections.s03.p1")],
      },
      {
        id: "attachments-and-scanning",
        number: "04",
        title: t("sections.s04.title"),
        paragraphs: [t("sections.s04.p1")],
      },
      {
        id: "data-retention",
        number: "05",
        title: t("sections.s05.title"),
        bullets: [
          t("sections.s05.b1"),
          t("sections.s05.b2"),
          t("sections.s05.b3"),
        ],
      },
      {
        id: "your-rights",
        number: "06",
        title: t("sections.s06.title"),
        paragraphs: [t("sections.s06.p1")],
      },
      {
        id: "contact",
        number: "07",
        title: t("sections.s07.title"),
        paragraphs: [t("sections.s07.p1")],
      },
    ],
    contactCard: {
      title: t("contactCard.title"),
      supportingLinePrefix: t("contactCard.supportingLinePrefix"),
      email: "hello@musnad.tech",
      buttonText: t("contactCard.buttonText"),
    },
  };
}

/**
 * Returns structured configuration for the Terms of Service page.
 */
export function getTermsOfServiceData(
  t: (key: string) => string,
  tCommon: (key: string) => string
): LegalPageConfig {
  return {
    slug: "terms-of-service",
    breadcrumbHome: tCommon("breadcrumb.home"),
    breadcrumbLegal: tCommon("breadcrumb.legal"),
    breadcrumbCurrent: t("breadcrumbCurrent"),
    breadcrumbLabel: tCommon("breadcrumb.label"),
    eyebrow: tCommon("eyebrow"),
    title: t("title"),
    lastUpdatedLabel: tCommon("lastUpdatedLabel"),
    lastUpdatedDate: tCommon("lastUpdatedDate"),
    introNote: t("introNote"),
    onThisPageLabel: tCommon("onThisPage"),
    sections: [
      {
        id: "service-description",
        number: "01",
        title: t("sections.s01.title"),
        paragraphs: [t("sections.s01.p1")],
      },
      {
        id: "acceptable-use",
        number: "02",
        title: t("sections.s02.title"),
        bullets: [
          t("sections.s02.b1"),
          t("sections.s02.b2"),
          t("sections.s02.b3"),
          t("sections.s02.b4"),
        ],
      },
      {
        id: "intellectual-property",
        number: "03",
        title: t("sections.s03.title"),
        paragraphs: [
          t("sections.s03.p1"),
          t("sections.s03.p2"),
        ],
      },
      {
        id: "disclaimers",
        number: "04",
        title: t("sections.s04.title"),
        paragraphs: [t("sections.s04.p1")],
      },
      {
        id: "limitation-of-liability",
        number: "05",
        title: t("sections.s05.title"),
        paragraphs: [t("sections.s05.p1")],
      },
      {
        id: "governing-law",
        number: "06",
        title: t("sections.s06.title"),
        paragraphs: [t("sections.s06.p1")],
      },
      {
        id: "changes-to-these-terms",
        number: "07",
        title: t("sections.s07.title"),
        paragraphs: [t("sections.s07.p1")],
      },
    ],
    contactCard: {
      title: t("contactCard.title"),
      supportingLinePrefix: t("contactCard.supportingLinePrefix"),
      email: "hello@musnad.tech",
      buttonText: t("contactCard.buttonText"),
    },
  };
}

/**
 * Returns structured configuration for the Cookie Policy page.
 */
export function getCookiePolicyData(
  t: (key: string) => string,
  tCommon: (key: string) => string
): LegalPageConfig {
  return {
    slug: "cookie-policy",
    breadcrumbHome: tCommon("breadcrumb.home"),
    breadcrumbLegal: tCommon("breadcrumb.legal"),
    breadcrumbCurrent: t("breadcrumbCurrent"),
    breadcrumbLabel: tCommon("breadcrumb.label"),
    eyebrow: tCommon("eyebrow"),
    title: t("title"),
    lastUpdatedLabel: tCommon("lastUpdatedLabel"),
    lastUpdatedDate: tCommon("lastUpdatedDate"),
    introNote: t("introNote"),
    onThisPageLabel: tCommon("onThisPage"),
    sections: [
      {
        id: "what-are-cookies",
        number: "01",
        title: t("sections.s01.title"),
        paragraphs: [t("sections.s01.p1")],
      },
      {
        id: "types-we-use",
        number: "02",
        title: t("sections.s02.title"),
        bullets: [
          t("sections.s02.b1"),
          t("sections.s02.b2"),
          t("sections.s02.b3"),
        ],
      },
      {
        id: "third-party-cookies",
        number: "03",
        title: t("sections.s03.title"),
        paragraphs: [t("sections.s03.p1")],
      },
      {
        id: "managing-and-disabling-cookies",
        number: "04",
        title: t("sections.s04.title"),
        paragraphs: [t("sections.s04.p1")],
      },
      {
        id: "impact-on-features",
        number: "05",
        title: t("sections.s05.title"),
        bullets: [
          t("sections.s05.b1"),
          t("sections.s05.b2"),
          t("sections.s05.b3"),
        ],
      },
      {
        id: "changes-to-this-policy",
        number: "06",
        title: t("sections.s06.title"),
        paragraphs: [t("sections.s06.p1")],
      },
    ],
    contactCard: {
      title: t("contactCard.title"),
      supportingLinePrefix: t("contactCard.supportingLinePrefix"),
      email: "hello@musnad.tech",
      buttonText: t("contactCard.buttonText"),
    },
  };
}
