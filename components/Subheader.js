import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import Link from "next/link";
import { withRouter } from "next/router";
import Spacer from "./Spacer";

const SubheaderLink = styled("a")`
  font-size: 20px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  transition: 0.15s;

  &:hover {
    background-color: #dadada;
  }

  ${props =>
    props.selected &&
    `
    background-color: #822DFF;
    color: white;
    pointer-events: none;
  `};
`;

const UnstyledLink = styled("a")`
  text-decoration: none;
  border-bottom: 1px solid transparent;
  color: inherit;

  &:hover {
    border-bottom: 1px solid #aaa;
  }
`;

@withRouter
@observer
export default class Subheader extends React.Component {
  componentDidMount() {}

  render() {
    const { username, selected, noNav } = this.props;
    return (
      <div style={{ textAlign: "center" }}>
        <h1>
          <UnstyledLink
            href={`https://twitter.com/${username}`}
            target="_blank"
          >
            @{username}
          </UnstyledLink>
        </h1>
        <Spacer />
        <div>
          <Link as={`/${username}`} href={`/tweet?username=${username}`}>
            <SubheaderLink selected={selected === "tweet"}>Tweet</SubheaderLink>
          </Link>
          <Spacer inline size={0.25} />
          <Link as={`/${username}/queue`} href={`/queue?username=${username}`}>
            <SubheaderLink selected={selected === "queue"}>Accepted</SubheaderLink>
          </Link>
          <Spacer inline size={0.25} />
          <Link as={`/${username}/vote`} href={`/vote?username=${username}`}>
            <SubheaderLink selected={selected === "vote"}>Voting</SubheaderLink>
          </Link>
        </div>
      </div>
    );
  }
}
