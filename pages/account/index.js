import React, { Component } from 'react';
import Head from 'next/head'
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import Router from 'next/router';
import Yaybar from '../../components/RootUI/Profile/yaybar';
import Navbar from '../../components/RootUI/Profile/navbar';
import Content from '../../components/RootUI/Profile/content';
import '../../styles/RootUI/vendor.scss';
import '../../styles/RootUI/bootstrap-custom.scss';
import '../../styles/RootUI/rootui.scss';
import '../../styles/Static/Profile.scss';

class Profile extends Component {

  static async  getInitialProps({ ctx, store }) {

    const cstore = await store.getState()
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = cstore.umbracoContent.TR.accountPageContent

    if (lang == "EN") {
      currentPage = cstore.umbracoContent.EN.accountPageContent
    }
    else if (lang == "DE") {
      currentPage = cstore.umbracoContent.DE.accountPageContent
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return {}
  }
 
  componentDidMount() {
    let isNotAuth = sessionStorage.getItem('userLogin') == null
    isNotAuth = isNotAuth ? true : !(new Date().getTime() < JSON.parse(sessionStorage.getItem('userLogin')).expireDate + 30 * 24 * 3600 * 1000)

    if (isNotAuth) {
      Router.push("/", "/")
    }

  }

  render() {
    const store = this.props.getState()
    const { currentPage } = this.props.getState().siteSettings;

    if (store.loginUser.isAuth || store.loginUser.user != null) {
      return (
        <>
          <Head>
            <title>{currentPage.seo.pageTitle}</title>
          </Head>

          <main id="profile" data-html-class="bootstrap-custom vendor-custom rootui-custom" data-body-class="pg-C rui-navbar-autohide rui-section-lines rui-navbar-show">
            <Yaybar />
            <Navbar />
            <Content />
          </main>
        </>
      )

    }
    else {
      return (
        <main id="profile" data-html-class="bootstrap-custom vendor-custom rootui-custom" data-body-class="pg-C rui-navbar-autohide rui-section-lines rui-navbar-show"></main>
      )
    }

  }
}

export default connect(initsStore)(Profile);