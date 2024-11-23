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
      bio: "This Person hasn't written Bio yet",
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
      bio: "This Person hasn't written Bio yet",
    },
  });
}

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

async function createPost(req) {
  const postImageUrl = req.file ? req.file.path : null;
  await prisma.post.create({
    data: {
      title: req.body.title,
      postImageUrl,
      content: req.body.content,
      authorId: req.user.id,
    },
  });
}

async function getPostInfo(req) {
  return await prisma.post.findUnique({
    where: { id: req.params.id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
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

async function getLikeStatus(req) {
  const like = await prisma.like.findUnique({
    where: {
      likeId: {
        userId: req.user.id,
        postId: req.params.id,
      },
    },
  });
  return !!like;
}

async function updateLike(req) {
  const isLiking = await getLikeStatus(req);
  if (isLiking) {
    await prisma.like.delete({
      where: {
        likeId: {
          userId: req.user.id,
          postId: req.params.id,
        },
      },
    });
  } else {
    await prisma.like.create({
      data: {
        userId: req.user.id,
        postId: req.params.id,
      },
    });
  }
}

async function createComment(req) {
  await prisma.comment.create({
    data: {
      content: req.body.content,
      userId: req.user.id,
      postId: req.params.id,
    },
  });
}

async function deleteComment(req) {
  await prisma.comment.delete({
    where: { id: req.params.id },
  });
}

async function deletePost(req) {
  await prisma.post.delete({
    where: { id: req.params.id },
  });
}

async function getFollowedUsers(req) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      follows: true,
    },
  });
  return user.follows;
}

async function getSearchUsers(req) {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: req.query.searchKeyword,
        mode: 'insensitive',
      },
    },
  });
}

async function getRecentChattedUser(req) {
  const recentUsers = await prisma.$queryRaw`
    SELECT DISTINCT u.id, u.username, MAX(m.time) as last_message_time
    FROM "users" u
    JOIN 
      (
      SELECT *
      FROM "messages"
      WHERE "fromUserId" = ${req.user.id} OR "toUserId" = ${req.user.id}
      ) 
    AS m ON u.id = m."fromUserId" OR u.id = m."toUserId"
    WHERE u.id != ${req.user.id}
    GROUP BY u.id, u.username
    ORDER BY last_message_time DESC
    LIMIT 10;
  `;
  return recentUsers;
}

async function getUsername(req) {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      username: true,
    },
  });
  return user.username;
}

async function getChatMessages(req) {
  return await prisma.message.findMany({
    where: {
      OR: [
        {
          fromUserId: req.user.id,
          toUserId: req.params.id,
        },
        {
          fromUserId: req.params.id,
          toUserId: req.user.id,
        },
      ],
    },
    select: {
      id: true,
      fromUserId: true,
      content: true,
      fromUser: {
        select: {
          username: true,
        },
      },
    },
  });
}

async function createMessage(req) {
  await prisma.message.create({
    data: {
      fromUserId: req.user.id,
      toUserId: req.params.id,
      content: req.body.content,
    },
  });
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
  createPost,
  getPostInfo,
  getLikeStatus,
  updateLike,
  createComment,
  deleteComment,
  deletePost,
  getFollowedUsers,
  getSearchUsers,
  getRecentChattedUser,
  getUsername,
  getChatMessages,
  createMessage,
};
