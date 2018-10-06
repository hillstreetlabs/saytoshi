import styled from "react-emotion";

const Background = styled("div")`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 0;
  z-index: -2;
  background-image: linear-gradient(
    to top,
    #f3e7e9 0%,
    #e3eeff 99%,
    #e3eeff 100%
  );
`;

const Container = styled("div")`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
`;

export default class AppLayout extends React.Component {
  render() {
    return (
      <div>
        <Background />
        <Container>{this.props.children}</Container>
      </div>
    );
  }
}
