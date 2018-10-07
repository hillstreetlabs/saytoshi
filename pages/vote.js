import { observer, inject } from "mobx-react";
import Link from "next/link";
import styled from "react-emotion";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Divider from "../components/Divider";
import { basePadding, Box, InputGroup, Input, FormHeading } from "./tweet";
import distanceInWords from "date-fns/distance_in_words";
import Countdown from "react-countdown-now";

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
  get contests() {
    // TODO
    return [
      {
        id: 1,
        time: new Date(),
        text:
          "Just want to that the Shortseller Enrichment Commission is doing incredible work. And the name change is so on point!"
      },
      {
        id: 2,
        time: new Date(),
        text:
          "People sometimes forget that a company is just a group of people gathered together to make products. So long as it makes great products, it will have great value."
      }
    ];
  }

  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <Subheader username={username} selected="vote" />
        <Spacer size={1.5} />
        {this.contests.map((contest, i) => (
          <div key={i}>
            <Flex>
              <div>
                Voting ends in <Countdown date={contest.time} />
              </div>
              <a href={`/${username}/${contest.id}`} target="_blank">
                Link ↗
              </a>
            </Flex>
            <Spacer size={0.5} />
            <Box>
              <h3 style={{ fontWeight: 400, lineHeight: 1.4, fontSize: 20 }}>
                {contest.text}
              </h3>
              <Divider padded color={"#dadada"} />
              <FormHeading>
                Vote amount{" "}
                <small style={{ fontWeight: 400 }}>20 TWEETH available</small>
              </FormHeading>
              <Spacer size={0.5} />
              <InputGroup>
                <Input />
                <label>TWEETH</label>
              </InputGroup>
              <Spacer />
              <Flex>
                <ApproveButton>Approve</ApproveButton>
                <RejectButton>Reject</RejectButton>
              </Flex>
            </Box>
            <Spacer size={1.5} />
          </div>
        ))}
      </AppLayout>
    );
  }
}
