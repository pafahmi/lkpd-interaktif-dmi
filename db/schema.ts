import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nis: text("nis").notNull(),
  studentName: text("student_name").notNull().default(""),
  className: text("class_name").notNull().default("12 DKV 1"),
  phoneMasked: text("phone_masked"),
  phoneConsentAt: text("phone_consent_at"),
  createdAt: text("created_at").notNull(),
}, (t) => [uniqueIndex("idx_students_nis").on(t.nis), index("idx_students_class_name").on(t.className,t.studentName)]);

export const sessions = sqliteTable("sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull(),
  loginAt: text("login_at").notNull(),
  logoutAt: text("logout_at"),
  lastActiveAt: text("last_active_at").notNull(),
  currentPage: text("current_page").notNull().default("Beranda"),
  progress: integer("progress").notNull().default(0),
}, (t) => [uniqueIndex("idx_sessions_token").on(t.tokenHash), index("idx_sessions_student_active").on(t.studentId, t.lastActiveAt)]);

export const activities = sqliteTable("activities", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  sessionId: integer("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  page: text("page").notNull(),
  detail: text("detail"),
  createdAt: text("created_at").notNull(),
}, (t) => [index("idx_activities_student_time").on(t.studentId, t.createdAt)]);

export const quizAnswers = sqliteTable("quiz_answers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  question: integer("question").notNull(),
  answer: integer("answer").notNull(),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  answeredAt: text("answered_at").notNull(),
}, (t) => [index("idx_quiz_student_time").on(t.studentId, t.answeredAt)]);

export const worksheetResponses = sqliteTable("worksheet_responses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  studentId: integer("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  answers: text("answers").notNull().default("{}"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
  submittedAt: text("submitted_at"),
}, (t) => [uniqueIndex("idx_worksheet_student").on(t.studentId)]);
