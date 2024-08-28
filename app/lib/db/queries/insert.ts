import { db } from "@/app/lib/db/db"
import { 
    // InsertCompetition,
    InsertCourse,
    // InsertPlayer,
    // InsertUmpire,
    // InsertChallenge,
    // competition,
    course
    // player,
    // umpire,
    // challenge
} from "@/app/lib/db/schema"

export async function createCourse(data: Omit<InsertCourse, "id">) {
    const result =await db.insert(course).values(data)
    return result
}
