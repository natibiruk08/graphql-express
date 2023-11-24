import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { graphqlHTTP } from "express-graphql";

import { dbQuery } from "../database";

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
      type: GraphQLString,
    },
    updated_at: {
      type: GraphQLString,
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      async resolve(parent, args) {
        return await dbQuery("SELECT * FROM public.user");
      },
    },
    getUser: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      async resolve(parent, { id }) {
        const user = await dbQuery(
          "SELECT * FROM public.user WHERE id=$1 LIMIT 1",
          [id]
        );
        return user[0];
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
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, { username, email, password }) {
        const query = `
          INSERT INTO public.user (username, email, password)
          VALUES ($1, $2, $3)
          RETURNING *
        `;
        const values = [username, email, password];

        const result = await dbQuery(query, values);
        console.log(result);
        return result[0];
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
