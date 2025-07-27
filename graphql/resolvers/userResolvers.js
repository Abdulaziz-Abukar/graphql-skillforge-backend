const { GraphQLError } = require("graphql");
const User = require("../../models/User");
const Skill = require("../../models/Skill");
const { signToken } = require("../../utils/auth");
const bcrypt = require("bcrypt");

const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new GraphQLError("Not authenticated");
      return await User.findById(user.id).populate("skills");
    },
  },

  Mutation: {
    signup: async (_, { input }) => {
      const existing = await User.findOne({ email: input.email });
      if (existing) throw new GraphQLError("Email already in use");

      const newUser = await User.create(input);
      const token = signToken(newUser);

      return { token, user: newUser };
    },

    login: async (_, { input }) => {
      const user = await User.findOne({ email: input.email });
      if (!user) throw new GraphQLError("Invalid email or password");

      const isValid = await bcrypt.compare(input.password, user.password);
      if (!isValid) throw new GraphQLError("Invalid email or password");

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = userResolvers;
