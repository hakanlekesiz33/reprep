import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../store';
import Head from 'next/head'
import { setSiteSettings } from '../store/actions/setSiteSettings';
import { fetchModels } from '../store/actions/requestPageActions';
import '../styles/Static/Home.scss';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

class Home extends Component {
  state = {
    brands: []
  }
  static async  getInitialProps({ ctx, store }) {

    const cstore = await store.getState()
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = cstore.umbracoContent.TR.homePageContent

    if (lang == "EN") {
      currentPage = cstore.umbracoContent.EN.homePageContent
    }
    else if (lang == "DE") {
      currentPage = cstore.umbracoContent.DE.homePageContent
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return {}
  }
  // async componentDidMount() {
  //   await this.props.dispatch(fetchModels()) //sayfa hazır olduktan sonra tüm markaların modelleri getiriyoruz
  //   const store = await this.props.getState();
  //   let brands = []
  //   store.requestPageItems.modelList.map(function (brand) {
  //     brands.push({
  //       imgSrc: 'http://www.tfmlager.com/Files/BrandLogos/' + brand.BrandLogo,
  //       alt: brand.BrandName,
  //     })
  //   })
  //   this.setState({ ...this.state, brands: brands })

  // }

  render() {
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
    return (
      <>
        <Head>
          <title>{currentPage.seo.pageTitle}</title>
        </Head>
        <main id="index" data-html-class="default homePage" data-body-class="default homePage" >
          <div className="showCase"
            style={{
              backgroundImage: "url(" + currentPage.showCaseImage + ")"
            }}
          >
            <h1 className="showCaseTitle hdr-A">
            {htmlToReactParser.parse(currentPage.showCaseTitle)}
            </h1>
            <a className="showCaseLink ff-H" href={currentPage.requestUrl}>
              {currentPage.requestName}
            </a>
          </div>
          <div className="brands">
            <img src="/static/images/logos/lg.svg" alt="lg-logo" className="lg"/>
            <img src="/static/images/logos/samsung.svg" alt="samsung-logo" className="samsung"/>
            <img src="/static/images/logos/apple.svg" alt="apple-logo" className="apple"/>
            <img src="/static/images/logos/huawei.svg" alt="huawei-logo" className="huawei"/>
            <img src="/static/images/logos/xiaomi.svg" alt="xiaomi-logo" className="xiaomi"/>
            <img src="/static/images/logos/sony.svg" alt="sony-logo" className="sony"/>
          </div>
        </main>
      </>
    )
  }
}

export default connect(initsStore)(Home);