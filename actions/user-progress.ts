// this is an server action for the user-progress entity. It behaves like an API call
// must write use server for it to work

'use server'

import db from '@/db/drizzle'
import { getCourseById, getUserProgress } from '@/db/queries'
import { userProgress } from '@/db/schema'
import { auth, currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }
  // get the course which the user just selected (passing in a number for teh courseId)
  const course = await getCourseById(courseId)

  // if the course doesn't exist
  if (!course) {
    throw new Error('Course not found')
  }

  // if there are no units or lessons in a course
  // if (!course.units.length || !course.units[0].lessons.length) {
  //   throw new Error('Course is empty')
  // }

  const existingUserProgress = await getUserProgress()

  // if the user has already started this course, use the drizzle call to update the userProgress schema to make it's activeCourseId the one (number) we have just selected
  if (existingUserProgress) {
    await db.update(userProgress).set({
      activeCourseId: courseId,
      // just quick check when user changes a course that they haven't changed their name in pic in Clerk since the last time
      userName: user.firstName || 'User',
      userImgSrc: user.imageUrl || '/mascot.svg',
    })
    // we've added a new record to the database, so update our cache too
    revalidatePath('/courses')
    revalidatePath('/courses')

    redirect('/learn')
  }
  await db.insert(userProgress).values({
    userId,
    activeCourseId: courseId,
    userName: user.firstName || 'User',
    userImgSrc: user.imageUrl || '/mascot.svg',
  })

  // we've added a new record to the database, so update our cache too
  revalidatePath('/courses')
  revalidatePath('/courses')

  redirect('/learn')
}
