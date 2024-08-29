import { cache } from 'react'
import db from './drizzle'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { userProgress } from './schema'

// Drizzle query to to get from the courses table
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany()
  return data
})

// Drizzle query to to get from the userProgress table
export const getUserProgress = cache(async () => {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  const data = await db.query.userProgress.findFirst({
    // query to find the userProgress table that matches the userId from Clerk auth
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  })
  return data
})
