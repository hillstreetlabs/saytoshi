import { observer, inject } from "mobx-react";
import Link from "next/link";
import Header from "../components/Header";

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
      <div>
        <Header />
        <div>This is the home page</div>
        <TweetLink username="elonmusk">Tweet here</TweetLink>
      </div>
    );
  }
}
