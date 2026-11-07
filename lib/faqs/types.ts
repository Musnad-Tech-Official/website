export interface FaqTopicRecord {
  id: string;
  slug: string;
  titleEn: string;
  titleAr: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqQuestionRecord {
  id: string;
  topicId: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
