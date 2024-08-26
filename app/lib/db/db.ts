import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"


console.log(process.env.DATABASE_URL)
if (process.env.DATABASE_URL === undefined) {
    throw new Error("DATABASE_URL is not defined")
}
const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql)