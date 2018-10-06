import { makeExecutableSchema } from "graphql-tools";
import { GraphQLScalarType } from "graphql";
import { Tweet, Tweeter, TweeterModel } from "./models";
import BlockWatcher from "./BlockWatcher";
import createTweet from "./mutations/createTweet";

const typeDefs = `
  scalar Date

  type Query {
    pendingTweets: [Tweet]
    proposedTweets: [Tweet]
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
  }

  type Tweeter {
    id: ID
    handle: String
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
        },
        ctx: { watcher: BlockWatcher }
      ) {
        const tweet = await createTweet(input);
        ctx.watcher.__test_proposal(tweet.uuid);
        return tweet;
      }
    },
    Date: new GraphQLScalarType({
      name: "Date",
      serialize: (date: Date) => date.getTime()
    }),
    Tweet: {},
    Tweeter: { id: (tweeter: TweeterModel) => tweeter._id.toString() }
  }
];

export default () => makeExecutableSchema({ typeDefs, resolvers });
