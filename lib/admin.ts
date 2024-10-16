import { auth } from '@clerk/nextjs/server'

const adminIds = [
  'user_2kvWkCv4WKGKn6MKKXapK76fTrj',
  'user_2l3BuLDRDbwFF7mNEnrBwFijHAC',
]

export const getIsAdmin = async () => {
  const { userId } = await auth()

  if (!userId) {
    return false
  }

  return adminIds.indexOf(userId) !== -1
}
