import { observer, inject } from "mobx-react";
import { observable, computed } from "mobx";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Wrapper from "../components/Wrapper";
import Spacer from "../components/Spacer";
import { Box } from "./tweet";
import distanceInWords from "date-fns/distance_in_words";
import Countdown from "react-countdown-now";
import graphqlFetch from "../web/graphqlFetch";
import Vote from "../components/Vote";

@inject("store")
@withRouter
@observer
export default class Queue extends React.Component {
  @observable fetchedTweets = undefined;

  static async getTweets(handle) {
    const tweetsQuery = `
      query AcceptedTweets($handle: String) {
        acceptedTweets(handle: $handle) {
          uuid
          text
          yesStake
          totalStake
          proposedAt
          votingEndsAt
          tweetAt
          tweetedAt
          tweetId
          status
          tweeter {
            handle
          }
        }
      }`;
    const { acceptedTweets } = await graphqlFetch(tweetsQuery, { handle });
    acceptedTweets.sort((a, b) => b.yesStake - a.yesStake);
    return acceptedTweets;
  }

  static async getInitialProps({ query }) {
    const tweets = await Queue.getTweets(query.username);
    return { tweets };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.refresh(), 10000);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  async refresh() {
    const tweets = await Queue.getTweets(this.props.router.query.username);
    this.fetchedTweets = tweets;
  }

  get tweets() {
    if (this.fetchedTweets) return this.fetchedTweets;
    return this.props.tweets;
  }

  @computed
  get queuedTweets() {
    return this.tweets.filter(t => t.status === "accepted");
  }

  @computed
  get tweetedTweets() {
    return this.tweets.filter(t => t.status === "tweeted");
  }

  tweetLink(tweet) {
    return `https://twitter.com/${tweet.tweeter.handle}/status/${
      tweet.tweetId
    }`;
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <Subheader username={username} selected="queue" />
        <Spacer size={1.5} />
        {this.queuedTweets.map((tweet, i) => (
          <div key={i}>
            🚀 Sending in <Countdown date={tweet.tweetAt} />
            <Spacer size={0.25} />
            <Box>
              <h3 style={{ fontWeight: 400, lineHeight: 1.4, fontSize: 20 }}>
                {tweet.text}
              </h3>
            </Box>
            <Spacer />
          </div>
        ))}
        {this.tweetedTweets.map((tweet, i) => (
          <Vote key={tweet.uuid} tweet={tweet} />
        ))}

        {this.tweets.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <Spacer size={2} />
            <h3 style={{ color: "#555", fontWeight: 400 }}>
              No tweets sent out by @{username}.{" "}
              <Link as={`/${username}`} href={`/tweet?username=${username}`}>
                <a>Add one now.</a>
              </Link>
            </h3>
            <Spacer size={3} />
          </div>
        )}
        <Spacer />
        <div style={{ textAlign: "center" }}>
          <Link href="/revoke">
            <a>Need to revoke SayToshi access?</a>
          </Link>
        </div>
      </AppLayout>
    );
  }
}
