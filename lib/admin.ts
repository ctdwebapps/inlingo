// import { auth } from '@clerk/nextjs/server'

// const adminIds = ['user_2l3BuLDRDbwFF7mNEnrBwFijHAC']

// export const getIsAdmin = async () => {
//   const { userId } = await auth()

//   if (!userId) {
//     return false
//   }

//   return adminIds.indexOf(userId) !== -1
// }

import { auth } from '@clerk/nextjs/server'

export const getIsAdmin = async () => {
  const { userId } = await auth()

  return userId === 'user_2l3BuLDRDbwFF7mNEnrBwFijHAC'
}
