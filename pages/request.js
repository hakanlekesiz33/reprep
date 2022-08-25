import React, { Component } from 'react';
import Head from 'next/head'
import { connect } from 'react-redux';
import initsStore from '../store';
import { setSiteSettings } from '../store/actions/setSiteSettings';
import * as config from '../config'
import RequestBasket from '../components/Requests/BasketItems/requestBasket'
import RequestStep1Form from '../components/Forms/Requests/RequestStep1Form'
//import RequestStep2Form from '../components/Forms/Requests/RequestStep2Form'
import RequestStep3Form from '../components/Forms/Requests/RequestStep3Form'
import RequestStep4Form from '../components/Forms/Requests/RequestStep4Form'
import RequestStep5Form from '../components/Forms/Requests/RequestStep5Form'
import RequestStep6Form from '../components/Forms/Requests/RequestStep6Form'
import RequestStep7Form from '../components/Forms/Requests/RequestStep7Form'
import RequestStep8Form from '../components/Forms/Requests/RequestStep8Form'
import RequestStep9Form from '../components/Forms/Requests/RequestStep9Form'
import RequestStep10Form from '../components/Forms/Requests/RequestStep10Form'
import RequestStep11Form from '../components/Forms/Requests/RequestStep11Form'
import RequestStep12Form from '../components/Forms/Requests/RequestStep12Form'
import RequestSummaryStep from '../components/Forms/Requests/RequestSummaryStep'
import '../styles/Static/Request.scss';

class Request extends Component {
  static async  getInitialProps({ store, req }) {
    //seo açısından önemli bilgileri backend'de çekeceğiz
    let cstore = await store.getState();
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = cstore.umbracoContent.TR.requestPageContent

    if (lang == "EN") {
      currentPage = cstore.umbracoContent.EN.requestPageContent
    }
    else if (lang == "DE") {
      currentPage = cstore.umbracoContent.DE.requestPageContent
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return {}
  }

  renderSwitch(step) {

    switch (step) {
      case 'requestStep1':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep1Form />
        }
      // case 'requestStep2':
      //   {
      //     this.changeClassNamesAccordingStep("pg-B", "pg-A")
      //     return <RequestStep2Form />
      //   }
      case 'requestStep3':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep3Form />
        }
      case 'requestStep4':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep4Form />
        }
      case 'requestStep5':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep5Form />
        }
      case 'requestStep6':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep6Form />
        }
      case 'requestStep7':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep7Form />
        }
      case 'requestStep8':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep8Form />
        }
      case 'requestStep9':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep9Form />
        }
      case 'requestStep10':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep10Form />
        }
      case 'requestStep11':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep11Form />
        }
      case 'requestStep12':
        {
          this.changeClassNamesAccordingStep("pg-B", "pg-A")
          return <RequestStep12Form />
        }
      case 'requestSummaryStep':
        {
          this.changeClassNamesAccordingStep("pg-A", "pg-B")
          return <RequestSummaryStep />
        }
      default:
        return null;
    }
  }
  changeClassNamesAccordingStep(removeClass, addClass) {
    document.getElementsByTagName('body')[0].classList.remove(removeClass)
    document.getElementsByTagName('body')[0].classList.add(addClass)
  }

  componentDidMount() {

    let continueFromLocalStorage = true
    let isLogin = false
    let user
    //localStorage dolu ise
    if (localStorage.getItem('userRequestSteps') != null) {
      const expireDate = JSON.parse(localStorage.getItem('userRequestSteps')).expireDate;
      //localStorage tarihi geçmemiş ise
      if (((new Date().getTime())) < expireDate + config.expireDate * 24 * 3600 * 1000) {
        continueFromLocalStorage = false;//false olması tarihi geçmemiş anlamına gelir
      }
      //tarihi geçmiş ise siliyor
      else {
        localStorage.removeItem('userRequestSteps');
      }
    }

    //login olmuş kullanıcı var ise
    if (sessionStorage.getItem('userLogin') != null) {
      if (((new Date().getTime())) < JSON.parse(sessionStorage.getItem('userLogin')).expireDate + config.expireDate * 24 * 3600 * 1000) {
        user = JSON.parse(sessionStorage.getItem('userLogin')).user
        isLogin = true
      }
    }

    //localStorage dolu, tarihi geçmemiş ise 
    if (!continueFromLocalStorage) {
      //kullanıcı login ise
      if (isLogin) {

        const requestStep1FormData = {
          name: user.name != null ? user.name : "",
          email: user.email != null ? user.email : "",
          id: user.id != null ? user.id : ""
        }
        const requestStep7FormData = {
          name: user.name != null ? user.name : "",
          lastName: user.lastName != null ? user.lastName : "",
          phone: user.phone != null ? user.phone : "",
        }
        const requestStep8FormData = {
          adress: user.adress != null ? user.adress : "",
          postCode: user.postalCode != null ? user.postalCode : "",
        }
        const beforeRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'))
        //const currStep = beforeRequestSteps.currentRequestStep == 'requestStep1' ? 'requestStep2' : beforeRequestSteps.currentRequestStep
        const currStep = beforeRequestSteps.currentRequestStep == 'requestStep1' ? 'requestStep3' : beforeRequestSteps.currentRequestStep
        const userRequestSteps = {
          isLogin: true,
          expireDate: new Date().getTime(),
          requestStep7FormData,
          requestStep8FormData,
          ...beforeRequestSteps,
          comeFrom: 'server',
          currentRequestStep: currStep,
          requestStep1FormData
        }
        //localStorage'a kayıt edildi
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps))

        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }))
      }
      else {
        const beforeRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'))
        const userRequestSteps = {
          ...beforeRequestSteps,
          comeFrom: 'server'
        }
        //localStorage'a kayıt edildi
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps))

        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }))
      }
    }
    //localStorage boş ise
    else if (continueFromLocalStorage) {
      if (isLogin) {
        const requestStep1FormData = {
          name: user.name != null ? user.name : "",
          email: user.email != null ? user.email : "",
          id: user.id != null ? user.id : ""
        }
        const requestStep7FormData = {
          name: user.name != null ? user.name : "",
          lastName: user.lastName != null ? user.lastName : "",
          phone: user.phone != null ? user.phone : "",
        }
        const requestStep8FormData = {
          adress: user.adress != null ? user.adress : "",
          postCode: user.postalCode != null ? user.postalCode : "",
        }
        const userRequestSteps = {
          isLogin: true,
          expireDate: new Date().getTime(),
          requestStep1FormData,
          requestStep7FormData,
          requestStep8FormData,
          //currentRequestStep: 'requestStep2',
          currentRequestStep: 'requestStep3',
          comeFrom: 'server'
        }
        //localStorage'a kayıt edildi
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }))
      }
      else {
        //umbracodan gelen ilk step'i user ın steplerine kayıt ediyoruz
        const currStep = this.props.getState().siteSettings.currentPage.requestSteps[0].contentTypeAlias;
        const userRequestSteps = {
          currentRequestStep: currStep,
          comeFrom: 'server'
        }
        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }))
      }
    }
  }

  render() {
    const { currentPage, commonDictionary, userRequestSteps } = this.props.getState().siteSettings;
    return (
      <>
        <Head>
          <title>{currentPage.seo.pageTitle}</title>
        </Head>

        <main id="request" className="requestFinalSummary" data-html-class="" data-body-class="pg-A">

          {this.renderSwitch(userRequestSteps.currentRequestStep)}


          {/* <div className="requestHint">
            <RequestHint />
          </div> */}
        </main>
        <RequestBasket />

      </>
    )
  }
}

export default connect(initsStore)(Request);