import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import * as schema from '../db/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Seeding database')

    await db.delete(schema.courses)
    await db.delete(schema.userProgress)
    await db.delete(schema.units)
    await db.delete(schema.lessons)
    await db.delete(schema.challenges)
    await db.delete(schema.challengeOptions)
    await db.delete(schema.challengeProgress)

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Spanish',
        imageSrc: '/es.svg',
      },
      {
        id: 2,
        title: 'Italian',
        imageSrc: '/it.svg',
      },
      {
        id: 3,
        title: 'French',
        imageSrc: '/fr.svg',
      },
      {
        id: 4,
        title: 'Croatian',
        imageSrc: '/hr.svg',
      },
    ])

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: 'Unit 1',
        description: 'Learn the basics of Spanish',
        order: 1,
      },
    ])

    await db.insert(schema.lessons).values([
      {
        id: 1, //lesson 1
        unitId: 1, //unit 1
        order: 1, //first lesson
        title: 'Nouns', //lesson name
      },
      {
        id: 2, //lesson 2
        unitId: 1, //unit 1
        order: 2, //2nd lesson
        title: 'Verbs', //lesson name
      },
      {
        id: 3, //lesson 3
        unitId: 1, //unit 1
        order: 3, //3rd lesson
        title: 'Family', //lesson name
      },
      {
        id: 4, //lesson 4
        unitId: 1, //unit 1
        order: 4, //4th lesson
        title: 'Food', //lesson name
      },
      {
        id: 5, //lesson 5
        unitId: 1, //unit 1
        order: 5, //4th lesson
        title: 'Travel', //lesson name
      },
    ])

    // questions (challenges)
    await db.insert(schema.challenges).values([
      {
        id: 1, //challenge id
        lessonId: 1, //eg. the Nouns lesson
        type: 'SELECT', //our enum type of challenge
        order: 1, //first challenge
        question: 'Which one of these is "the man"?', //the actual question
      },
      {
        id: 2,
        lessonId: 1,
        type: 'ASSIST',
        order: 2,
        question: '"the man"',
      },
      {
        id: 3,
        lessonId: 1,
        type: 'SELECT',
        order: 3,
        question: 'Which one of these is "the robot"?',
      },
    ])

    // answer (challenge) options
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1, //answers for the first challenge
        imageSrc: '/man.svg',
        correct: true,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
      },
      {
        challengeId: 1, //answers for the first challenge
        imageSrc: '/woman.svg',
        correct: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
      },
      {
        challengeId: 1, //answers for the first challenge
        imageSrc: '/robot.svg',
        correct: false,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
      },
    ])

    // this challenge is an assist so no image, etc
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 2,
        correct: true,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
      },
      {
        challengeId: 2,
        correct: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
      },
      {
        challengeId: 2,
        correct: false,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
      },
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 3,
        imageSrc: '/man.svg',
        correct: false,
        text: 'el hombre',
        audioSrc: '/es_man.mp3',
      },
      {
        challengeId: 3,
        imageSrc: '/woman.svg',
        correct: false,
        text: 'la mujer',
        audioSrc: '/es_woman.mp3',
      },
      {
        challengeId: 3,
        imageSrc: '/robot.svg',
        correct: true,
        text: 'el robot',
        audioSrc: '/es_robot.mp3',
      },
    ])

    await db.insert(schema.challenges).values([
      {
        id: 4, //challenge id
        lessonId: 2, //Verbs lesson
        type: 'SELECT', //our enum type of challenge
        order: 1, //first challenge
        question: 'Which one of these is "the man"?', //the actual question
      },
      {
        id: 5,
        lessonId: 2,
        type: 'ASSIST',
        order: 2,
        question: '"the man"',
      },
      {
        id: 6,
        lessonId: 2,
        type: 'SELECT',
        order: 3,
        question: 'Which one of these is "the robot"?',
      },
    ])

    console.log('Seeding finished')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed the database')
  }
}

// call the function
main()
