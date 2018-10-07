import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import { withRouter } from "next/router";
import Link from "next/link";
import Spacer from "./Spacer";
import { utils } from "ethers";

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

const Button = styled("button")`
  background-color: #381de8;
  color: white;
  width: 100%;
  display: block;
  font-size: 18px;
  border: none;
  padding: 7px 12px;
  border-radius: 5px;
  cursor: pointer;
`;

const AccountButton = styled("div")`
  padding: 5px 10px;
  margin: -5px -10px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #dadada;
  }
`;

@inject("store")
@withRouter
@observer
export default class Header extends React.Component {
  render() {
    const { tokenBalance } = this.props.store;
    return (
      <div>
        <Spacer />
        <HeaderContainer>
          <Link href="/">
            <Logo src="/static/logo.png" />
          </Link>
          <div style={{ textAlign: "right" }}>
            {tokenBalance && tokenBalance > 0 ? (
              <Link href="/account">
                <AccountButton>
                  <div>Balance</div>
                  <div>
                    {utils.formatEther(this.props.store.tokenBalance)}{" "}
                    <small>TWEETH</small>
                  </div>
                </AccountButton>
              </Link>
            ) : (
              <Link href="/airdrop">
                <Button>💸 Airdrop</Button>
              </Link>
            )}
          </div>
        </HeaderContainer>
        <Spacer />
      </div>
    );
  }
}
