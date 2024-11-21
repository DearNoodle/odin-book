const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createLocalUser(req) {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await prisma.user.create({
    data: {
      username: req.body.username,
      password: hashedPassword,
      avatarUrl:
        'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
      bio: "This Person hasn't written no Bio yet",
    },
  });
}

async function createGHUser(profile) {
  return await prisma.user.create({
    data: {
      username: profile.username || profile.displayName,
      githubId: profile.id,
      avatarUrl:
        'https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg', // Directly on user
      bio: "This Person hasn't written no Bio yet",
    },
  });
}

// async function getUsername(req) {
//   return await prisma.user.findUnique({
//     where: { id: req.params.id },
//     select: {
//       username: true,
//     },
//   });
// }

// async function getChatMessages(req) {
//   return await prisma.message.findMany({
//     where: {
//       OR: [
//         {
//           fromUserId: req.user.id,
//           toUserId: req.query.chatterId,
//         },
//         {
//           fromUserId: req.query.chatterId,
//           toUserId: req.user.id,
//         },
//       ],
//     },
//     select: {
//       fromUserId: true,
//       content: true,
//       fromUser: {
//         select: {
//           username: true,
//         },
//       },
//     },
//   });
// }

// async function createMessage(req) {
//   await prisma.message.create({
//     data: {
//       fromUserId: req.user.id,
//       toUserId: req.body.chatterId,
//       content: req.body.message,
//     },
//   });
// }

// async function getFollowedUsers(req) {
//   const user = await prisma.user.findUnique({
//     where: { id: req.user.id },
//     select: {
//       follows: true,
//     },
//   });
//   return user.follows;
// }

// async function getSearchUsers(req) {
//   return await prisma.user.findMany({
//     where: {
//       username: {
//         contains: req.query.searchKeyword,
//         mode: 'insensitive',
//       },
//     },
//   });
// }

async function getRecentPosts() {
  return prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
          comments: true,
        },
      },
    },
  });
}

async function getSearchPosts(req) {
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          author: {
            username: {
              contains: req.query.searchKeyword,
              mode: 'insensitive',
            },
          },
        },
        {
          title: {
            contains: req.query.searchKeyword,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: req.query.searchKeyword,
            mode: 'insensitive',
          },
        },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      author: {
        select: {
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: { likedBy: true },
      },
    },
  });
  return posts || [];
}

async function getUserProfile(req) {
  return await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      username: true,
      avatarUrl: true,
      bio: true,
    },
  });
}

async function updateProfileImage(req) {
  return await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      avatarUrl: req.file.path,
    },
  });
}

async function updateProfileBio(req) {
  return await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      bio: req.body.bio,
    },
  });
}

async function getUserInfo(req) {
  return await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      username: true,
      avatarUrl: true,
      bio: true,
      _count: {
        select: {
          followedBy: true,
          posts: true,
        },
      },
    },
  });
}

async function getUserPosts(req) {
  return prisma.post.findMany({
    where: { authorId: req.params.id },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
          comments: true,
        },
      },
    },
  });
}

async function getFollowStatus(req) {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
      follows: {
        some: { id: req.params.id },
      },
    },
  });
  return !!user;
}

async function updateFollow(req) {
  const isFollowing = await getFollowStatus(req);
  if (isFollowing) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        follows: {
          disconnect: { id: req.params.id },
        },
      },
    });
  } else {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        follows: {
          connect: { id: req.params.id },
        },
      },
    });
  }
}

module.exports = {
  createLocalUser,
  createGHUser,
  getRecentPosts,
  getSearchPosts,
  getUserProfile,
  updateProfileImage,
  updateProfileBio,
  getUserInfo,
  getUserPosts,
  getFollowStatus,
  updateFollow,
  // getUsername,
  // getChatMessages,
  // createMessage,
  // getFollowedUsers,
  // getSearchUsers,
};
