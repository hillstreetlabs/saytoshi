import { makeExecutableSchema } from "graphql-tools";
import { GraphQLScalarType } from "graphql";
import { Tweet, Tweeter } from "./models";

const typeDefs = `
  scalar Date

  type Query {
    pendingTweets: [Tweet]
    proposedTweets: [Tweet]
  }

  type Mutation {
    createTweet(input: CreateTweetInput!): Tweet
  }

  input CreateTweetInput {
    text: String!
  }

  enum TweetStatus {
    pending
    proposed
    expired
    accepted
    rejected
  }

  type Tweet {
    _id: ID
    text: String
    status: TweetStatus
    tweeterId: String
  }
`;

const resolvers = [
  {
    Query: {
      pendingTweets: async () => {
        const tweets = await Tweet.find({ status: "pending" });
        return tweets;
      },
      proposedTweets: async () => {
        const tweets = await Tweet.find({ status: "proposed" });
        return tweets;
      }
    },
    Mutation: {
      async createTweet(
        _: any,
        {
          input
        }: {
          input: {
            text: string;
            tweeterId: string;
          };
        }
      ) {
        const tweeter = await Tweeter.findOne();
        const tweeterId = tweeter ? tweeter._id.toString() : undefined;
        const tweet = await Tweet.create({
          text: input.text,
          status: "pending",
          tweeterId
        });
        console.log(tweet);
        return tweet;
      }
    },
    Date: new GraphQLScalarType({
      name: "Date",
      serialize: (date: Date) => date.getTime()
    }),
    Tweet: {}
  }
];

export default () => makeExecutableSchema({ typeDefs, resolvers });
