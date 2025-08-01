# SkillForge GraphQL API

SkillForge is a fully authenticated, modular GraphQL backend built with Apollo Server and MongoDB. It allows users to track their learning progress by creating skills and managing associated modules.

## Tech Stack

- Node.js
- Apollo Server (`@apollo/server`)
- GraphQL
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for authentication
- Modular folder structure with clean resolvers

---

## Features

- User signup/login with JWT authentication
- Secure `me` query to fetch logged-in user
- Create/update/delete **Skills**
- Add/update/delete/complete **Modules** for each skill
- Auth & ownership checks for every query/mutation
- Full relationship modeling using Mongoose
- Populated references for nested queries (e.g. `Skill.owner`, `Skill.modules`)

---

## Example Queries

### Signup / Login

```graphql
mutation {
  signup(
    input: {
      name: "John Doe"
      email: "johndoe@email.com"
      password: "password123"
    }
  ) {
    token
    user {
      id
      name
    }
  }
}
```

```graphql
query {
  me {
    name
    email
    skills {
      title
    }
  }
}
```

## Project Structure

```pgsql
graphql-skillforge-api/
├── graphql/
│   ├── typeDefs.js
│   └── resolvers/
│       ├── index.js
│       ├── userResolvers.js
│       ├── skillResolvers.js
│       └── moduleResolvers.js
├── models/
│   ├── User.js
│   ├── Skill.js
│   └── Module.js
├── utils/
│   ├── auth.js
│   └── databaseBuilder.js
├── index.js
├── .env.example
└── README.md

```

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/graphql-skillforge-api.git
cd graphql-skillforge-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup `.env` file

Create a `.env` file based on `.env.example`:

```ini
PORT=4000
MONGODB_URI=mongodb://localhost:27017/skillforge
JWT_SECRET=your_secret_key
```

### 4. Start the server

```bash
node index.js
```

GraphQL will be available at:
`http://localhost:4000/`

## Why I Built This

This project was built to master GraphQL backend development including custom resolvers, secure authentication, and modular schema design using MongoDB and Apollo Server v4.

## Future Improvements

- Add pagination & filtering to `mySkills` and `modules`
- Add `isComplete` computed field to Skills
- Add testing with Jest + graphql-request

## Author

**Abdulaziz** - Software Engineer
