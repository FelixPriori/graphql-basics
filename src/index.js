import {GraphQLServer} from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Post from './resolvers/Post'

const server = new GraphQLServer({
  typeDefs: `./src/schema.graphql`,
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment,
  },
  context: {
    db,
  },
})

server.start(() => {
  console.log('The server is up on http://localhost:4000/')
})
