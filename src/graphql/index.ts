import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import userData from "../constants/userData.json";
import { graphqlHTTP } from "express-graphql";
import { useTypeORM } from "../database";
import { User } from "../database/models/User";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: {
      type: GraphQLInt,
    },
    username: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    password: {
      type: GraphQLString,
    },
    created_at: {
      type: GraphQLInt,
    },
    updated_at: {
      type: GraphQLInt,
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        return await useTypeORM(User).find();
      },
    },
    getUser: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parent, { id }) {
        return await useTypeORM(User).find({ where: { id } });
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, args) {
        userData.push({
          id: userData.length + 1,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          password: args.password,
        });

        return args;
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export const graphQLMiddleware = graphqlHTTP({
  schema,
  graphiql: true,
});
