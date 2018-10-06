import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject("store")
@observer
export default class Airdrop extends Component {
  static getInitialProps({ req }) {
    return {
      airdropId: req.query.airdropId,
      failure: req.query.failure
    };
  }

  render() {
    console.log(this.props);
    if (this.props.airdropId) {
      // TODO: wait for token balance to increase, then update view
      return <div>Success.</div>;
    }
    return (
      <div>
        {this.props.failure === "claimed" && <div>You've already claimed your tokens!</div>}
        {this.props.failure === "other" && <div>Failure!</div>}
        Airdrop
        {this.props.store.currentAddress && (
          <a href={`/airdrop/to/${this.props.store.currentAddress}`}>Start</a>
        )}
      </div>
    );
  }
}
