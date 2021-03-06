import { User } from '../../src/models/objection'

export default async function dbCleanup(address) {
  const user = await User.findOne({address})
  if (user) {
    await user.$relatedQuery('email').del()
    await user.$query().del()
  }
}
