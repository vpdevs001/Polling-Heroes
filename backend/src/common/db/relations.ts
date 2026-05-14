import { relations } from "drizzle-orm";
import {
  users,
  polls,
  questions,
  options,
  submissions,
  responses,
} from "./schema.js";

export const usersRelations = relations(users, ({ many }) => ({
  polls: many(polls),
  submissions: many(submissions),
}));

export const pollsRelations = relations(polls, ({ one, many }) => ({
  host: one(users, {
    fields: [polls.hostId],
    references: [users.id],
  }),
  questions: many(questions),
  submissions: many(submissions),
  responses: many(responses),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  poll: one(polls, {
    fields: [questions.pollId],
    references: [polls.id],
  }),
  options: many(options),
  responses: many(responses),
}));

export const optionsRelations = relations(options, ({ one, many }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id],
  }),
  responses: many(responses),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  poll: one(polls, {
    fields: [submissions.pollId],
    references: [polls.id],
  }),
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  responses: many(responses),
}));

export const responsesRelations = relations(responses, ({ one }) => ({
  poll: one(polls, {
    fields: [responses.pollId],
    references: [polls.id],
  }),
  submission: one(submissions, {
    fields: [responses.submissionId],
    references: [submissions.id],
  }),
  question: one(questions, {
    fields: [responses.questionId],
    references: [questions.id],
  }),
  option: one(options, {
    fields: [responses.optionId],
    references: [options.id],
  }),
}));
