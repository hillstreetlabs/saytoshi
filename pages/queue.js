import { observer, inject } from "mobx-react";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Wrapper from "../components/Wrapper";
import Spacer from "../components/Spacer";
import { Box } from "./tweet";
import distanceInWords from "date-fns/distance_in_words";
import Countdown from "react-countdown-now";

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
        <Spacer />
        <Subheader username={username} selected="queue" />
        <Spacer size={1.5} />
        {this.tweets.map((tweet, i) => (
          <div key={i}>
            🚀 in <Countdown date={tweet.time} />
            <Spacer size={0.25} />
            <Box>
              <h3 style={{ fontWeight: 400, lineHeight: 1.4, fontSize: 20 }}>
                {tweet.text}
              </h3>
            </Box>
            <Spacer />
          </div>
        ))}
        {this.tweets.length === 0 && (
          <div style={{ textAlign: "center" }}>
            <Spacer size={2} />
            <h3 style={{ color: "#555", fontWeight: 400 }}>
              No tweets in the queue for @{username}.{" "}
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
