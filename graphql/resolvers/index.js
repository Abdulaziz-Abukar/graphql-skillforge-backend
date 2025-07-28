const { GraphQLDateTime } = require("graphql-scalars");
const userResolvers = require("./userResolvers");
const skillResolvers = require("./skillResolvers");

const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    ...userResolvers.Query,
    ...skillResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...skillResolvers.Mutation,
  },
};

module.exports = resolvers;
