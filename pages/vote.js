import { observer, inject } from "mobx-react";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";

@inject("store")
@withRouter
@observer
export default class Vote extends React.Component {
  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Header />
        <Subheader username={username} />
        <div>vote</div>
      </AppLayout>
    );
  }
}
