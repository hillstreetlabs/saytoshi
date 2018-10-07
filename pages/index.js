import { observer, inject } from "mobx-react";
import Link from "next/link";
import styled from "react-emotion";
import Header from "../components/Header";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Badge from "../components/Badge";
import Wrapper from "../components/Wrapper";
import graphqlFetch from "../web/graphqlFetch";

const basePadding = 10;

const Hero = styled("div")`
  text-align: center;
`;

const Photo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 2px solid #822dff;
`;

const Button = styled("button")`
  background-color: #381de8;
  padding: 16px 22px;
  border-radius: ${basePadding}px;
  border: none;
  color: white;
  font-size: 18px;
  box-shadow: 0 1px 2px rgba(50, 50, 93, 0.11), 0 1px 2px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  &:active {
    box-shadow: 0 2px 4px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
`;

const Tweeter = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: ${props => !props.noPadding && basePadding * 2}px;
  border-radius: ${basePadding}px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  cursor: pointer;

  &:hover {
    background-color: #fafafa;
  }

  &:active {
    box-shadow: 0 2px 4px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  }
`;

const Flex = styled("div")`
  display: flex;
  align-items: center;
`;

class TweetLink extends React.Component {
  render() {
    const { tweeter, ...props } = this.props;
    return (
      <Link
        as={
          tweeter.openTweetCount > 0
            ? `/${tweeter.handle}/vote`
            : `/${tweeter.handle}`
        }
        href={
          tweeter.openTweetCount > 0
            ? `/vote?username=${tweeter.handle}`
            : `/tweet?username=${tweeter.handle}`
        }
      >
        <Tweeter>
          <Flex>
            <Photo src={tweeter.photo} />
            <Spacer inline small />
            <div>
              <h3 style={{ fontWeight: 500 }}>@{tweeter.handle}</h3>
              <Spacer size={0.2} />
              <div style={{ color: "#555" }}>
                {tweeter.followerCount} followers<Spacer inline small />
                {tweeter.openTweetCount > 0 && (
                  <Badge color={"#C310CC"}>{tweeter.openTweetCount} open</Badge>
                )}
              </div>
            </div>
          </Flex>
          <div>
            <i style={{ fontSize: 30 }} className="material-icons">
              keyboard_arrow_right
            </i>
          </div>
        </Tweeter>
      </Link>
    );
  }
}

@inject("store")
@observer
export default class Index extends React.Component {
  static async getInitialProps() {
    const tweetersQuery = `
      query Tweeters {
        tweeters {
          id
          handle
          photo
          followerCount
          openTweetCount
        }
      }`;
    const { tweeters } = await graphqlFetch(tweetersQuery);
    return { tweeters };
  }

  get sortedTweeters() {
    return this.props.tweeters.sort(
      (a, b) => b.followerCount - a.followerCount
    );
  }

  render() {
    return (
      <AppLayout>
        <Spacer size={2} />
        <Hero>
          <h1>Decide what crypto influencers say.</h1>
          <Spacer size={0.5} />
          <h3 style={{ fontWeight: 400 }}>
            SayToshi is Ethereum's decentralized social media manager.
          </h3>
        </Hero>
        <Spacer size={2} />
        {this.sortedTweeters.map(tweeter => (
          <div key={tweeter.id}>
            <div>
              <TweetLink tweeter={tweeter} />
            </div>
            <Spacer />
          </div>
        ))}
        <Spacer />
        <div style={{ textAlign: "center" }}>
          <Link href="/connect">
            <Button>Connect your own Twitter</Button>
          </Link>
        </div>

        <Spacer size={3} />
      </AppLayout>
    );
  }
}
