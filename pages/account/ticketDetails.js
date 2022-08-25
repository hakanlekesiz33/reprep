import React, { Component } from 'react';
import Head from 'next/head'
import { connect } from 'react-redux';
import initsStore from '../../store';
import { fetchModels } from '../../store/actions/requestPageActions';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import * as config from '../../config';
import Router from 'next/router';
import Link from 'next/link';
import Yaybar from '../../components/RootUI/Profile/yaybar';
import Navbar from '../../components/RootUI/Profile/navbar';
import Carousel from '../../components/UI/Swipper/carousel';
import DataTableComp from '../../components/UI/DataTableComp';

import '../../styles/RootUI/vendor.scss';
import '../../styles/RootUI/bootstrap-custom.scss';
import '../../styles/RootUI/rootui.scss';
import '../../styles/Static/Profile.scss';
import '../../styles/Static/TicketDetails.scss';


const axios = require('axios');

class TicketDetails extends Component {
  state = {
    modelImgaUrl: "",
    city: "",
    country: "",
    showPassCode: false
  }

  static async getInitialProps({ ctx, store, query }) {

    const cstore = await store.getState()
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = {
      ...cstore.umbracoContent.TR.ticketDetailsPageContent,
      requestPageContent: cstore.umbracoContent.TR.requestPageContent
    }

    if (lang == "EN") {
      currentPage = {
        ...cstore.umbracoContent.EN.ticketDetailsPageContent,
        requestPageContent: cstore.umbracoContent.EN.requestPageContent
      }
    }
    else if (lang == "DE") {
      currentPage = {
        ...cstore.umbracoContent.DE.ticketDetailsPageContent,
        requestPageContent: cstore.umbracoContent.DE.requestPageContent
      }
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return { query }
  }

  async componentDidMount() {
    const _this = this
    let isNotAuth = sessionStorage.getItem('userLogin') == null
    isNotAuth = isNotAuth ? true : !(new Date().getTime() < JSON.parse(sessionStorage.getItem('userLogin')).expireDate + 30 * 24 * 3600 * 1000)

    if (isNotAuth) {
      Router.push("/", "/")
    }
    else {
      if (!this.props.getState().requestPageItems.isModelsFetched) {
        await this.props.dispatch(fetchModels()) //sayfa hazır olduktan sonra tüm markaların modelleri getiriyoruz
      }

      const store = this.props.getState()
      const searchParam = this.props.query.searchParam
      const searchTypeQuery = this.props.query.searchType

      let ticketObj = ''
      if (searchTypeQuery == "byTicketId") {
        ticketObj = store.loginUser.user.tickets.ticketList.filter((item) => (item.ticketDetails.id == searchParam))[0]
      }
      else if (searchTypeQuery == "byImei") {
        ticketObj = store.loginUser.user.tickets.ticketList.filter((item) => (item.ticketDetails.imei == searchParam))[0]
      }
      else if (searchTypeQuery == "bySerialNumber") {
        ticketObj = store.loginUser.user.tickets.ticketList.filter((item) => (item.ticketDetails.serialNumber == searchParam))[0]
      }

      const ticketDetails = ticketObj.ticketDetails
      const brand = store.requestPageItems.modelList.filter((item) => (item.ID == ticketDetails.brandID))[0]
      const model = brand.ModelList.filter((item) => (item.ID == ticketDetails.modelID))[0]
      this.setState({ ...this.state, modelImgaUrl: 'http://www.tfmlager.com/Files/ModelPictures/' + model._imageFile })

      axios.get(config.citiesJson)
        .then(function (res) {

          res.data.map(function (city) {
            if (city.CityId == ticketDetails.city) {
              _this.setState({ ..._this.state, city: city.CityName })
            }
          })
        })
      axios.get(config.countriesJson)
        .then(function (res) {

          res.data.map(function (country) {
            if (country.CountryId == ticketDetails.country) {
              _this.setState({ ..._this.state, country: country.CountryName })
            }
          })
        })
    }
  }

  showFile = (ticketId, fileName, isUserFile, kvaFileByte, imgSrc) => {
    if (kvaFileByte) {
      let pdfWindow = window.open("")
      pdfWindow.document.write("<iframe width='100%' height='100%' src='" + kvaFileByte + "'></iframe>")
    }
    else if (imgSrc) {
      window.open(imgSrc,'Image');
    }
    else {
      const store = this.props.getState()

      const getFilesModel =
      {
        fileName: fileName,
        ticketId: ticketId,
        userId: store.loginUser.user.id,
        isUserFile: isUserFile,
      }
      var bodyFormData = new FormData();

      bodyFormData.append('getFilesModel', JSON.stringify(getFilesModel));

      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'bearer ' + JSON.parse(sessionStorage.getItem('userLogin')).token
      }
      axios.post(config.getUserFiles, bodyFormData, {
        headers: headers

      }).then(function (res) {
        let pdfWindow = window.open("")
        pdfWindow.document.write("<iframe width='100%' height='100%' src='" + res.data.byteFile + "'></iframe>")

      })
    }

  }
  render() {
    const store = this.props.getState()
    const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;
    const accountPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account").filter((link) => link.lang == currPageLangSettings.lang))[0].url
    const searchParam = this.props.query.searchParam
    const searchTypeQuery = this.props.query.searchType

    if (store.loginUser.isAuth || store.loginUser.user != null) {
      let ticketObj = ''
      if (searchTypeQuery == "byTicketId") {
        ticketObj = store.loginUser.user.tickets.ticketList.filter((item) => (item.ticketDetails.id == searchParam))[0]
      }
      else if (searchTypeQuery == "byImei") {
        ticketObj = store.loginUser.user.tickets.ticketList.filter((item) => (item.ticketDetails.imei == searchParam))[0]
      }
      else if (searchTypeQuery == "bySerialNumber") {
        ticketObj = store.loginUser.user.tickets.ticketList.filter((item) => (item.ticketDetails.serialNumber == searchParam))[0]
      }
      const ticketDetails = ticketObj.ticketDetails
      const kvaDocLink = ticketObj.kvaDocLink
      const kvaPics = ticketObj.kvaPics.split('*')

      let reprepFiles = ticketObj.reprepFiles
      reprepFiles.push({
        fileName: commonDictionary.kvaFile,
        index: reprepFiles.length + 1,
        ticketId: "",
        kvaFileByte: kvaDocLink
      })
      for (var i = 0; i < kvaPics.length; i++) {
        const kvaPic = kvaPics[i]
        if(kvaPic){
          reprepFiles.push({
            fileName: "f-kpaPic",
            index: reprepFiles.length + 1,
            ticketId: "",
            imgSrc:config.tfmRepairUrl+ kvaPic
          })
        }
          
      
      }



      const moreInfo = JSON.parse(ticketDetails.moreInfo)
      let purchaseDate = ticketDetails.purchaseDate.substring(0, 10)
      purchaseDate = purchaseDate.split("-")[2] + "." + purchaseDate.split("-")[1] + "." + purchaseDate.split("-")[0]
      return (
        <>
          <Head>
            <title> {currentPage.seo.pageTitle}</title>
          </Head>

          <main id="ticketDetails" data-html-class="bootstrap-custom vendor-custom rootui-custom" data-body-class="pg-C rui-navbar-autohide rui-section-lines rui-navbar-show">
            <Yaybar />
            <Navbar />

            <div className="rui-gap-2"></div>
            <div className="rui-page content-wrap f-margin-top-65">
              <div className="rui-page-title">
                <div className="container-fluid">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">

                      <li className="breadcrumb-item">
                        <Link href="/" as={currPageLangSettings.homePageUrl}>
                          <a>
                            {commonDictionary.homePage}
                          </a>
                        </Link>

                      </li>
                      <li className="breadcrumb-item">
                        <Link href="/account" as={accountPageUrl}>
                          <a>
                            {commonDictionary.profile}
                          </a>
                        </Link>

                      </li>
                      <li className="breadcrumb-item">
                        {currentPage.seo.pageTitle}
                      </li>

                    </ol>
                  </nav>
                  <h1>#{ticketDetails.id}</h1>
                </div>
              </div>

              <div className="rui-page-content">
                <div className="container-fluid">
                  <Carousel
                    ticketLogs={ticketObj.ticketLogs.filter(x => x.description != "")}
                  />
                  <div className="rui-gap-2"></div>
                  <div className="row xs-gap">

                    <div className="col-sm device-info">
                      <div className="card">
                        <img src={this.state.modelImgaUrl} className="card-img-top" alt="" />
                        <div className="card-body">
                          <h5 className="card-title h2">{ticketDetails.brandName}</h5>
                          <p className="card-text">{ticketDetails.modelName}</p>
                        </div>
                      </div>

                    </div>
                    <div className="col-sm timeline">


                      <div className="card  margin-bottom-20">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item f-border-bottom-none">{commonDictionary.imeiNo + " : "} {ticketDetails.imei}</li>
                          <li className="list-group-item">{commonDictionary.serialNo + " : "} {ticketDetails.serialNumber}</li>
                          <li className="list-group-item"> {commonDictionary.devicePurchaseDate + " : "} {purchaseDate}</li>
                          <li className="list-group-item">{currentPage.Symptoms + " : "}
                            {
                              moreInfo.symptoms.map(
                                (t, i) => <span key={"symptom" + i}>{t.subSymptom.name}{moreInfo.symptoms.length - 1 === i ? '' : ','} </span>
                              )
                            }
                          </li>
                          <li className="list-group-item">
                            {currentPage.Accesserios + " : "}
                            {
                              ticketDetails.accessories.split("|").length > 0 ?

                                ticketDetails.accessories.split("|").map(
                                  (t, i) => <span key={"accessory" + i}>{currentPage.requestPageContent.requestStep9.accessories.filter((item) => (item.value == t.split("~")[0]))[0].name}{ticketDetails.accessories.split("|").length - 1 === i ? '' : ','} </span>
                                )
                                :
                                <span>{currentPage.AccesseriosSendWithNothing}</span>

                            }
                          </li>
                          {
                            ticketDetails.additionalInfo.includes('Kostenpfl. Rep.') &&
                            <li className="list-group-item">
                              {

                                currentPage.DevicePassword + " : " + (ticketDetails.additionalInfo.split("|")[2]).split("~")[1]
                              }

                            </li>
                          }
                          {
                            ticketDetails.additionalInfo.includes('Entsperrmuster') &&
                            <li className="list-group-item">
                              {
                                this.state.showPassCode &&
                                <>
                                  {currentPage.DevicePasscode + " : " + (ticketDetails.additionalInfo.split("|")[1]).split("~")[1]}
                                  <a onClick={() =>
                                    this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                  } style={{ marginLeft: '10px' }} href="javascript:void(0)" className="lnk-A">{commonDictionary.hide}</a>

                                </>

                              }

                              {
                                !this.state.showPassCode &&
                                <>
                                  <span>{currentPage.DevicePasscode + " : ******"}</span>
                                  <a onClick={() =>
                                    this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                  } style={{ marginLeft: '10px' }} href="javascript:void(0)" className="lnk-A">{commonDictionary.show2}</a>
                                </>

                              }

                            </li>
                          }
                        </ul>

                      </div>
                      <div className="card">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">{currentPage.NameLastName + " : " + ticketDetails.firstName + " " + ticketDetails.lastName}</li>
                          <li className="list-group-item">{currentPage.Email + " : " + ticketDetails.email}</li>
                          <li className="list-group-item f-border-bottom-none">{commonDictionary.gsmNo + " : " + ticketDetails.phone}</li>
                          <li className="list-group-item">{commonDictionary.adress + " : " + ticketDetails.address1}</li>
                          <li className="list-group-item f-border-bottom-none">{commonDictionary.postCode + " : " + ticketDetails.postalCode}</li>
                          <li className="list-group-item">{commonDictionary.city + " : " + this.state.city}</li>
                          <li className="list-group-item">{commonDictionary.country + " : " + this.state.country}</li>

                          {/* <li className="list-group-item">
                            {currentPage.AdditionalServices + " : "}
                            {
                              moreInfo.additionalServices.length > 0 ?
                                moreInfo.additionalServices.map(
                                  (t, i) => <span key={"additionalService" + i}>{currentPage.requestPageContent.requestStep11.additionalService.filter((item) => (item.barcode1 == t.service))[0].shortName}{moreInfo.additionalServices.length - 1 === i ? '' : ','} </span>
                                )
                                :
                                <span>{currentPage.AdditionalServicesDontBuy}</span>
                            }
                          </li> */}
                        </ul>

                      </div>
                    </div>
                  </div>
                  <div className="rui-gap-2"></div>

                  <div className="row xs-gap">

                    <div className="col-sm">
                      <div className="rui-page-title"><div className="container-fluid"><h4>{commonDictionary.userFiles}</h4></div></div>
                      <div className='dataTableContainer'>
                        <DataTableComp
                          data={ticketObj.userFiles}
                          pagination={false}
                          rowsPerPage={commonDictionary.rowsPerPage}
                          noDataComponent={commonDictionary.noRecordsFount}
                          columns={[
                            {
                              name: commonDictionary.userFiles,
                              selector: 'index',
                              sortable: true,
                            }, {
                              name: commonDictionary.fileName,
                              selector: 'fileName',
                              sortable: true,
                            },
                            {
                              name: commonDictionary.show,
                              right: true,
                              cell: row => <a href='#!' onClick={() => this.showFile(row.ticketId, row.fileName, true)}>{commonDictionary.show}</a>
                            },


                          ]}
                        />
                      </div>
                    </div>
                    <img id="ItemPreview" src="" />

                    <div className="col-sm">
                      <div className="rui-page-title"><div className="container-fluid"><h4>{commonDictionary.reprepFiles}</h4></div></div>
                      <div className='dataTableContainer'>
                        <DataTableComp
                          data={reprepFiles}
                          noDataComponent={commonDictionary.noRecordsFount}
                          rowsPerPage={commonDictionary.rowsPerPage}
                          pagination={false}
                          columns={[
                            {
                              name: commonDictionary.reprepFiles,
                              selector: 'index',
                              sortable: true,
                            }, {
                              name: commonDictionary.fileName,
                              selector: 'fileName',
                              sortable: true,
                              cell:row=> 
                              row.fileName == "f-kpaPic" ?(
                                <img src="../../static/images/default-avatar.jpg" className="f-kpaPic"/>

                              ):(
                                row.fileName
                              )
                             
                              
                            },
                            {
                              name: commonDictionary.show,
                              right: true,
                              cell: row => <a href='#!' onClick={() => this.showFile(row.ticketId, row.fileName, false, row.kvaFileByte, row.imgSrc)}>{commonDictionary.show}</a>
                            },
                          ]}
                        />
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </main>
        </>
      )

    }
    else {
      return (
        <main id="ticketDetails" data-html-class="bootstrap-custom vendor-custom rootui-custom" data-body-class="pg-C rui-navbar-autohide rui-section-lines rui-navbar-show">
        </main>
      )
    }

  }
}


export default connect(initsStore)(TicketDetails);