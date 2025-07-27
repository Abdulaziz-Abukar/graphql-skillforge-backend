const typeDefs = `#graphql

    scalar Date

    type User {
        id: ID!
        name: String!
        email: String!
        skills: [Skill]!
    }

    type Skill {
        id: ID!
        title: String!
        description: String
        difficulty: Difficulty!
        createdAt: Date!
        modules: [Module!]!
        owner: User!
    }

    type Module {
        id: ID!
        title: String!
        completed: Boolean!
        notes: String
        skill: Skill!
    }

    input SignupInput {
        name: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input SkillInput {
        title: String!
        description: String
        difficulty: Difficulty!
    }

    input ModuleInput {
        title: String!
        notes: String
    }

    type AuthPayload {
        token: String!
        user: User!
    }

    enum Difficulty {
        BEGINNER
        INTERMEDIATE
        ADVANCED
    }

    type Query {
        me: User
        skill(id: ID!): Skill
        mySkills: [Skill!]!
        filterSkills(difficulty: Difficulty, search: String): [Skill!]!
    }

    type Mutation {
        signup(input: SignupInput!): AuthPayload
        login(input: LoginInput!): AuthPayload
        createSkill(input: SkillInput!): Skill
        updateSkill(id: ID!, input: SkillInput!): Skill
        deleteSkill(id: ID!): Boolean
        addModule(skillId: ID!, input: ModuleInput!): Module
        updateModule(id: ID!, input: ModuleInput!): Module
        deleteModule(id: ID!): Boolean
        toggleModuleComplete(moduleId: ID!): Module
    }
`;

module.exports = typeDefs;
