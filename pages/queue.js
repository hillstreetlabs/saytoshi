import { observer, inject } from "mobx-react";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Wrapper from "../components/Wrapper";
import Spacer from "../components/Spacer";
import { Box } from "./tweet";
import format from "date-fns/format";
import distanceInWords from "date-fns/distance_in_words";

@inject("store")
@withRouter
@observer
export default class Queue extends React.Component {
  get tweets() {
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
        <Subheader username={username} selected="queue" />
        {this.tweets.map(tweet => (
          <div>
            Tweeting in {distanceInWords(new Date(), tweet.time)}
            <Spacer size={0.25} />
            <Box>
              <h2 style={{ fontWeight: 400, lineHeight: 1.4 }}>{tweet.text}</h2>
            </Box>
            <Spacer />
          </div>
        ))}
      </AppLayout>
    );
  }
}
