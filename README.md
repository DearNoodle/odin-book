# Odin Book

## Website Link

- [**Fakebook Website**](https://dearnoodle-odin-book.netlify.app/)

## Key Features

- **Github OAuth Login Feature**

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - Prisma (ORM)
  - PostgreSQL (Database)
  - JWT (Authentication)
  - Railway (Deployment)
- **Frontend:**
  - React (Frameworks)
  - Netlify (Deployment)

## Debugging Notes

### **Github OAuth Login Setups**

#### **Code Setting**

- Passportjs configs

```js
const GitHubStrategy = require("passport-github2").Strategy;

const githubStrategyOptions = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${apiUrl}/login/github/callback`,
};

const verifyGithub = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await prisma.user.findUnique({
      where: { githubId: profile.id },
    });

    if (!user) {
      user = await query.createGHUser(profile);
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new GitHubStrategy(githubStrategyOptions, verifyGithub));
```

- Routes functions

```js
router.get("/login/github", githubAuth);
router.get("/login/github/callback", githubCBAuth, controller.loginGHUser);
```

- Auth middlewares

```js
function githubAuth(req, res, next) {
  passport.authenticate("github", { scope: ["user:email"], session: false })(
    req,
    res,
    next
  );
}

function githubCBAuth(req, res, next) {
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  })(req, res, next);
}
```

**Github Setups**

1. Navigate to [GitHub Developer Settings](https://github.com/settings/developers).

2. Create a New OAuth App.

3. Enter Homepage and Authorization callback URL

4. Retrieve Client ID and Secrets for `.env` file.
