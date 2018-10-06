import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import Link from "next/link";

@observer
export default class Subheader extends React.Component {
  render() {
    const { username } = this.props;
    return (
      <div>
        <h1>@{username}</h1>

        <div>
          <Link as={`/${username}`} href={`/tweet?username=${username}`}>
            <a>Tweet</a>
          </Link>
          <Link as={`/${username}/queue`} href={`/queue?username=${username}`}>
            <a>Queue</a>
          </Link>
          <Link as={`/${username}/vote`} href={`/vote?username=${username}`}>
            <a>Voting</a>
          </Link>
        </div>
      </div>
    );
  }
}
