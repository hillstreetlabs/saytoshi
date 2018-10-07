import { makeExecutableSchema } from "graphql-tools";
import { GraphQLScalarType } from "graphql";
import { Tweet, TweetModel, Tweeter, TweeterModel } from "./models";
import createTweet from "./mutations/createTweet";

const typeDefs = `
  scalar Date

  type Query {
    pendingTweets: [Tweet]
    proposedTweets: [Tweet]
    acceptedTweets: [Tweet]
    rejectedTweets: [Tweet]
    tweetedTweets: [Tweet]
    tweeters: [Tweeter]
  }

  type Mutation {
    createTweet(input: CreateTweetInput!): Tweet
  }

  input CreateTweetInput {
    text: String!
    tweeterId: String!
  }

  enum TweetStatus {
    pending
    proposed
    expired
    accepted
    rejected
  }

  type Tweet {
    uuid: ID
    text: String
    status: TweetStatus
    tweeterId: String
    tweeter: Tweeter
  }

  type Tweeter {
    id: ID
    handle: String
  }
`;

const resolvers = [
  {
    Query: {
      // Fuck it, who needs arguments
      pendingTweets: async () => {
        const tweets = await Tweet.find({ status: "pending" });
        return tweets;
      },
      proposedTweets: async () => {
        const tweets = await Tweet.find({ status: "proposed" });
        return tweets;
      },
      acceptedTweets: async () => {
        const tweets = await Tweet.find({ status: "accepted" });
        return tweets;
      },
      rejectedTweets: async () => {
        const tweets = await Tweet.find({ status: "rejected" });
        return tweets;
      },
      tweetedTweets: async () => {
        const tweets = await Tweet.find({ status: "tweeted" });
        return tweets;
      },
      tweeters: async () => {
        const tweeters = await Tweeter.find();
        return tweeters;
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
        const tweet = await createTweet(input);
        return tweet;
      }
    },
    Date: new GraphQLScalarType({
      name: "Date",
      serialize: (date: Date) => date.getTime()
    }),
    Tweet: {
      tweeter: async (tweet: TweetModel) => await Tweeter.findById(tweet.tweeterId)
    },
    Tweeter: { id: (tweeter: TweeterModel) => tweeter._id.toString() }
  }
];

export default () => makeExecutableSchema({ typeDefs, resolvers });
