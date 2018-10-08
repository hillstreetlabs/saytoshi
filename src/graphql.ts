import { makeExecutableSchema } from "graphql-tools";
import { GraphQLScalarType } from "graphql";
import { Tweet, TweetModel, Tweeter, TweeterModel } from "./models";
import createTweet from "./mutations/createTweet";

const typeDefs = `
  scalar Date

  type Query {
    pendingTweets: [Tweet]
    proposedTweets(handle: String): [Tweet]
    acceptedTweets(handle: String): [Tweet]
    rejectedTweets: [Tweet]
    tweetedTweets: [Tweet]
    tweet(uuid: ID!): Tweet
    tweeters: [Tweeter]
    tweetsByVoter(address: String): [Tweet]
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
    tweeted
    error
  }

  type Tweet {
    uuid: ID
    text: String
    status: TweetStatus
    tweeterId: String
    tweeter: Tweeter
    proposedAt: Date
    votingEndsAt: Date
    tweetAt: Date
    yesStake: Float
    totalStake: Float
    tweetedAt: Date
    tweetId: String
  }

  type Tweeter {
    id: ID
    handle: String
    photo: String
    followerCount: Int
    openTweetCount: Int
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
      proposedTweets: async (_: any, args: { handle: string }) => {
        const tweeter = await Tweeter.findOne({ handle: args.handle });
        const tweets = await Tweet.find({
          status: "proposed",
          tweeterId: tweeter._id
        });
        return tweets;
      },
      acceptedTweets: async (
        _: any,
        args: { handle: string },
        ctx: { getQueuedTweetTime: Function }
      ) => {
        const tweeter = await Tweeter.findOne({ handle: args.handle });
        let queuedTweets = await Tweet.find({
          status: "accepted",
          tweeterId: tweeter._id
        }).sort({
          yesStake: "-1"
        });
        queuedTweets = queuedTweets.map((tweet, i) => ({
          tweetAt: ctx.getQueuedTweetTime(i),
          ...tweet.toObject()
        }));
        const sentTweets = await Tweet.find({
          status: "tweeted",
          tweeterId: tweeter._id
        }).sort({
          tweetedAt: "-1"
        });
        return queuedTweets.concat(sentTweets);
      },
      rejectedTweets: async () => {
        const tweets = await Tweet.find({ status: "rejected" });
        return tweets;
      },
      tweetedTweets: async () => {
        const tweets = await Tweet.find({ status: "tweeted" });
        return tweets;
      },
      tweet: async (_: any, args: { uuid: string }) => {
        const tweet = await Tweet.findOne({ uuid: args.uuid });
        return tweet;
      },
      tweeters: async () => {
        const tweeters = await Tweeter.find();
        return tweeters;
      },
      tweetsByVoter: async (_: any, args: { address: string }) => {
        const tweets = await Tweet.find({ "votes.voter": args.address });
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
        const tweet = await createTweet(input);
        return tweet;
      }
    },
    Date: new GraphQLScalarType({
      name: "Date",
      serialize: (date: Date) => date.toISOString()
    }),
    Tweet: {
      tweeter: async (tweet: TweetModel) =>
        await Tweeter.findById(tweet.tweeterId),
      votingEndsAt: (tweet: TweetModel) =>
        tweet.proposedAt &&
        new Date(tweet.proposedAt.getTime() + (global as any).VOTING_TIME)
    },
    Tweeter: {
      id: (tweeter: TweeterModel) => tweeter._id.toString(),
      openTweetCount: async (tweeter: TweeterModel) =>
        await Tweet.countDocuments({
          tweeterId: tweeter._id,
          status: "proposed"
        })
    }
  }
];

export default () => makeExecutableSchema({ typeDefs, resolvers });
