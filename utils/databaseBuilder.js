const mongoose = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { verifyToken } = require("./auth");
const User = require("../models/User");
const typeDefs = require("../graphql/typeDefs");
const resolvers = require("../graphql/resolvers/index");

const PORT = process.env.PORT || 4000;
const DBEntry = process.env.MONGODB_URI;

function startServer() {
  mongoose
    .connect(DBEntry)
    .then(() => {
      console.log("MongoDB Connection successful");

      // create server
      const server = new ApolloServer({ typeDefs, resolvers });

      startStandaloneServer(server, {
        listen: { port: Number(PORT) },
        context: async ({ req }) => {
          const auth = req.headers.authorization || "";
          const token = auth.split(" ")[1]; // Bearer <token>

          if (!token) return { user: null };

          try {
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id);
            return { user };
          } catch {
            return { user: null };
          }
        },
      }).then(({ url }) => {
        console.log(`Server ready at ${url}`);
      });
    })
    .catch((err) => {
      console.log("MongoDB Connection failed: ", err);
    });
}

module.exports = startServer;
