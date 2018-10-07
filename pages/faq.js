import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { withRouter } from "next/router";
import Link from "next/link";
import styled from "react-emotion";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import { Box, basePadding } from "./tweet";

const Text = styled("div")`
  font-size: 16px;
  line-height: 1.3;
`;

@inject("store")
@withRouter
@observer
export default class Faq extends React.Component {
  render() {
    return (
      <AppLayout>
        <Box>
          <h1>FAQ</h1>
          <Spacer />
          <h3>Who built SayToshi?</h3>
          <Spacer size={0.25} />
          <Text>
            <a href="https://twitter.com/GrahamKaemmer" target="_blank">
              @GrahamKaemmer
            </a>,{" "}
            <a href="https://twitter.com/nemild" target="_blank">
              @nemild
            </a>,{" "}
            <a href="https://twitter.com/mtl678" target="_blank">
              @mtl678
            </a>, and{" "}
            <a href="https://twitter.com/pfletcherhill" target="_blank">
              @pfletcherhill
            </a>{" "}
            built SayToshi at{" "}
            <a href="https://ethsanfrancisco.com/" target="_blank">
              ETH San Francisco
            </a>.
          </Text>
          <Spacer />
          <Text>More info coming soon...</Text>
        </Box>
      </AppLayout>
    );
  }
}
