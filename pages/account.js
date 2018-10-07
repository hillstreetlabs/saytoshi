import { observer, inject } from "mobx-react";
import { when, observable } from "mobx";
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
export default class Account extends React.Component {
  @observable fetchedTweets = undefined;
  voteAmounts = observable.map({});
  didVote = observable.map({});

  static async getTweets(address) {
    const tweetsQuery = `
      query VotedTweets($address: String!) {
        tweetsByVoter(address: $address) {
          uuid
          text
          proposedAt
          votingEndsAt
          tweeter {
            handle
          }
        }
      }`;
    const { tweetsByVoter } = await graphqlFetch(tweetsQuery, { address });
    return tweetsByVoter.sort(
      (a, b) => new Date(b.proposedAt) - new Date(a.proposedAt)
    );
  }

  componentDidMount() {
    when(
      () => this.props.store.currentAddress,
      () => {
        this.refresh();
        this.interval = setInterval(() => this.refresh(), 10000);
      }
    );
  }

  componentWillUnmount() {
    if (this.interval) clearTimeout(this.interval);
  }

  async refresh() {
    const tweets = await Account.getTweets(this.props.store.currentAddress);
    this.fetchedTweets = tweets;
  }

  get tweets() {
    return this.fetchedTweets;
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
    if (!this.tweets) return null;
    return (
      <AppLayout>
        <Spacer />
        <div style={{ textAlign: "center" }}>
          <h1>Your votes</h1>
          <div>You've voted on {this.tweets.length} tweet proposals.</div>
        </div>
        <Spacer />
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
