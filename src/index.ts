import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Resolvers, Book, BookWithComments, Comment } from './__generated__/resolvers-types';

import { readFileSync } from 'fs';
import axios from 'axios'

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// let typeDefs = `#graphql
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;
const typeDefs = readFileSync('./schema.graphqls', { encoding: 'utf-8' });

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers: Resolvers = {
  Query: {
    books: async () => {
      let ret = await axios.get('http://localhost:3000/books')
      const books: Book[] = ret.data
      return books
    },
    comments: async (_, { bookId }) => {
      let ret = await axios.get(`http://localhost:3000/comments?bookId=${bookId}`)
      return ret.data
    },
    bookWithComments: async (_, { bookId }) => {
      let book: Book = (await axios.get(`http://localhost:3000/books?id=${bookId}`)).data[0]
      console.log('book', book)
      let comments: Comment[] = (await axios.get(`http://localhost:3000/comments?bookId=${bookId}`)).data
      console.log('comments', comments)
      const ret: BookWithComments = { book, comments }
      console.log('ret', ret)
      return ret
    }
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
})()
