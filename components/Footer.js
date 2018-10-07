import { observer, inject } from "mobx-react";
import styled from "react-emotion";
import Spacer from "./Spacer";

export default class Footer extends React.Component {
  render() {
    return (
      <div>
        <Spacer />
        <div style={{ textAlign: "center" }}>
          Follow{" "}
          <a href="https://twitter.com/saytoshibot" target="_blank">
            @SayToshiBot on Twitter
          </a>. Built with 💜 at{" "}
          <a href="http://ethsanfrancisco.com" target="_blank">
            ETH San Francisco
          </a>.
        </div>
        <Spacer />
      </div>
    );
  }
}
