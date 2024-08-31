'use client'
// this one is use client as we' have some interactive onClick etc elements

import { courses, userProgress } from '@/db/schema'
import { Card } from './Card'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { upsertUserProgress } from '@/actions/user-progress'
import { toast } from 'sonner'

type Props = {
  courses: (typeof courses.$inferSelect)[]
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId
}

export const List = ({ courses, activeCourseId }: Props) => {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const onClick = (id: number) => {
    // if still pending, do nothing yet
    if (pending) return

    // if already have a course id, no need to fetch from server, just go ahead
    if (id === activeCourseId) {
      return router.push('/learn')
    }

    // if the user is selecting a new course, do something (call a server action)
    startTransition(() => {
      // call the server action
      upsertUserProgress(id).catch(() => toast.error('Something went wrong!'))
    })
  }

  return (
    <div className='pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4'>
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  )
}
