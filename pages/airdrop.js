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

  &:disabled {
    opacity: 0.6;
  }
`;

@inject("store")
@withRouter
@observer
export default class Airdrop extends React.Component {
  @observable isLoading = false;

  static getInitialProps({ req }) {
    if (!req) return {};
    return {
      airdropId: req.query.airdropId,
      failure: req.query.failure
    };
  }

  render() {
    if (this.props.airdropId) {
      // TODO: wait for token balance to increase, then update view
      return (
        <AppLayout>
          <Box>
            <div style={{ textAlign: "center" }}>
              <h1 style={{ fontSize: 60 }}>🙌</h1>
              <h3 style={{ fontWeight: 400 }}>
                You've been minted TWEETH tokens.
              </h3>
              <Spacer />
            </div>
            <Link href="/">
              <Button>Start using SayToshi</Button>
            </Link>
          </Box>
        </AppLayout>
      );
    }
    if (this.props.failure === "claimed") {
      return (
        <AppLayout>
          <Box>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ fontWeight: 400 }}>
                You've already claimed your tokens.
              </h3>
            </div>
            <Spacer />
            <Link href="/">
              <Button>Continue using SayToshi</Button>
            </Link>
          </Box>
        </AppLayout>
      );
    }
    if (this.props.failure === "other") {
      return (
        <AppLayout>
          <Box>
            <div>Failure!</div>
          </Box>
        </AppLayout>
      );
    }
    return (
      <AppLayout>
        <Box>
          <div style={{ textAlign: "center" }}>
            <img src="/static/ethsf.svg" style={{ width: "40%" }} />
            <Spacer size={0.5} />
            <h2 style={{ color: "#822DFF" }}>Claim your TWEETH</h2>
            <Spacer size={0.5} />
            <h3 style={{ fontWeight: 400 }}>
              We're airdropping tokens to every hacker at ETH San Francisco.
            </h3>
          </div>
          <Spacer />
          {this.props.store.hasWeb3 ? (
            <a
              href={`/airdrop/to/${this.props.store.currentAddress}`}
              style={{ textDecoration: "none" }}
            >
              <Button
                disabled={this.isLoading}
                onClick={() => (this.isLoading = true)}
              >
                {this.isLoading
                  ? "Authenticating..."
                  : "Authenticate with Github"}
              </Button>
            </a>
          ) : (
            <Alert>
              Please make sure you are connected to Ethereum and your wallet is
              unlocked.
            </Alert>
          )}
          {this.isLoading && (
            <div style={{ textAlign: "center" }}>
              <Spacer small />
              <small>This can take a moment!</small>
            </div>
          )}
        </Box>
      </AppLayout>
    );
  }
}
