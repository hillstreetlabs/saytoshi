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

const basePadding = 14;

const Box = styled("div")`
  background-color: white;
  padding: ${props => !props.noPadding && basePadding * 2}px;
  border-radius: ${basePadding}px;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
`;

const Textarea = styled("textarea")`
  width: 100%;
  padding: ${basePadding}px;
  font-size: 28px;
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
  padding: ${basePadding}px;
  font-size: 30px;
  width: 90%;
  background-color: transparent;
  border: none;
`;

const Button = styled("button")`
  background-color: #822dff;
  color: white;
  width: 100%;
  display: block;
  font-size: 22px;
  padding: ${basePadding * 1.5}px;
  border-radius: ${basePadding / 2}px;
`;

@inject("store")
@withRouter
@observer
export default class ProposeTweet extends React.Component {
  render() {
    const { username } = this.props.router.query;
    return (
      <AppLayout>
        <Wrapper>
          <Header />
          <Subheader username={username} />
          <Box>
            <h2>What do you want @{username} to say?</h2>
            <Spacer size={0.5} />
            <Textarea placeholder={"Type your tweet here."} rows={3} />
            <Spacer />
            <h2>How much are you staking on this tweet?</h2>
            <Spacer size={0.5} />
            <InputGroup>
              <Input />
              <label>TWEETH</label>
            </InputGroup>
            <Spacer />
            <Button>Propose tweet for @{username}</Button>
          </Box>
          <Spacer />
        </Wrapper>
      </AppLayout>
    );
  }
}
