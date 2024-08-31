import { cache } from 'react'
import db from './drizzle'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { courses, userProgress } from './schema'

// Drizzle query to get from the courses table in Neon
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany()
  return data
})

// Drizzle query to to get from the userProgress table in Neon
export const getUserProgress = cache(async () => {
  // auth from Clerk, detructures the userId if someone is logged iin with Clerk
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  // query to find the userId in the userProgress table that matches the userId from Clerk auth (userId in 2 different places but should same id
  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    with: {
      activeCourse: true,
    },
  })
  return data
})

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    // courses table id field (column) and a number we pass in as an attribute when calling
    where: eq(courses.id, courseId),
  })
  return data
})
