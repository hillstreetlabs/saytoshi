import { observer, inject } from "mobx-react";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import { Box } from "./tweet";
import distanceInWords from "date-fns/distance_in_words";
import Countdown from "react-countdown-now";

@inject("store")
@withRouter
@observer
export default class Vote extends React.Component {
  get contests() {
    // TODO
    return [
      {
        time: new Date(),
        text:
          "Just want to that the Shortseller Enrichment Commission is doing incredible work. And the name change is so on point!"
      },
      {
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
        {this.contests.map(contest => (
          <div>
            Voting ends in <Countdown date={contest.time} />
            <Box>{contest.text}</Box>
            <Spacer />
          </div>
        ))}
      </AppLayout>
    );
  }
}
