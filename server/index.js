import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { id: "1", name: "Jhon Doe", age: 32, isMarried: true },
  { id: "2", name: "Jane De", age: 35, isMarried: false },
  { id: "3", name: "alice joe", age: 42, isMarried: true },
  { id: "4", name: "alice joe", age: 22, isMarried: false },
];

const typeDefs = /* GraphQL */ `
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }
  type Mutation {
    createUser(name: String!, age: Int!, isMarried: Boolean!): User
  }
  type User {
    id: ID!
    name: String
    age: Int
    isMarried: Boolean
  }
`;

const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (_, args) => users.find((u) => u.id === args.id),
  },
  Mutation: {
    createUser: (_, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: (users.length + 1).toString(),
        name,
        age,
        isMarried,
      };
      users.push(newUser);
      return newUser; // <-- Must return the created user
    },
  },
};

// Create Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

// Correct usage of startStandaloneServer
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server Running at: ${url}`);
