import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { id: "1", name: "Jhon Doe", age: 32, isMarried: true },
  { id: "2", name: "Jane De", age: 35, isMarried: false },
  { id: "3", name: "alice joe", age: 42, isMarried: true },
  { id: "4", name: "alice joe", age: 22, isMarried: false },
];
const userThings = [];

const typeDefs = /* GraphQL */ `
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }
  type Mutation {
    createUser(name: String!, age: Int!, isMarried: Boolean!): User
    createUserThing(userId: ID!, name: String!, desc: String!): UserThings
    deleteUserThing(thingId: ID!): Boolean
    updateUserThing(thingId: ID!, name: String!, desc: String!): UserThings
    cleanUserThings(userId: ID!): Boolean
  }
  type User {
    id: ID!
    name: String
    age: Int
    isMarried: Boolean
    things: [UserThings!]!
  }
  type UserThings {
    id: ID!
    name: String!
    desc: String!
    user: User!
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
    createUserThing: (_, args) => {
      const { userId, name, desc } = args;
      const newThing = {
        id: (userThings.length + 1).toString(),
        name,
        desc,
        user: users.find((u) => u.id === userId),
      };
      userThings.push(newThing);
      return newThing;
    },
    deleteUserThing: (_, args) => {
      const { thingId } = args;
      const index = userThings.findIndex((thing) => thing.id === thingId);

      userThings.pop(index);
      return true;
    },
    updateUserThing: (_, args) => {
      const { thingId, name, desc } = args;
      const thing = userThings.find((thing) => thing.id === thingId);
      if (thing) {
        thing.name = name;
        thing.desc = desc;
      }
      return thing;
    },
    cleanUserThings: (_, args) => {
      const { userId } = args;
      for (let i = userThings.length - 1; i >= 0; i--) {
        if (userThings[i].user.id === userId) {
          userThings.splice(i, 1);
        }
      }
      return true;
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
