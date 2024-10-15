import { relations } from 'drizzle-orm'

import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

// schema for the languages
export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull(),
})

// temporary understanding -  Many to many relation (courses and users). Adds a userProgress foreign key to the courses table
export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  // courses can have many units
  units: many(units),
}))

// schema for units
export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), // Unit 1
  description: text('description').notNull(), // Learn the basics of spanish
  courseId: integer('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  order: integer('order').notNull(),
})

// relations, the courseId in the units table will be the foreign key related to the primary key on the courses table
export const unitsRelations = relations(units, ({ many, one }) => ({
  // a unit can have only one course relation
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  // each unit can have many lessons
  lessons: many(lessons),
}))

// schema for lessons table
export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  // foreign key related to the id primary key on teh units table
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull(),
})

// schema for lesson relations
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  // a lesson can belong to only 1 unit
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}))

// create challenge type, using enums, 2 possible challenge types
export const challengesEnum = pgEnum('type', ['SELECT', 'ASSIST'])

// schema for challenges
export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  // foreign key referencing the id in the lesson table
  lessonId: integer('lesson_id')
    .references(() => lessons.id, { onDelete: 'cascade' })
    .notNull(),
  // type of question, using the enum set up above
  type: challengesEnum('type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull(),
})

// challenges relations
export const challengesRelations = relations(challenges, ({ one, many }) => ({
  // a lesson can belong to only 1 unit
  lesson: one(lessons, {
    // the lessonId foreign key in the challenges table references the id field in the lessons table
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}))

// schema for challengeOptions (answers to choose)
export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  correct: boolean('correct').notNull(),
  // next are not required as not all challenge types have an image and audio
  imageSrc: text('image_src'),
  audioSrc: text('audio_src'),
})

// challengeOptions relations
export const challengeOptionRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      // the lessonId foreign key in the challenges table references the id field in the lessons table
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
)

// schema for challengeProgress
export const challengeProgress = pgTable('challenge_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, { onDelete: 'cascade' })
    .notNull(),
  completed: boolean('completed').notNull().default(false),
})

// schema for challengeProgress relations
export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
)

// schema for individual users
export const userProgress = pgTable('user_progress', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImgSrc: text('user_image_src').notNull().default('/logo.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, {
    onDelete: 'cascade',
  }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0),
})

// temporary understanding - one to one relation for active course and the name of the course. Adds an activeCourse foreign key to the userProgress table and pulls the course name from the courses table
export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}))

// for Stripe and payment
export const userSubscription = pgTable('user_subscription', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  stripeCustomerId: text('stripe_customer_id').notNull().unique(),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeCurrentPeriodEnd: timestamp('stripe_current_period_end').notNull(),
})
