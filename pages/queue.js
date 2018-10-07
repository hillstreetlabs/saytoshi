import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Wrapper from "../components/Wrapper";
import Spacer from "../components/Spacer";
import { Box } from "./tweet";
import format from "date-fns/format";
import distanceInWords from "date-fns/distance_in_words";
import graphqlFetch from "../web/graphqlFetch";

@inject("store")
@withRouter
@observer
export default class Queue extends React.Component {
  @observable fetchedTweets = undefined;

  static async getTweets() {
    const tweetsQuery = `
      query AcceptedTweets {
        acceptedTweets {
          uuid
          text
          proposedAt
          tweeter {
            handle
          }
        }
      }`;
    const { acceptedTweets } = await graphqlFetch(tweetsQuery);
    return acceptedTweets;
  }

  static async getInitialProps() {
    const tweets = await Queue.getTweets();
    return { tweets };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.refresh(), 10000);
  }

  componentWillUnmount() {
    if (this.interval) clearTimeout(this.interval);
  }

  async refresh() {
    const tweets = await Queue.getTweets();
    this.fetchedTweets = tweets;
  }

  get tweets() {
    if (this.fetchedTweets) return this.fetchedTweets;
    return this.props.tweets;
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Subheader username={username} selected="queue" />
        {this.tweets.map(tweet => (
          <div>
            Tweeting in {distanceInWords(new Date(), tweet.proposedAt)}
            <Spacer size={0.25} />
            <Box>
              <h2 style={{ fontWeight: 400, lineHeight: 1.4 }}>{tweet.text}</h2>
            </Box>
            <Spacer />
          </div>
        ))}
      </AppLayout>
    );
  }
}
