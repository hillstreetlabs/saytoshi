import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { withRouter } from "next/router";
import Link from "next/link";
import styled from "react-emotion";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Divider from "../components/Divider";
import graphqlFetch from "../web/graphqlFetch";
import { Box, basePadding } from "./tweet";
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
            <h2 style={{ fontWeight: 400 }}>Revoke access to your Twitter</h2>
          </div>
          <Spacer />
          <a href={`/auth/twitter`} style={{ textDecoration: "none" }}>
            <Button>Revoke SayToshi access</Button>
          </a>
        </Box>
      </AppLayout>
    );
  }
}
