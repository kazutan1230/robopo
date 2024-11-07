import { db } from "@/app/lib/db/db"
import {
  InsertCompetition,
  InsertCourse,
  InsertPlayer,
  InsertUmpire,
  InsertChallenge,
  InsertUmpireCourse,
  competition,
  course,
  player,
  umpire,
  challenge,
  umpireCourse,
} from "@/app/lib/db/schema"

export async function createCompetition(data: Omit<InsertCompetition, "id">) {
  const result = await db.insert(competition).values(data)
  return result
}

export async function createCourse(data: Omit<InsertCourse, "id">) {
  const result = await db.insert(course).values(data)
  return result
}

export async function createPlayer(data: Omit<InsertPlayer, "id">) {
  const result = await db.insert(player).values(data)
  return result
}

export async function createUmpire(data: Omit<InsertUmpire, "id">) {
  const result = await db.insert(umpire).values(data)
  return result
}

export async function createChallenge(data: Omit<InsertChallenge, "id">) {
  const result = await db.insert(challenge).values(data)
  return result
}

export async function insertUmpireCourse(data: Omit<InsertUmpireCourse, "id">) {
  const result = await db.insert(umpireCourse).values(data)
  return result
}
