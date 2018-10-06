import { observer, inject } from "mobx-react";
import Link from "next/link";
import styled from "react-emotion";
import Header from "../components/Header";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Wrapper from "../components/Wrapper";

const Hero = styled("div")`
  text-align: center;
`;

class TweetLink extends React.Component {
  render() {
    const { username, children } = this.props;
    return (
      <Link as={`/${username}`} href={`/tweet?username=${username}`}>
        <a>{children}</a>
      </Link>
    );
  }
}

@inject("store")
@observer
export default class Index extends React.Component {
  render() {
    return (
      <AppLayout>
        <Wrapper>
          <Header />
          <Spacer size={2} />
          <Hero>
            <h1>Your chance to decide what influencers say.</h1>
            <Spacer size={0.5} />
            <h3>SayToshi is Ethereum's decentralized social media manager.</h3>
          </Hero>
          <Spacer size={2} />
          <TweetLink username="elonmusk">Tweet for @elonmusk</TweetLink>
        </Wrapper>
      </AppLayout>
    );
  }
}
