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

const Flex = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const Button = styled("button")`
  background-color: #822dff;
  color: white;
  width: 100%;
  display: block;
  font-size: 16px;
  padding: ${basePadding * 1.5}px ${basePadding}px;
  border-radius: ${basePadding / 2}px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
`;

const ApproveButton = styled(Button)`
  background-color: #381de8;
`;

const RejectButton = styled(Button)`
  background-color: #a71de8;
`;

@inject("store")
@withRouter
@observer
export default class VotePage extends React.Component {
  @observable fetchedTweets = undefined;
  voteAmounts = observable.map({});
  didVote = observable.map({});

  static async getTweets() {
    const tweetsQuery = `
      query AcceptedTweets {
        proposedTweets {
          uuid
          text
          proposedAt
          votingEndsAt
          tweeter {
            handle
          }
        }
      }`;
    const { proposedTweets } = await graphqlFetch(tweetsQuery);
    return proposedTweets;
  }

  static async getInitialProps() {
    const tweets = await VotePage.getTweets();
    return { tweets };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.refresh(), 10000);
  }

  componentWillUnmount() {
    if (this.interval) clearTimeout(this.interval);
  }

  async refresh() {
    const tweets = await VotePage.getTweets();
    this.fetchedTweets = tweets;
  }

  get tweets() {
    if (this.fetchedTweets) return this.fetchedTweets;
    return this.props.tweets;
  }

  isValid(uuid) {
    return (
      this.voteAmounts.has(uuid) &&
      this.voteAmounts.get(uuid).match(/^[0-9.]+$/)
    );
  }

  async castVote(uuid, isYes) {
    if (!this.isValid(uuid)) return;
    const amount = utils.parseEther(this.voteAmounts.get(uuid));
    try {
      const result = await this.props.store.voterContract.vote(
        "0x" + uuid,
        amount,
        isYes
      );
      this.didVote.set(uuid, true);
    } catch (e) {
      console.error(e);
      this.error = "Something went wrong voting on the tweet 😕";
    }
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <Subheader username={username} selected="vote" />
        <Spacer size={1.5} />
        {this.tweets.map((tweet, i) => <Vote key={tweet.uuid} tweet={tweet} />)}
        {this.tweets.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <Spacer size={2} />
            <h3 style={{ color: "#555", fontWeight: 400 }}>
              No proposed tweets for @{username}.{" "}
              <Link as={`/${username}`} href={`/tweet?username=${username}`}>
                <a>Add one now.</a>
              </Link>
            </h3>
            <Spacer size={3} />
          </div>
        )}
      </AppLayout>
    );
  }
}
