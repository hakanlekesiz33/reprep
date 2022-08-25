import React from 'react';
import App from 'next/app';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import Layout from '../components/Layout';
import initsStore from '../store';
import { setSiteSettings } from '../store/actions/setSiteSettings';
import { fetchUmbracoContent } from '../store/actions/umbracoContentActions';
import { fetchUserInfo } from '../store/actions/loginUser';
import * as config from '../config';
import { initFeux } from '../static/common.js';
import Router from 'next/router'

import '../styles/Form/Buttons.scss';
import '../styles/Form/TextBoxes.scss';
import '../styles/Form/FormElements.scss';
import '../styles/Form/Textareas.scss';
import '../styles/Form/Radios.scss';
import '../styles/Form/Selects.scss';
import '../styles/Form/Checkboxes.scss';
import '../styles/Base/Reset.scss';
import '../styles/Base/Shared.scss';
import '../styles/Base/Media.scss';
import '../styles/Misc/Tooltip.scss';
import '../styles/Page/Components.scss';
import '../styles/Page/Structure.scss';
import '../styles/Page/Footer.scss';
import '../styles/Page/Header.scss';
import '../styles/Page/Menu.scss';
import '../styles/Typography/Font.scss';
import '../styles/Typography/Faces.scss';
import '../styles/Typography/Headers.scss';
import '../styles/Typography/Links.scss';
import '../styles/Typography/Paragraphs.scss';

class MyApp extends App {
  static async getInitialProps({ Component, ctx, store }) {
    let pageProps = {}

    if (ctx.req) { //server Side
      await ctx.store.dispatch(fetchUmbracoContent());
    }
    else { //client Side
    }

    //sitenin dilini url den tespit ediyoruz
    let cStore = await ctx.store.getState()
    let curPath = ctx.asPath.split("?")[0]

    if (curPath.endsWith('/') && curPath.length > 1) {
      curPath = curPath.substring(0, curPath.length - 1)
    }
    
    let currLang = cStore.umbracoContent.siteMap.filter((page) => page.url == curPath)
    let currPageLangSettings = {}
    let goUmbPage = true
    if (currLang.length == 0) {  //umbracodaki url'ler ile eşleşmiyor ise default page a yönlendireceğiz

      currLang = cStore.umbracoContent.siteMap.filter((page) => page.jsFile == curPath)

      if (currLang.length == 0) {  //default page ler içindede yoksa 404 sayfasına yönlendireceğiz
        goUmbPage = false
        if (ctx.req) {
          ctx.res.redirect('/page404')
        } else {
          Router.push('/page404')
        }

      }

    }
    if (goUmbPage) {
      
      currPageLangSettings = currLang[0]
      let commonDictionary = cStore.umbracoContent.TR.commonDictionary
      let sharedContent = cStore.umbracoContent.TR.sharedContent
      if (currPageLangSettings.lang == "EN") {
        commonDictionary = cStore.umbracoContent.EN.commonDictionary
        sharedContent = cStore.umbracoContent.EN.sharedContent
      }
      else if (currPageLangSettings.lang == "DE") {
        commonDictionary = cStore.umbracoContent.DE.commonDictionary
        sharedContent = cStore.umbracoContent.DE.sharedContent
      }
      await ctx.store.dispatch(setSiteSettings({
        currPageLangSettings: currPageLangSettings,
        commonDictionary: commonDictionary,
        sharedContent: sharedContent
      }));

    }

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    return { pageProps, store }
  }


  componentDidMount() {
    const Feux = initFeux()
    const _appStore = this.props.store

    if (sessionStorage.getItem('userLogin') != null) {
      const beforeUserLogin = JSON.parse(sessionStorage.getItem('userLogin'))
      const userLogin = {
        ...beforeUserLogin
      }
      _appStore.dispatch(fetchUserInfo(userLogin))
    }
    else {
      if (localStorage.getItem('userLogin') != null) {

        const expireDate = JSON.parse(localStorage.getItem('userLogin')).expireDate;
        //token süresi geçmemiş ise
        if (((new Date().getTime())) < expireDate + config.expireDate * 24 * 3600 * 1000) {

          const beforeUserLogin = JSON.parse(localStorage.getItem('userLogin'))
          const userLogin = {
            ...beforeUserLogin
          }
          sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
          _appStore.dispatch(fetchUserInfo(userLogin))
        }
        else {
          localStorage.removeItem('userLogin');//tarihi geçmiş ise siliyor
        }
      }
    }
  }

  render() {
    const { Component, pageProps, store } = this.props

    return (
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    )
  }
}
export default withRedux(initsStore)(MyApp);