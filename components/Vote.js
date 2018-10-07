import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import Link from "next/link";
import styled from "react-emotion";
import { withRouter } from "next/router";
import Header from "./Header";
import Wrapper from "./Wrapper";
import Subheader from "./Subheader";
import AppLayout from "./AppLayout";
import Spacer from "./Spacer";
import Divider from "./Divider";
import {
  basePadding,
  Box,
  InputGroup,
  Input,
  FormHeading
} from "../pages/tweet";
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

@inject("store")
@withRouter
@observer
export default class Vote extends React.Component {
  @observable voteAmount = "";
  @observable didVote = false;

  get isValid() {
    return this.voteAmount && this.voteAmount.match(/^[0-9.]+$/);
  }

  async castVote(isYes) {
    const uuid = this.props.tweet.uuid;
    if (!this.isValid) return;
    const amount = utils.parseEther(this.voteAmount);
    try {
      const result = await this.props.store.voterContract.vote(
        "0x" + uuid,
        amount,
        isYes
      );
      this.didVote = true;
    } catch (e) {
      console.error(e);
      this.error = "Something went wrong voting on the tweet 😕";
    }
  }

  render() {
    const { username } = this.props.router.query;
    const { tweet } = this.props;
    return (
      <div>
        <Flex>
          <div>
            Voting ends in <Countdown date={tweet.votingEndsAt} />
          </div>
          <a as={`/${username}/${tweet.id}`} href={`/viewTweet?tweet=${tweet.id}`} target="_blank">
            Link ↗
          </a>
        </Flex>
        <Spacer size={0.5} />
        <Box>
          <h3 style={{ fontWeight: 400, lineHeight: 1.4, fontSize: 20 }}>
            {tweet.text}
          </h3>
          <Divider padded color={"#dadada"} />
          <FormHeading>
            Vote amount
          </FormHeading>
          <Spacer size={0.5} />
          <InputGroup>
            <Input
              onChange={e => (this.voteAmount = e.target.value)}
              value={this.voteAmount}
              placeholder="0.0"
            />
            <label>TWEETH</label>
          </InputGroup>
          <Spacer />
          <Flex>
            <ApproveButton
              disabled={!this.isValid}
              onClick={() => this.castVote(true)}
            >
              👍 Approve
            </ApproveButton>
            <Spacer inline size={0.5} />
            <RejectButton
              disabled={!this.isValid}
              onClick={() => this.castVote(false)}
            >
              👎 Reject
            </RejectButton>
          </Flex>
        </Box>
        <Spacer size={1.5} />
      </div>
    );
  }
}
