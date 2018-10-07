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

const Photo = styled("img")`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

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
            photo
            followerCount
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
    console.log(rightNow);
    let status = "voting";
    if (rightNow - votingEndsAt > 0) status = "pending";
    if (rightNow - votingEndsAt > 120000) status = "claiming";
    return (
      <AppLayout>
        <Spacer />
        <div style={{ textAlign: "center" }}>
          <Photo src={tweet.tweeter.photo} />
          <Spacer size={0.5} />
          <div>
            <Link
              as={`/${tweet.tweeter.handle}`}
              href={`/tweet?username=${tweet.tweeter.handle}`}
            >
              <h2 style={{ cursor: "pointer" }}>@{tweet.tweeter.handle}</h2>
            </Link>
            <small>{tweet.tweeter.followerCount} Followers</small>
          </div>
        </div>
        <Spacer size={1.5} />
        {status === "claiming" && (
          <Box style={{ textAlign: "center" }}>
            This vote has resolved. Redeem interface coming soon.
          </Box>
        )}
        {status === "pending" && <div>Pending</div>}
        {status === "voting" && <Vote tweet={this.props.tweet} />}
      </AppLayout>
    );
  }
}
