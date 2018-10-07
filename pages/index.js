import { observer, inject } from "mobx-react";
import Link from "next/link";
import styled from "react-emotion";
import Header from "../components/Header";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Wrapper from "../components/Wrapper";
import graphqlFetch from "../web/graphqlFetch";

const Hero = styled("div")`
  text-align: center;
`;

const Photo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

class TweetLink extends React.Component {
  render() {
    const { username, children, ...props } = this.props;
    return (
      <Link as={`/${username}`} href={`/tweet?username=${username}`}>
        <a {...props}>{children}</a>
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
        }
      }`;
    const { tweeters } = await graphqlFetch(tweetersQuery);
    return { tweeters };
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
        {this.props.tweeters.map(tweeter => (
          <div key={tweeter.id}>
            <TweetLink
              username={tweeter.handle}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <Photo src={tweeter.photo} />
              <Spacer inline small />
              <span>
                Tweet for @{tweeter.handle} <Spacer inline small />
                <small>({tweeter.followerCount} followers)</small>
              </span>
            </TweetLink>
          </div>
        ))}
        <Spacer size={3} />
      </AppLayout>
    );
  }
}
