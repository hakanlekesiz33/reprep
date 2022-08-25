import React, { Component } from 'react';
import Head from 'next/head'
import { setSiteSettings } from '../store/actions/setSiteSettings';
import Link from 'next/link';
import '../styles/Static/About.scss';


class About extends Component {
  static async  getInitialProps({ store, req }) {
    return {}
  }

  render() {

    return (
      <>
        <Head>
          <title>About</title>
        </Head>
        <main id="about" data-html-class="default" data-body-class="default">
          About
        <Link href={"/"}>
            <a className="subItem">
              Home
            </a>
          </Link>
        </main>
      </>
    )
  }
}

export default About;