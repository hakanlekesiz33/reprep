import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../store';
import Head from 'next/head'
import { setSiteSettings } from '../store/actions/setSiteSettings';

class page404 extends Component {

  static async  getInitialProps({ ctx, store }) {
    const cstore = await store.getState()
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = cstore.umbracoContent.TR.page404Content
    if (lang == "EN") {
      currentPage = cstore.umbracoContent.EN.page404Content
    }
    else if (lang == "DE") {
      currentPage = cstore.umbracoContent.DE.page404Content
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return {}
  }

  render() {
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;

    return (
      <>
        <Head>
          <title>{currentPage.seo.pageTitle}</title>
        </Head>
        <main id="page404" data-html-class="default" data-body-class="default">
          <h3 className="hdr-D">
          {currentPage.enterTitle}
          </h3>
          <a href="/" className="lnk-B">
          {currentPage.desc}
          </a>

        </main>
      </>
    )
  }
}

export default connect(initsStore)(page404);