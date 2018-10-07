import { observer, inject } from "mobx-react";
import { action, observable, computed } from "mobx";
import Link from "next/link";
import { withRouter } from "next/router";
import styled from "react-emotion";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Divider from "../components/Divider";
import Wrapper from "../components/Wrapper";
import graphqlFetch from "../web/graphqlFetch";
import first from "lodash/first";
import { utils } from "ethers";

export const basePadding = 10;

export const Box = styled("div")`
  background-color: white;
  padding: ${props => !props.noPadding && basePadding * 2}px;
  border-radius: ${basePadding}px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Textarea = styled("textarea")`
  width: 100%;
  padding: ${basePadding * 1.5}px ${basePadding}px;
  font-size: ${basePadding * 2}px;
  background-color: #eee;
  border-radius: ${basePadding / 2}px;
  border: none;
  font-family: Roboto, sans-serif;
  resize: none;
`;

export const InputGroup = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #eee;
  border-radius: ${basePadding / 2}px;

  & label {
    text-align: right;
    padding: 0 ${basePadding}px;
  }
`;

export const Input = styled("input")`
  padding: ${basePadding * 1.5}px ${basePadding}px;
  font-size: ${basePadding * 3}px;
  width: 90%;
  background-color: transparent;
  border: none;
`;

const Button = styled("button")`
  background-color: #822dff;
  color: white;
  width: 100%;
  display: block;
  font-size: 18px;
  border: none;
  padding: ${basePadding * 2}px ${basePadding}px;
  border-radius: ${basePadding / 2}px;
  cursor: pointer;

  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
`;

export const FormHeading = styled("h2")`
  font-size: ${basePadding * 2}px;
  font-weight: 500;
`;

export const Alert = styled("div")`
  padding: 20px;
  text-align: center;
  border: 2px solid #f420ff;
  border-radius: 5px;
  color: #f420ff;
  font-size: 18px;
  background-color: rgba(244, 32, 255, 0.1);
`;

@inject("store")
@withRouter
@observer
export default class ProposeTweet extends React.Component {
  @observable text = "";
  @observable stake = "";
  @observable uuid = undefined;
  @observable createStatus = null; // null, "error", "saving", "signing", "confirming"

  async createTweet() {
    this.createStatus = "saving";
    let uuid;
    try {
      const { username } = this.props.router.query;
      // Get uuid from server
      // Get tweeters
      const tweetersQuery = `
        query Tweeters {
          tweeters {
            handle
            id
          }
        }`;
      const { tweeters } = await graphqlFetch(tweetersQuery);
      const tweeter = first(
        tweeters.filter(tweeter => tweeter.handle === username)
      );
      if (!tweeter)
        return void (this.error = "SayToshi can't tweet from that username 😕");
      const proposeQuery = `
        mutation CreateTweet($tweet: CreateTweetInput!) {
          createTweet(input: $tweet) {
            uuid
          }
        }`;
      const { createTweet } = await graphqlFetch(proposeQuery, {
        tweet: {
          tweeterId: tweeter.id,
          text: this.text
        }
      });
      uuid = createTweet.uuid;
    } catch (e) {
      console.error(e);
      this.createStatus = "error";
    }
    try {
      const stake = utils.parseEther(this.stake);
      console.log(stake);
      const result = await this.props.store.voterContract.propose(
        "0x" + uuid,
        stake
      );
      this.uuid = uuid;
    } catch (e) {
      console.log(e);
    }
  }

  @action
  updateText(newText) {
    this.text = newText;
  }

  @action
  updateStake(newStake) {
    this.stake = newStake;
  }

  @computed
  get tweetIsReady() {
    return this.text && parseFloat(this.stake) > 0;
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <Subheader username={username} selected="tweet" />
        <Spacer size={1.5} />
        {this.uuid ? (
          <Box>
            <h2>
              Success. Get people to vote on your tweet{" "}
              <Link href={`/${username}/${this.uuid}`}>
                <a>here</a>
              </Link>
            </h2>
          </Box>
        ) : (
          <Box>
            <form
              onSubmit={e => {
                e.preventDefault();
                this.createTweet();
              }}
            >
              {this.createStatus === "error" && (
                <div style={{ color: "red" }}>
                  Something went wrong creating your proposal 😕
                </div>
              )}
              <FormHeading>
                What do you want{" "}
                <strong
                  style={{ fontWeight: 600, textDecoration: "underline" }}
                >
                  @{username}
                </strong>{" "}
                to say?
              </FormHeading>
              <Spacer />
              <Textarea
                placeholder={"Type your tweet here."}
                rows={5}
                onChange={e => this.updateText(e.target.value)}
              />
              <Spacer />
              <FormHeading>How much are you staking on this tweet?</FormHeading>
              <Spacer size={0.5} />
              <h4 style={{ fontWeight: 400, color: "#555" }}>
                If your tweet isn't approved, you'll lose this money.
              </h4>
              <Spacer />
              <InputGroup>
                <Input
                  placeholder={"0.0"}
                  onChange={e => this.updateStake(e.target.value)}
                />
                <label>TWEETH</label>
              </InputGroup>
              <Spacer size={1.25} />
              {this.props.store.currentAddress ? (
                <Button type="submit" disabled={!this.tweetIsReady}>
                  Propose tweet for{" "}
                  <strong style={{ fontWeight: 600 }}>@{username}</strong>
                </Button>
              ) : (
                <Alert>
                  Please make sure you are connected to Ethereum and your wallet
                  is unlocked.
                </Alert>
              )}
            </form>
          </Box>
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
