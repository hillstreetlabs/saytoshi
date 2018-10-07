import React, { Component } from "react";
import { observer, inject } from "mobx-react";

@inject("store")
@observer
export default class Connect extends Component {
  render() {
    console.log(this.props);
    return (
      <div>
        Connect twitter
        {this.props.store.currentAddress && <a href={`/auth/twitter`}>Start</a>}
      </div>
    );
  }
}
