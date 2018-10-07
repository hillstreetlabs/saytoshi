import styled from "react-emotion";

export default styled("span")`
  display: inline-block;
  line-height: 1em;
  border-radius: 4px;
  padding: 5px 7px;
  background-color: ${props => (props.color ? props.color : "#333")};
  color: ${props => (props.textColor ? props.textColor : "#fff")};
  text-transform: uppercase;
  font-size: 0.7em;
  font-weight: 500;
  margin-top: -2px;
  vertical-align: middle;
`;
