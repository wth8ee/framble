const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@framble.com' },
    update: {
      role: 'admin',
      balance: 1000000,
    },
    create: {
      email: 'admin@framble.com',
      name: 'Admin',
      role: 'admin',
      balance: 1000000,
    },
  })
  console.log('Admin account created: admin@framble.com')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
