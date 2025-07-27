const { GraphQLDateTime } = require("graphql-scalars");
const userResolvers = require("./userResolvers");

const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    ...userResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
  },
};

module.exports = resolvers;
