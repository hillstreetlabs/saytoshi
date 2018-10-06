import React, { Component } from "react";
import styled from "react-emotion";
import Spacer from "./Spacer";

const lightGrey = "#f6f9fc";

const Line = styled("hr")`
  margin: 0;
  padding: 0;
  border: none;
  ${props =>
    props.inline
      ? `border-right: 1px solid ${props.color || lightGrey}`
      : `border-bottom: 1px solid ${props.color || lightGrey}`};
  height: ${props => (props.inline ? "100%" : 0)};
  width: ${props => (props.inline ? 0 : "100%")};
`;

export default class Divider extends Component {
  render() {
    let { padded, inline, color, ...props } = this.props;
    const size = parseFloat(padded) || 1;
    return (
      <React.Fragment>
        {padded && <Spacer inline={inline} size={size} />}
        <Line color={color} inline={inline} {...props} />
        {padded && <Spacer inline={inline} size={size} />}
      </React.Fragment>
    );
  }
}
