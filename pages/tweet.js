import { observer, inject } from "mobx-react";
import Header from "../components/Header";

@inject("store")
@observer
export default class ProposeTweet extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div>Tweet page for @elonmusk</div>
      </div>
    );
  }
}
