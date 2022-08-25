import Head from 'next/head'
import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../store';
import { setSiteSettings } from '../store/actions/setSiteSettings';
import RequestBasket from '../components/Requests/BasketItems/requestBasket'
import RequestSummaryStep from '../components/Forms/Requests/RequestSummaryStep'
import '../styles/Static/Request.scss';
import '../styles/Static/Final.scss';

class Final extends Component {
  static async  getInitialProps({ store, req }) {
    //seo açısından önemli bilgileri backend'de çekeceğiz
    let cstore = await store.getState();
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = cstore.umbracoContent.TR.requestFinalPageContent

    if (lang == "EN") {
      currentPage = cstore.umbracoContent.EN.requestFinalPageContent
    }
    else if (lang == "DE") {
      currentPage = cstore.umbracoContent.DE.requestFinalPageContent
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return {}
  }

  state = {
    finalPageProps: null
  }

  componentDidMount() {
    const finalPageProps = sessionStorage.getItem("finalPageProps") != null ? JSON.parse(sessionStorage.getItem("finalPageProps")) : null
    if (sessionStorage.getItem("userRequestSteps") != null) {
      this.props.dispatch(setSiteSettings({finalPageProps:finalPageProps, userRequestSteps: JSON.parse(sessionStorage.getItem("userRequestSteps")) }));
    }

    this.setState({ ...this.state, finalPageProps: finalPageProps })
  }

  render() {
    if (this.state.finalPageProps != null) {
    const { currentPage, commonDictionary, userRequestSteps } = this.props.getState().siteSettings;
    return (
        <>
         <Head>
           <title>{currentPage.seo.pageTitle}</title>
        </Head>

          <main id="final" className="requestFinalSummary" data-html-class="" data-body-class="pg-B">

            <RequestSummaryStep page="final"/>
          </main>
            <RequestBasket page="final"/>
        </>
      )
    }
    else {
      return (
        <>
          <Head>
            <title>Final</title>
          </Head>
          <main id="final" data-html-class="" data-body-class="pg-B">
            oluşturulmuş bir ticket bulunmmamakta (umbraco eklenmeli)
          </main>
        </>
      )
    }
  }
}

export default connect(initsStore)(Final);