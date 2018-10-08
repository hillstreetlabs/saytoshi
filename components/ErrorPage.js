import React, { Component } from "react";
import styled from "react-emotion";
import { observer } from "mobx-react";
import Spacer from "./Spacer";

const Container = styled("div")`
  text-align: center;
  h1 {
    font-size: 36px;
    font-weight: bold;
  }
  p {
    font-size: 18px;
  }
`;

const BigIcon = styled("div")`
  & i {
    font-size: 48px;
  }
`;

@observer
export default class ErrorPage extends Component {
  render() {
    return (
      <Container>
        <Spacer />
        <BigIcon>
          <i className="material-icons">error_outline</i>
        </BigIcon>
        <Spacer small />
        {this.props.children}
        <Spacer />
      </Container>
    );
  }
}
