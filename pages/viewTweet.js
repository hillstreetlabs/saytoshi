import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import Link from "next/link";
import styled from "react-emotion";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Vote from "../components/Vote";
import Divider from "../components/Divider";
import { basePadding, Box, InputGroup, Input, FormHeading } from "./tweet";
import distanceInWords from "date-fns/distance_in_words";
import Countdown from "react-countdown-now";
import graphqlFetch from "../web/graphqlFetch";
import { utils } from "ethers";

const Photo = styled("img")`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

@inject("store")
@withRouter
@observer
export default class TweetPage extends React.Component {
  @observable fetchedTweet = undefined;

  static async getTweet(uuid) {
    const tweetQuery = `
      query GetTweet($uuid: ID!) {
        tweet(uuid: $uuid) {
          uuid
          text
          proposedAt
          votingEndsAt
          status
          tweetId
          tweetedAt
          tweeter {
            handle
            photo
            followerCount
          }
        }
      }`;
    const { tweet } = await graphqlFetch(tweetQuery, { uuid });
    return tweet;
  }

  static async getInitialProps({ query }) {
    const tweet = await TweetPage.getTweet(query.uuid);
    return { tweet };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.refresh(), 2500);
  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  async refresh() {
    this.fetchedTweet = await TweetPage.getTweet(this.props.router.query.uuid);
  }

  get tweet() {
    return this.fetchedTweet || this.props.tweet;
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <div style={{ textAlign: "center" }}>
          <Photo src={this.tweet.tweeter.photo} />
          <Spacer size={0.5} />
          <div>
            <Link
              as={`/${this.tweet.tweeter.handle}`}
              href={`/tweet?username=${this.tweet.tweeter.handle}`}
            >
              <h2 style={{ cursor: "pointer" }}>
                @{this.tweet.tweeter.handle}
              </h2>
            </Link>
            <small>{this.tweet.tweeter.followerCount} Followers</small>
          </div>
        </div>
        <Spacer size={1.5} />
        <Vote tweet={this.tweet} />
      </AppLayout>
    );
  }
}
