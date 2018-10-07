import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { withRouter } from "next/router";
import Link from "next/link";
import styled from "react-emotion";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Divider from "../components/Divider";
import graphqlFetch from "../web/graphqlFetch";
import { Box, Alert, basePadding } from "./tweet";
import first from "lodash/first";

const Button = styled("button")`
  background-color: #822dff;
  color: white;
  width: 100%;
  display: block;
  font-size: 18px;
  border: none;
  padding: ${basePadding * 2}px ${basePadding}px;
  border-radius: ${basePadding / 2}px;
  cursor: pointer;
`;

@inject("store")
@withRouter
@observer
export default class Revoke extends React.Component {
  render() {
    return (
      <AppLayout>
        <Box>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 60 }}>🤑</h1>
            <h2 style={{ fontWeight: 500 }}>Make money from your following.</h2>
            <Spacer />
            <h3 style={{ fontWeight: 400, color: "#555" }}>
              Connect your Twitter. The SayToshi community will pay to tweet as
              you. Revoke access at any time.
            </h3>
          </div>
          <Spacer size={1.5} />
          {this.props.store.hasWeb3 ? (
            <a href={`/auth/twitter`} style={{ textDecoration: "none" }}>
              <Button>Connect Twitter</Button>
            </a>
          ) : (
            <Alert>
              Please make sure you are connected to Ethereum and your wallet is
              unlocked.
            </Alert>
          )}
        </Box>
      </AppLayout>
    );
  }
}
