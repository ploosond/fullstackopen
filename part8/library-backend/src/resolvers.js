const { GraphQLError, subscribe } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const Author = require("../models/author");
const Book = require("../models/book");
const User = require("../models/user");

const pubsub = new PubSub();

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
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      let author = await Author.findOne({ name: args.author });
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

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

      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });
      return newBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
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
    createUser: async (root, args) => {
      const user = new User({ ...args });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      };
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
