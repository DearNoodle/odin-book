const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    for (let i = 0; i < 10; i++) {
      const username = faker.internet.username();
      const password = await bcrypt.hash(faker.internet.password(), 10);
      const registeredAt = faker.date.past();
      const user = await prisma.user.create({
        data: {
          username,
          password,
          registeredAt,
          avatarUrl:
            'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
          bio: "This Person hasn't written Bio yet",
        },
      });

      for (let j = 0; j < 2; j++) {
        const createdAt = faker.date.past();
        await prisma.post.create({
          data: {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            authorId: user.id,
            createdAt,
          },
        });
      }
    }

    console.log('Successfully seeded database with 10 users and 2 posts each.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
