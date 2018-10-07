import { observer, inject } from "mobx-react";
import Link from "next/link";
import { withRouter } from "next/router";
import styled from "react-emotion";
import Header from "../components/Header";
import Subheader from "../components/Subheader";
import AppLayout from "../components/AppLayout";
import Spacer from "../components/Spacer";
import Divider from "../components/Divider";
import Wrapper from "../components/Wrapper";

const basePadding = 10;

export const Box = styled("div")`
  background-color: white;
  padding: ${props => !props.noPadding && basePadding * 2}px;
  border-radius: ${basePadding}px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Textarea = styled("textarea")`
  width: 100%;
  padding: ${basePadding * 1.5}px ${basePadding}px;
  font-size: ${basePadding * 2}px;
  background-color: #eee;
  border-radius: ${basePadding / 2}px;
  border: none;
  font-family: Roboto, sans-serif;
  resize: none;
`;

const InputGroup = styled("div")`
  display: flex;
  align-items: center;
  width: 100%;
  background-color: #eee;
  border-radius: ${basePadding / 2}px;

  & label {
    text-align: right;
    padding: 0 ${basePadding}px;
  }
`;

const Input = styled("input")`
  padding: ${basePadding * 1.5}px ${basePadding}px;
  font-size: ${basePadding * 3}px;
  width: 90%;
  background-color: transparent;
  border: none;
`;

const Button = styled("button")`
  background-color: #822dff;
  color: white;
  width: 100%;
  display: block;
  font-size: 18px;
  padding: ${basePadding * 2}px ${basePadding}px;
  border-radius: ${basePadding / 2}px;
  cursor: pointer;
`;

const FormHeading = styled("h2")`
  font-size: ${basePadding * 2}px;
  font-weight: 500;
`;

@inject("store")
@withRouter
@observer
export default class ProposeTweet extends React.Component {
  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Spacer />
        <Subheader username={username} selected="tweet" />
        <Spacer size={1.5} />
        <Box>
          <FormHeading>
            What do you want{" "}
            <strong style={{ fontWeight: 600, textDecoration: "underline" }}>
              @{username}
            </strong>{" "}
            to say?
          </FormHeading>
          <Spacer />
          <Textarea placeholder={"Type your tweet here."} rows={5} />
          <Spacer />
          <FormHeading>How much are you staking on this tweet?</FormHeading>
          <Spacer size={0.5} />
          <h4 style={{ fontWeight: 400, color: "#555" }}>
            If your tweet isn't approved, you'll lose this money.
          </h4>
          <Spacer />
          <InputGroup>
            <Input />
            <label>TWEETH</label>
          </InputGroup>
          <Spacer size={1.25} />
          <Button>
            Propose tweet for{" "}
            <strong style={{ fontWeight: 600 }}>@{username}</strong>
          </Button>
        </Box>
        <Spacer />
      </AppLayout>
    );
  }
}
