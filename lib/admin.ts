import { auth } from '@clerk/nextjs/server'

const adminIds = [
  'user_2kvWkCv4WKGKn6MKKXapK76fTrj',
  'user_2l3BuLDRDbwFF7mNEnrBwFijHAC',
]

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  return adminIds.indexOf(userId) !== -1
}
