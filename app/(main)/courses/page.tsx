import { getCourses, getUserProgress } from '@/db/queries'
import { List } from './List'

const CoursesPage = async () => {
  // fetches all the courses (and below passes to the List component to display them)
  const coursesData = getCourses()
  // and same for userProgress
  const userProgressData = getUserProgress()

  // console.log(courses)
  // console.log(userProgress)

  const [courses, userProgress] = await Promise.all([
    coursesData,
    userProgressData,
  ])

  return (
    <div className='h-full max-w-[912px] px-3 mx-auto'>
      <h1 className='text-2xl font-bold text-neutral-700'>Language Courses</h1>
      {/* activeCourseId is a field in the userProgress table */}
      <List courses={courses} activeCourseId={userProgress?.activeCourseId} />
    </div>
  )
}

export default CoursesPage
