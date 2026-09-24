import type { FaqData } from "./faq-types";

/**
 * Returns structured FAQ content populated with localized strings.
 */
export function getFaqData(t: (key: string) => string): FaqData {
  return {
    topicGroups: [
      {
        id: "working-with-us",
        title: t("topics.workingWithUs.title"),
        count: 2,
        items: [
          {
            id: "working-with-us-1",
            question: t("topics.workingWithUs.q1.question"),
            answer: t("topics.workingWithUs.q1.answer"),
          },
          {
            id: "working-with-us-2",
            question: t("topics.workingWithUs.q2.question"),
            answer: t("topics.workingWithUs.q2.answer"),
          },
        ],
      },
      {
        id: "company",
        title: t("topics.company.title"),
        count: 2,
        items: [
          {
            id: "company-1",
            question: t("topics.company.q1.question"),
            answer: t("topics.company.q1.answer"),
          },
          {
            id: "company-2",
            question: t("topics.company.q2.question"),
            answer: t("topics.company.q2.answer"),
          },
        ],
      },
      {
        id: "accounts",
        title: t("topics.accounts.title"),
        count: 1,
        items: [
          {
            id: "accounts-1",
            question: t("topics.accounts.q1.question"),
            answer: t("topics.accounts.q1.answer"),
          },
        ],
      },
      {
        id: "contact",
        title: t("topics.contact.title"),
        count: 1,
        items: [
          {
            id: "contact-1",
            question: t("topics.contact.q1.question"),
            answer: t("topics.contact.q1.answer"),
          },
        ],
      },
    ],
    sidebarTopics: [
      {
        id: "working-with-us",
        title: t("topics.workingWithUs.title"),
        count: 2,
        href: "#working-with-us",
      },
      {
        id: "company",
        title: t("topics.company.title"),
        count: 2,
        href: "#company",
      },
      {
        id: "accounts",
        title: t("topics.accounts.title"),
        count: 1,
        href: "#accounts",
      },
      {
        id: "contact",
        title: t("topics.contact.title"),
        count: 1,
        href: "#contact",
      },
    ],
    stillHaveQuestions: {
      title: t("sidebar.stillHaveQuestions.title"),
      description: t("sidebar.stillHaveQuestions.description"),
      ctaLabel: t("sidebar.stillHaveQuestions.cta"),
      ctaHref: "/contact",
    },
    quickLinks: [
      {
        id: "services",
        title: t("sidebar.quickLinks.services"),
        href: "/services",
      },
      {
        id: "projects",
        title: t("sidebar.quickLinks.projects"),
        href: "/projects",
      },
      {
        id: "careers",
        title: t("sidebar.quickLinks.careers"),
        href: "/careers",
      },
      {
        id: "about",
        title: t("sidebar.quickLinks.about"),
        href: "/about",
      },
    ],
  };
}
