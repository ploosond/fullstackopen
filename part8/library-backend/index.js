const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const { GraphQLError } = require("graphql");
require("dotenv").config();

mongoose.set("strictQuery", false);

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB", error.message);
  });

let authors = [
  {
    name: "Robert Martin",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
  },
  {
    name: "Sandi Metz", // birthyear not known
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = `
  type Author {
  name: String!
  born: Int
  bookCount: Int
  id: ID!
  }

  type Book {
  title: String!
  author: Author!
  published: Int!
  genres: [String!]
  id: ID!
  }

  type Query {
  bookCount: Int!
  authorCount: Int!
  allBooks(author: String, genre: String): [Book!]!
  allAuthors: [Author!]!
  }

  type Mutation {
  addBook (
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
    ): Book!

  editAuthor (
  name: String!
  setBornTo: Int!
  ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        try {
          const author = await Author.findOne({ name: args.author });

          return Book.find({
            author: author._id,
            genres: { $in: [args.genre] },
          }).populate("author");
        } catch (error) {
          throw new GraphQLError("Author does not exists", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
            },
          });
        }
      }

      if (args.author) {
        try {
          const author = await Author.findOne({ name: args.author });
          return Book.find({ author: author._id }).populate("author");
        } catch (error) {
          throw new GraphQLError("Author does not exists", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
            },
          });
        }
      }

      if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }

      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({}).populate("author");
      return authors.map((author) => {
        return {
          ...author.toObject(),
          id: author._id,
          bookCount: books.filter(
            (book) => book.author._id.toString() === author._id.toString()
          ).length,
        };
      });
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          author = new Author({ name: args.author });
          await author.save();
        } catch (error) {
          throw new GraphQLError(
            "Author should be minimum 4 characters length",
            {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.author,
              },
            }
          );
        }
      }

      let newBook = new Book({ ...args, author: author._id });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Title should be minimum 5 characters length", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
          },
        });
      }

      newBook = await Book.findById(newBook._id).populate("author");
      return newBook;
    },
    editAuthor: async (root, args) => {
      try {
        const authorExists = await Author.findOne({ name: args.name });

        const updatedAuthor = await Author.findOneAndUpdate(
          { name: authorExists.name },
          { born: args.setBornTo },
          { new: true }
        );

        return updatedAuthor;
      } catch (error) {
        throw new GraphQLError("Author does not exists", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.author,
            error,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
