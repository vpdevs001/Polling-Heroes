export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown[];
};

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
};

export type PollListItem = {
  id: string;
  hostId: string;
  title: string;
  description: string | null;
  url: string;
  participantType: "Authenticated" | "Anonymous";
  status: "Active" | "Ended";
  isPublished: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
};

export type QuestionOption = {
  id: string;
  questionId: string;
  text: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type Question = {
  id: string;
  pollId: string;
  text: string;
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  options: QuestionOption[];
};

export type PublicPollPayload = {
  poll: {
    id: string;
    title: string;
    description: string | null;
    participantType: "Authenticated" | "Anonymous";
    status: "Active" | "Ended";
    isPublished: boolean;
    expiresAt: string | null;
    url: string;
  };
  questions: Question[];
};

export type AnalyticsPayload = {
  poll: {
    id: string;
    title: string;
    description: string | null;
    status: "Active" | "Ended";
    isPublished: boolean;
    participantType: "Authenticated" | "Anonymous";
    expiresAt: string | null;
    totalSubmissions: number;
    uniqueResponders: number;
  };
  questions: Array<{
    id: string;
    text: string;
    isRequired: boolean;
    totalAnswers: number;
    options: Array<{
      id: string;
      text: string;
      count: number;
      percentage: number;
    }>;
  }>;
  timeline: Array<{ date: string; count: number }>;
};
