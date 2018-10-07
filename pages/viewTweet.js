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

@inject("store")
@withRouter
@observer
export default class TweetPage extends React.Component {
  @observable fetchedTweets = undefined;
  voteAmounts = observable.map({});
  didVote = observable.map({});

  static async getInitialProps({ req }) {
    const tweetQuery = `
      query GetTweet($uuid: ID!) {
        tweet(uuid: $uuid) {
          uuid
          text
          proposedAt
          votingEndsAt
          tweeter {
            handle
          }
        }
      }`;
    const { tweet } = await graphqlFetch(tweetQuery, { uuid: req.params.uuid });
    return { tweet };
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <Subheader username={this.props.tweet.tweeter.handle} selected="vote" />
        <Spacer size={1.5} />
        <Vote tweet={this.props.tweet} />
      </AppLayout>
    );
  }
}
