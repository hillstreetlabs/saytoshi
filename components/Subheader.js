import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import Link from "next/link";
import Spacer from "./Spacer";

const SubheaderLink = styled("a")`
  font-size: 18px;
  cursor: pointer;

  &:hover {
    border-bottom: 2px solid;
  }

  ${props =>
    props.selected &&
    `
    border-bottom: 2px solid #822DFF;
    color: #822DFF;
  `};
`;

@observer
export default class Subheader extends React.Component {
  render() {
    const { username, selected } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        <h1>@{username}</h1>
        <Spacer size={0.5} />
        <div>
          <Link as={`/${username}`} href={`/tweet?username=${username}`}>
            <SubheaderLink selected={selected === "tweet"}>Tweet</SubheaderLink>
          </Link>
          <Spacer inline />
          <Link as={`/${username}/queue`} href={`/queue?username=${username}`}>
            <SubheaderLink selected={selected === "queue"}>Queue</SubheaderLink>
          </Link>
          <Spacer inline />
          <Link as={`/${username}/vote`} href={`/vote?username=${username}`}>
            <SubheaderLink selected={selected === "vote"}>Voting</SubheaderLink>
          </Link>
        </div>
      </div>
    );
  }
}
