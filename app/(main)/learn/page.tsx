import { FeedWrapper } from '@/components/FeedWrapper'
import { StickyWrapper } from '@/components/StickyWrapper'
import { Header } from './Header'
import { UserProgress } from '@/components/UserProgress'
import { getUserProgress } from '@/db/queries'
import { redirect } from 'next/navigation'

const LearnPage = async () => {
  const userProgressData = getUserProgress()

  // promise all will wait for all the promises listed
  const [userProgress] = await Promise.all([userProgressData])

  // redirect to courses page if there's no user
  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={{ title: 'Spanish', imageSrc: '/es.svg' }}
          hearts={5}
          points={100}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title='Spanish' />
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
