import Image from 'next/image'
import Link from 'next/link'

import { quests } from '@/constants'
import { Button } from '@/components/ui/button'
import { Progress } from './ui/progress'

type Props = {
  points: number
}

export const Quests = ({ points }: Props) => {
  return (
    <div className='space-y-4 rounded-xl border-2 p-4'>
      <div className='flex items-center justify-between w-full space-y-2'>
        <h3 className='font-bold text-lg'>Quests</h3>
        <Link href='/quests'>
          <Button size='sm' variant='primaryOutline'>
            View all
          </Button>
        </Link>
      </div>

      <ul className='w-full space-y-4'>
        {quests.map((quest) => {
          const progress = (points / quest.value) * 100

          return (
            <div
              className='flex w-full items-center gap-x-3 pb-4'
              key={quest.title}
            >
              <Image src='/points.svg' alt='Points' width={40} height={40} />

              <div className='flex w-full flex-col gap-y-2'>
                <p className='text-sm font-bold text-neutral-700'>
                  {quest.title}
                </p>

                <Progress value={progress} className='h-2' />
              </div>
            </div>
          )
        })}
      </ul>
    </div>
  )
}
