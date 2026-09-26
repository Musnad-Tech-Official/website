
export interface FaqQuestionItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqTopicGroupData {
  id: string;
  title: string;
  count: number;
  items: FaqQuestionItem[];
}

export interface FaqSidebarTopicItem {
  id: string;
  title: string;
  count: number;
  href: string;
}

export interface FaqQuickLinkItem {
  id: string;
  title: string;
  href: string;
}

export interface FaqData {
  topicGroups: FaqTopicGroupData[];
  sidebarTopics: FaqSidebarTopicItem[];
  stillHaveQuestions: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  quickLinks: FaqQuickLinkItem[];
}

export interface FaqIntroProps {
  className?: string;
}

export interface FaqTopicGroupProps {
  group: FaqTopicGroupData;
  className?: string;
}

export interface FaqAccordionProps {
  items: FaqQuestionItem[];
  groupId: string;
  className?: string;
}

export interface FaqSidebarProps {
  sidebarTopics: FaqSidebarTopicItem[];
  browseTitle: string;
  quickLinksTitle: string;
  quickLinks: FaqQuickLinkItem[];
  stillHaveQuestions: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  className?: string;
}
