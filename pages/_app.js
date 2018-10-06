import App, { Container } from "next/app";
import Head from "next/head";
import React from "react";
import { observer, Provider } from "mobx-react";
import Store from "../web/Store";

export default class MyApp extends App {
  store = new Store();

  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  componentDidMount() {
    this.store.start();

    window.store = this.store;
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>SayToshi | Ethereum's social media manager</title>
        </Head>
        <Provider store={this.store}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}
