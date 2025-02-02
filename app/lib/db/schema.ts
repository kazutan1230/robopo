import { boolean, integer, pgTable, serial, text, timestamp, primaryKey } from "drizzle-orm/pg-core"

export const competition = pgTable("competition", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isOpen: boolean("isopen").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const course = pgTable("course", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  field: text("field"),
  fieldValid: boolean("fieldvalid").default(false).notNull(),
  mission: text("mission"),
  missionValid: boolean("missionvalid").default(false).notNull(),
  point: text("point"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const player = pgTable("player", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  furigana: text("furigana"),
  zekken: text("zekken"),
  qr: text("qr"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const umpire = pgTable("umpire", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const challenge = pgTable("challenge", {
  id: serial("id").primaryKey(),
  result1: integer("result1").notNull(),
  result2: integer("result2"),
  competitionId: integer("competition_id")
    .notNull()
    .references(() => competition.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => course.id, { onDelete: "cascade" }),
  playerId: integer("player_id")
    .notNull()
    .references(() => player.id, { onDelete: "cascade" }),
  umpireId: integer("umpire_id")
    .notNull()
    .references(() => umpire.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
})

export const umpireCourse = pgTable(
  "umpire_course",
  {
    competitionId: integer("competition_id")
      .notNull()
      .references(() => competition.id, { onDelete: "cascade" }),
    umpireId: integer("umpire_id")
      .notNull()
      .references(() => umpire.id, { onDelete: "cascade" }),
    courseId: integer("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.competitionId, table.umpireId] }),
      pkWithCustomName: primaryKey({ name: "pk_umpire_course", columns: [table.competitionId, table.umpireId] }),
    }
  }
)

export type InsertCompetition = typeof competition.$inferInsert
export type SelectCompetition = typeof competition.$inferSelect

export type InsertCourse = typeof course.$inferInsert
export type SelectCourse = typeof course.$inferSelect

export type InsertPlayer = typeof player.$inferInsert
export type SelectPlayer = typeof player.$inferSelect

export type InsertUmpire = typeof umpire.$inferInsert
export type SelectUmpire = typeof umpire.$inferSelect

export type InsertChallenge = typeof challenge.$inferInsert
export type SelectChallenge = typeof challenge.$inferSelect

export type InsertUmpireCourse = typeof umpireCourse.$inferInsert
export type SelectUmpireCourse = typeof umpireCourse.$inferSelect

export type SelectAssignList = { id: number; competition: string | null; course: string | null; umpire: string | null }
