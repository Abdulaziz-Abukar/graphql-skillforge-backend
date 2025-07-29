const { GraphQLDateTime } = require("graphql-scalars");
const userResolvers = require("./userResolvers");
const skillResolvers = require("./skillResolvers");
const moduleResolver = require("./moduleResolvers");

const resolvers = {
  Date: GraphQLDateTime,
  Query: {
    ...userResolvers.Query,
    ...skillResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...skillResolvers.Mutation,
    ...moduleResolver.Mutation,
  },
};

module.exports = resolvers;
