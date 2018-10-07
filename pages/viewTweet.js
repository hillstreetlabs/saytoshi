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
import { now } from "mobx-utils";

@inject("store")
@withRouter
@observer
export default class TweetPage extends React.Component {
  @observable fetchedTweets = undefined;
  voteAmounts = observable.map({});
  didVote = observable.map({});

  static async getInitialProps({ query }) {
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
    const { tweet } = await graphqlFetch(tweetQuery, { uuid: query.uuid });
    return { tweet };
  }

  render() {
    const { username } = this.props.router.query;
    const { tweet } = this.props;
    const votingEndsAt = new Date(tweet.votingEndsAt).getTime();
    const rightNow = now();
    let status = "voting";
    if (rightNow - votingEndsAt > 0) status = "pending";
    if (rightNow - votingEndsAt > 120000) status = "claiming";
    return (
      <AppLayout>
        <Spacer />
        <Subheader
          username={this.props.tweet.tweeter.handle}
          selected={status === "voting" ? "vote" : undefined}
        />
        <Spacer size={1.5} />
        {status === "claiming" && <div>Claim</div>}
        {status === "pending" && <div>Pending</div>}
        {status === "voting" && <Vote tweet={this.props.tweet} />}
      </AppLayout>
    );
  }
}
