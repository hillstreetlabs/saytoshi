import { observer, inject } from "mobx-react";

@inject("store")
@observer
export default class Index extends React.Component {
  render() {
    return <div>Hello! {this.props.store.currentAddress} </div>;
  }
}
