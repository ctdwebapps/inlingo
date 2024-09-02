import { cache } from 'react'
import db from './drizzle'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import {
  challengeProgress,
  courses,
  lessons,
  units,
  userProgress,
} from './schema'

// Drizzle query to get from the courses table in Neon
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany()
  return data
})

// Drizzle query to to get from the userProgress table in Neon
export const getUserProgress = cache(async () => {
  // auth from Clerk, destructures the userId if someone is logged iin with Clerk
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

// get the units, and also all challenges etc within them
export const getUnits = cache(async () => {
  const { userId } = await auth()
  // first check if that user has any progress saved, and if not return an empty array
  const userProgress = await getUserProgress()

  if (!userId || !userProgress?.activeCourseId) {
    return []
  }
  // get the units if there is user progress, including all their lessons and challenges (Course => unit => lesson => challenge)
  const data = await db.query.units.findMany({
    // find the units which match the currently selected course
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  })
  // the below is changing the data so that we can mark lessons as completed or not
  const normailzedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        return (
          challenge.challengeProgress &&
          challenge.challengeProgress.length > 0 &&
          challenge.challengeProgress.every((progress) => progress.completed)
        )
      })
      // return all the lessons in the unit spread, and true or false whether completed already
      return { ...lesson, completed: allCompletedChallenges }
    })
    return { ...unit, lessons: lessonsWithCompletedStatus }
  })
  return normailzedData
})

export const getCourseById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    // courses table id field (column) and a number we pass in as an attribute when calling
    where: eq(courses.id, courseId),
  })
  return data
})
