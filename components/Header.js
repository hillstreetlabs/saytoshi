import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import { withRouter } from "next/router";
import Link from "next/link";
import Spacer from "./Spacer";

const HeaderContainer = styled("div")`
  width: 100%;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled("img")`
  height: 100%;
  cursor: pointer;
`;

@inject("store")
@withRouter
@observer
export default class Header extends React.Component {
  render() {
    return (
      <div>
        <Spacer />
        <HeaderContainer>
          <Link href="/">
            <Logo src="/static/logo.png" />
          </Link>
          <div style={{ textAlign: "right" }}>
            <div>Balance</div>
            <div>
              20 <small>TWEETH</small>
            </div>
          </div>
        </HeaderContainer>
        <Spacer />
      </div>
    );
  }
}
