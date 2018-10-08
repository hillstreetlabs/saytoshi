import { observer, inject } from "mobx-react";
import { observable, computed, when } from "mobx";
import Link from "next/link";
import styled, { keyframes } from "react-emotion";
import { withRouter } from "next/router";
import Header from "./Header";
import Wrapper from "./Wrapper";
import Subheader from "./Subheader";
import Badge from "./Badge";
import AppLayout from "./AppLayout";
import Spacer from "./Spacer";
import Divider from "./Divider";
import {
  basePadding,
  Box,
  InputGroup,
  Input,
  FormHeading,
  Alert
} from "../pages/tweet";
import distanceInWords from "date-fns/distance_in_words";
import Countdown from "react-countdown-now";
import graphqlFetch from "../web/graphqlFetch";
import { utils } from "ethers";
import { now } from "mobx-utils";

const gentlePulseSize = keyframes`
  0% { transform: scale(1); }
  20% { transform: scale(1.04); }
  100% { transform: scale(1); }
`;

const Flex = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const Button = styled("button")`
  background-color: #822dff;
  border: 0 none;
  color: white;
  width: 100%;
  display: block;
  font-size: 18px;
  padding: ${basePadding * 1.75}px ${basePadding}px;
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

const Progress = styled("div")`
  height: 5px;
  width: 100%;
  background-color: #dfdfdf;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  & > div {
    height: 5px;

    background-color: #aaa;
  }
`;

const ProgressInputGroup = styled(InputGroup)`
  border-radius: 5px 5px 0 0;
`;

const TallyPercentage = styled("div")`
  height: 7px;
  width: 100%;
  background-color: #eee;
  display: flex;
  border-radius: 7px;
  overflow: hidden;
  & > div:first-child {
    height: 7px;
    background-color: #80dc7a;
  }
  & > div:last-child {
    height: 7px;
    background-color: #e069c6;
  }
`;

@observer
class VoteTally extends React.Component {
  render() {
    const { data } = this.props;
    const percentageToQuorum = data.percentageToQuorum;
    const percentageYes = data.percentageYes * (percentageToQuorum / 100);
    const percentageNo = data.percentageNo * (percentageToQuorum / 100);
    return (
      <div>
        <Flex>
          <div style={{ textAlign: "left", fontSize: "14px" }}>
            <b>{data.percentageYes}% Yes</b>
            <br />
            <small style={{ color: "#777" }}>
              {utils.formatEther(data.yesTotal || "0")} TWEETH
            </small>
          </div>
          <div style={{ textAlign: "right", fontSize: "14px" }}>
            <b>{data.percentageNo}% No</b>
            <br />
            <small style={{ color: "#777" }}>
              {utils.formatEther(data.noTotal || "0")} TWEETH
            </small>
          </div>
        </Flex>
        <Spacer size={0.2} />
        <TallyPercentage>
          <div style={{ width: percentageYes + "%" }} />
          <div style={{ width: percentageNo + "%" }} />
        </TallyPercentage>
        <Spacer size={0.2} />
        <div style={{ textAlign: "left", fontSize: "14px" }}>
          <b>{Math.floor(data.percentageToQuorum)}% of quorum</b>.{" "}
          {data.percentageToQuorum < 100 && (
            <small style={{ color: "#777" }}>
              {utils.formatEther(data.stakeRequired)} additional TWEETH
              required.
            </small>
          )}
        </div>
      </div>
    );
  }
}

@observer
class CreatingTweet extends React.Component {
  render() {
    const { tweet } = this.props;
    return (
      <div>
        <Box
          style={{
            textAlign: "center",
            animation: `${gentlePulseSize} 1.5s infinite`
          }}
        >
          This proposal is being created. Hang tight for a moment!
        </Box>
        <Spacer size={1.5} />
      </div>
    );
  }
}

@inject("store")
@observer
class ResolvedTweet extends React.Component {
  @observable claimStatus = "none"; // none, signing, saving, success

  tweetLink(tweet) {
    return `https://twitter.com/${tweet.tweeter.handle}/status/${
      tweet.tweetId
    }`;
  }

  async claim() {
    this.isError = false;
    this.claimStatus = "signing";
    const currentBalance = this.props.store.tokenBalance;
    const { tweet } = this.props;
    try {
      const receipt = await this.props.store.voterContract.claim([
        "0x" + tweet.uuid
      ]);
      this.claimStatus = "saving";
      await when(() => this.props.store.tokenBalance.gt(currentBalance));
      this.claimStatus = "success";
    } catch (e) {
      this.claimStatus = "none";
      this.isError = "true";
    }
  }

  render() {
    const { tweet, claimableAmount } = this.props;
    return (
      <div>
        <Flex>
          <div>
            {tweet.tweetId &&
              tweet.tweeter && (
                <span>
                  <a href={this.tweetLink(tweet)}>Tweeted</a>{" "}
                  {tweet.tweetedAt
                    ? distanceInWords(now(), tweet.tweetedAt, {
                        addSuffix: true
                      })
                    : null}
                </span>
              )}
            {tweet.status === "rejected" && (
              <span>
                Rejected {distanceInWords(now(), tweet.votingEndsAt)} ago
              </span>
            )}
            {!tweet.tweetId &&
              tweet.status !== "rejected" && (
                <span>
                  Voting ended {distanceInWords(now(), tweet.votingEndsAt)} ago
                </span>
              )}
          </div>
          <Link as={`/t/${tweet.uuid}`} href={`/viewTweet?uuid=${tweet.uuid}`}>
            Direct Link
          </Link>
        </Flex>
        <Spacer size={0.5} />
        <Box style={{ textAlign: "center" }}>
          <h3 style={{ fontWeight: 400, lineHeight: 1.4, fontSize: 20 }}>
            {tweet.text}
          </h3>
          <Spacer small />
          <VoteTally data={this.props.data} />
          <Spacer />
          {this.isError && (
            <React.Fragment>
              <Alert>
                There was a problem claiming your tokens. Please try again.
              </Alert>
              <Spacer small />
            </React.Fragment>
          )}
          {this.claimStatus === "success" ? (
            <div style={{ color: "#aaa" }}>Successfully claimed tokens</div>
          ) : (
            <div>
              {claimableAmount ? (
                claimableAmount.isZero() ? (
                  <div style={{ marginTop: -20 }} />
                ) : (
                  <Button
                    onClick={() => this.claim()}
                    disabled={this.claimStatus !== "none"}
                  >
                    {this.claimStatus === "none" && (
                      <span>
                        Claim {utils.formatEther(claimableAmount)}{" "}
                        <small>TWEETH</small>
                      </span>
                    )}
                    {this.claimStatus === "signing" && (
                      <span>Check your wallet for details</span>
                    )}
                    {this.claimStatus === "saving" && (
                      <span>Waiting for transaction...</span>
                    )}
                  </Button>
                )
              ) : null}
            </div>
          )}
        </Box>
        <Spacer size={1.5} />
      </div>
    );
  }
}

@observer
class PendingTweet extends React.Component {
  render() {
    const { tweet } = this.props;
    return (
      <div>
        <Flex>
          <div>
            Voting ended {distanceInWords(now(), tweet.votingEndsAt)} ago
          </div>
          <Link as={`/t/${tweet.uuid}`} href={`/viewTweet?uuid=${tweet.uuid}`}>
            Direct Link
          </Link>
        </Flex>
        <Spacer size={0.5} />
        <Box
          style={{
            textAlign: "center",
            animation: `${gentlePulseSize} 1.5s infinite`
          }}
        >
          Voting has ended. Results being tallied.
        </Box>
        <Spacer size={1.5} />
      </div>
    );
  }
}

@inject("store")
@withRouter
@observer
export default class Vote extends React.Component {
  @observable voteAmount = "";
  @observable didVote = false;
  @observable claimableAmount = undefined;
  @observable voteStatus = "none";
  @observable yesTotal = undefined;
  @observable noTotal = undefined;

  componentDidMount() {
    this.getTweetDetails();
    this.interval = setInterval(() => this.getTweetDetails(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  @computed
  get totalAmountStaked() {
    if (!this.noTotal && !this.yesTotal) return utils.bigNumberify(0);
    if (!this.noTotal) return this.yesTotal;
    if (!this.yesTotal) return this.noTotal;
    return this.noTotal.add(this.yesTotal);
  }

  @computed
  get percentageYes() {
    if (!this.yesTotal || this.totalAmountStaked.isZero()) return 0;
    return parseFloat(
      this.yesTotal
        .mul(100)
        .div(this.totalAmountStaked)
        .toString()
    );
  }

  @computed
  get percentageNo() {
    if (!this.noTotal || this.totalAmountStaked.isZero()) return 0;
    return parseFloat(
      this.noTotal
        .mul(100)
        .div(this.totalAmountStaked)
        .toString()
    );
  }

  async getTweetDetails() {
    const { voterContract } = await this.props.store.getContracts();
    const proposal = await voterContract.uuidToProposals(
      "0x" + this.props.tweet.uuid
    );
    this.noTotal = proposal.noTotal;
    this.yesTotal = proposal.yesTotal;

    await when(() => this.props.store.currentAddress);
    const claimableAmount = await voterContract.claimableAmount(
      "0x" + this.props.tweet.uuid,
      this.props.store.currentAddress
    );
    this.claimableAmount = claimableAmount;
  }

  get isValid() {
    return this.voteAmount && this.voteAmount.match(/^[0-9.]+$/);
  }

  async castVote(isYes) {
    const uuid = this.props.tweet.uuid;
    if (!this.isValid) return;
    const amount = utils.parseEther(this.voteAmount);
    this.voteStatus = isYes ? "approving" : "rejecting";
    try {
      const currentBalance = this.props.store.tokenBalance;
      const result = await this.props.store.voterContract.vote(
        "0x" + uuid,
        amount,
        isYes
      );
      await when(() => this.props.store.tokenBalance.lt(currentBalance));
      await this.getTweetDetails();
      this.didVote = true;
      this.voteStatus = "none";
    } catch (e) {
      this.voteStatus = "none";
      console.error(e);
      this.error = "Something went wrong voting on the tweet 😕";
    }
  }

  @computed
  get stakeRequired() {
    if (!this.props.store.quorum) return 0;
    const quorum = utils.bigNumberify(this.props.store.quorum.toString());
    if (this.totalAmountStaked.gte(quorum)) return undefined;
    return quorum.sub(this.totalAmountStaked);
  }

  @computed
  get percentageToQuorum() {
    if (!this.props.store.quorum) return 0;
    const quorum = utils.bigNumberify(this.props.store.quorum.toString());
    let number = parseFloat(
      this.totalAmountStaked
        .mul(utils.bigNumberify("10000"))
        .div(quorum)
        .toString()
    );
    number /= 100;
    return Math.min(number, 100);
  }

  render() {
    const { username } = this.props.router.query;
    const { tweet } = this.props;
    const { tokenBalance } = this.props.store;
    if (!tweet.votingEndsAt) return <CreatingTweet tweet={tweet} />;
    const votingEndsAt = new Date(tweet.votingEndsAt).getTime();
    const rightNow = now();
    if (rightNow - votingEndsAt > 120000)
      return (
        <ResolvedTweet
          data={this}
          claimableAmount={this.claimableAmount}
          tweet={tweet}
        />
      );
    if (rightNow - votingEndsAt > 0) return <PendingTweet tweet={tweet} />;
    return (
      <div>
        <Flex>
          <div>
            Voting ends in <Countdown date={tweet.votingEndsAt} />
          </div>
          <Link as={`/t/${tweet.uuid}`} href={`/viewTweet?uuid=${tweet.uuid}`}>
            Direct Link
          </Link>
        </Flex>
        <Spacer size={0.5} />
        <Box>
          <h3 style={{ fontWeight: 400, lineHeight: 1.4, fontSize: 20 }}>
            {tweet.text}
          </h3>
          <Divider padded color={"#dadada"} />
          {this.didVote ? (
            <VoteTally data={this} />
          ) : (
            <div>
              <FormHeading>Vote amount</FormHeading>
              <Spacer size={0.5} />
              <ProgressInputGroup>
                <Input
                  onChange={e => (this.voteAmount = e.target.value)}
                  value={this.voteAmount}
                  placeholder="0.0"
                />
                <label>TWEETH</label>
              </ProgressInputGroup>
              <Progress>
                <div style={{ width: this.percentageToQuorum + "%" }} />
              </Progress>
              <Spacer small />
              <div>
                <b>{Math.floor(this.percentageToQuorum)}% of quorum</b>.{" "}
                {this.percentageToQuorum < 100 && (
                  <span>
                    {utils.formatEther(this.stakeRequired)} additional TWEETH
                    required.
                  </span>
                )}
              </div>
              <Spacer />
              {this.props.store.hasWeb3 ? (
                tokenBalance > 0 ? (
                  <Flex>
                    <ApproveButton
                      disabled={!this.isValid || this.voteStatus !== "none"}
                      onClick={() => this.castVote(true)}
                    >
                      {this.voteStatus === "approving"
                        ? "Approving..."
                        : "👍 Approve"}
                    </ApproveButton>
                    <Spacer inline size={0.5} />
                    <RejectButton
                      disabled={!this.isValid || this.voteStatus !== "none"}
                      onClick={() => this.castVote(false)}
                    >
                      {this.voteStatus === "rejecting"
                        ? "Rejecting..."
                        : "👎 Reject"}
                    </RejectButton>
                  </Flex>
                ) : (
                  <Alert>
                    You need TWEETH to do that.{" "}
                    <Link href="/airdrop">Go claim your tokens</Link> from the
                    airdrop.
                  </Alert>
                )
              ) : (
                <Alert>
                  Please make sure you are connected to Ethereum and your wallet
                  is unlocked.
                </Alert>
              )}
            </div>
          )}
        </Box>
        <Spacer size={1.5} />
      </div>
    );
  }
}
