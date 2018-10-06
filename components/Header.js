import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import Link from "next/link";

const HeaderContainer = styled("div")`
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled("img")`
  height: 100%;
`;

@inject("store")
@observer
export default class Header extends React.Component {
  render() {
    return (
      <HeaderContainer>
        <Link href="/">
          <Logo src="/static/logo.png" />
        </Link>
        <div>
          <div>{this.props.store.currentAddress}</div>
          <div>Balance TODO</div>
        </div>
      </HeaderContainer>
    );
  }
}
