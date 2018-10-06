import { observer, inject } from "mobx-react";
import Link from "next/link";
import { withRouter } from "next/router";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Wrapper from "../components/Wrapper";

@inject("store")
@withRouter
@observer
export default class Queue extends React.Component {
  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Wrapper>
          <Header />
          <Subheader username={username} />
          <div>Queue</div>
        </Wrapper>
      </AppLayout>
    );
  }
}
