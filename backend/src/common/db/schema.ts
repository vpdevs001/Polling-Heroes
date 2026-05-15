import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ======================
// ENUMS
// ======================

export const participantTypeEnum = pgEnum("participant_type", [
  "Authenticated",
  "Anonymous",
]);

export const pollStatusEnum = pgEnum("poll_status", ["Active", "Ended"]);

// ======================
// USERS
// ======================

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  firstName: varchar("first_name", { length: 255 }).notNull(),

  lastName: varchar("last_name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  password: varchar("password", { length: 255 }),
  
  isVerified: boolean("is_verified").default(false).notNull(),
  
  verificationToken: varchar("verification_token", { length: 255 }),
  
  verificationTokenExpiresAt: timestamp("verification_token_expires_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// POLLS
// ======================

export const polls = pgTable(
  "polls",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    hostId: uuid("host_id")
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .notNull(),

    title: varchar("title", { length: 255 }).notNull(),

    description: text("description"),

    url: varchar("url", { length: 255 }).notNull(),

    participantType: participantTypeEnum("participant_type").notNull(),

    status: pollStatusEnum("status").default("Active").notNull(),

    isPublished: boolean("is_published").default(false).notNull(),

    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at").defaultNow().notNull(),

    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    urlIdx: uniqueIndex("polls_url_idx").on(table.url),
  }),
);

// ======================
// QUESTIONS
// ======================

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),

  pollId: uuid("poll_id")
    .references(() => polls.id, {
      onDelete: "cascade",
    })
    .notNull(),

  text: text("text").notNull(),

  isRequired: boolean("is_required").default(true).notNull(),

  order: integer("order").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// OPTIONS
// ======================

export const options = pgTable("options", {
  id: uuid("id").defaultRandom().primaryKey(),

  questionId: uuid("question_id")
    .references(() => questions.id, {
      onDelete: "cascade",
    })
    .notNull(),

  text: text("text").notNull(),

  order: integer("order").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ======================
// SUBMISSIONS
// ======================

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pollId: uuid("poll_id")
      .references(() => polls.id, {
        onDelete: "cascade",
      })
      .notNull(),

    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    sessionToken: varchar("session_token", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pollUserUnique: uniqueIndex("submissions_poll_user_uidx")
      .on(table.pollId, table.userId)
      .where(sql`${table.userId} is not null`),
    pollSessionUnique: uniqueIndex("submissions_poll_session_uidx")
      .on(table.pollId, table.sessionToken)
      .where(sql`${table.sessionToken} is not null`),
  }),
);

// ======================
// RESPONSES
// ======================

export const responses = pgTable(
  "responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pollId: uuid("poll_id")
      .references(() => polls.id, {
        onDelete: "cascade",
      })
      .notNull(),

    submissionId: uuid("submission_id")
      .references(() => submissions.id, {
        onDelete: "cascade",
      })
      .notNull(),

    questionId: uuid("question_id")
      .references(() => questions.id, {
        onDelete: "cascade",
      })
      .notNull(),

    optionId: uuid("option_id")
      .references(() => options.id, {
        onDelete: "cascade",
      })
      .notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    submissionQuestionUnique: uniqueIndex("responses_submission_question_uidx").on(
      table.submissionId,
      table.questionId,
    ),
  }),
);
