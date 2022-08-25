import React, { Component } from 'react';
import Head from 'next/head'
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import * as config from '../../config';
import Router from 'next/router';
import Yaybar from '../../components/RootUI/Profile/yaybar';
import Navbar from '../../components/RootUI/Profile/navbar';
import DataTableComp from '../../components/UI/DataTableComp';
import Link from 'next/link';
import axios from 'axios'
import '../../styles/RootUI/vendor.scss';
import '../../styles/RootUI/bootstrap-custom.scss';
import '../../styles/RootUI/rootui.scss';
import '../../styles/Static/Profile.scss';
import '../../styles/Static/TicketList.scss';

class TicketList extends Component {

  showFile = (ticketId) => {
    const store = this.props.getState()

    const getFilesModel =
    {
      fileName: ticketId,
      ticketId: ticketId,
      userId: store.loginUser.user.id,
      isUserFile: false,
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

  filterTickets = () => {
    const searchParam = this.props.query.searchParam
    const searchType = this.props.query.searchType
    const status = this.props.query.status
    let tickets = []
    //kullanıcının ticketı varsa listelme yapılacak
    if (JSON.parse(sessionStorage.getItem('userLogin')).user.tickets != null) {
      if (searchParam) {
        JSON.parse(sessionStorage.getItem('userLogin')).user.tickets.ticketList.map(function (ticket, index) {

          let ticketsearchedBy = ""
          if (searchType == "bySerialNumber") {
            ticketsearchedBy = ticket.ticketDetails.serialNumber
          }
          else if (searchType == "byImei") {
            ticketsearchedBy = ticket.ticketDetails.imei
          }
          else if (searchType == "byTicketId") {
            ticketsearchedBy = ticket.ticketDetails.id
          }

          if (ticketsearchedBy == searchParam) {
            const t = {
              id: ticket.ticketDetails.id,
              addedDate: ticket.ticketDetails.addedDate.substring(0, 10),
              imei: ticket.ticketDetails.imei,
              serialNumber: ticket.ticketDetails.serialNumber,
              status: ticket.ticketDetails.status,//status id ile ticketloglist eşleştirilip status string çekilecek
            }
            tickets.push(t)
          }
        })
      }
      else if (status) {
        if (status == "-1") {

          JSON.parse(sessionStorage.getItem('userLogin')).user.tickets.ticketList.map(function (ticket, index) {
            if (ticket.ticketDetails.status == 59 || ticket.ticketDetails.status == 60 || ticket.ticketDetails.status == 61) {
              const t = {
                id: ticket.ticketDetails.id,
                addedDate: ticket.ticketDetails.addedDate.substring(0, 10),
                imei: ticket.ticketDetails.imei,
                serialNumber: ticket.ticketDetails.serialNumber,
                status: ticket.ticketDetails.status,//status id ile ticketloglist arşılaştırlıp eklenecek
              }
              tickets.push(t)
            }
          })
        }
        else {
          JSON.parse(sessionStorage.getItem('userLogin')).user.tickets.ticketList.map(function (ticket, index) {
            if (ticket.ticketDetails.status != 59 && ticket.ticketDetails.status != 60 && ticket.ticketDetails.status != 61) {
              const t = {
                id: ticket.ticketDetails.id,
                addedDate: ticket.ticketDetails.addedDate.substring(0, 10),
                imei: ticket.ticketDetails.imei,
                serialNumber: ticket.ticketDetails.serialNumber,
                status: ticket.ticketDetails.status,//status id ile ticketloglist arşılaştırlıp eklenecek
              }
              tickets.push(t)
            }
          })
        }

      }
      else {

        JSON.parse(sessionStorage.getItem('userLogin')).user.tickets.ticketList.map(function (ticket, index) {
          const t = {
            id: ticket.ticketDetails.id,
            addedDate: ticket.ticketDetails.addedDate.substring(0, 10),
            imei: ticket.ticketDetails.imei,
            serialNumber: ticket.ticketDetails.serialNumber,
            status: ticket.ticketDetails.status,//status id ile ticketloglist arşılaştırlıp eklenecek
          }
          tickets.push(t)
        })

      }

      this.setState({ ...this.state, tickets: tickets })
    }
  }

  static async getInitialProps({ ctx, store, query }) {

    const cstore = await store.getState()
    const lang = cstore.siteSettings.currPageLangSettings.lang
    let currentPage = cstore.umbracoContent.TR.ticketlistPageContent

    if (lang == "EN") {
      currentPage = cstore.umbracoContent.EN.ticketlistPageContent
    }
    else if (lang == "DE") {
      currentPage = cstore.umbracoContent.DE.ticketlistPageContent
    }
    await store.dispatch(setSiteSettings({ currentPage: currentPage }));

    return { query }
  }

  state = {
    tickets: []
  }

  componentDidMount() {
    let isNotAuth = sessionStorage.getItem('userLogin') == null
    isNotAuth = isNotAuth ? true : !(new Date().getTime() < JSON.parse(sessionStorage.getItem('userLogin')).expireDate + 30 * 24 * 3600 * 1000)

    if (isNotAuth) {
      Router.push("/", "/")
    }
    else {
      this.filterTickets()
    }
  }

  render() {
    const store = this.props.getState()
    const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;
    const accountPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account").filter((link) => link.lang == currPageLangSettings.lang))[0].url
    const ticketDetailsPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account/ticketDetails").filter((link) => link.lang == currPageLangSettings.lang))[0].url


    if (store.loginUser.isAuth || store.loginUser.user != null) {

      return (
        <>
          <Head>
            <title>{currentPage.seo.pageTitle}</title>
          </Head>

          <main id="ticketList" data-html-class="bootstrap-custom vendor-custom rootui-custom" data-body-class="pg-C rui-navbar-autohide rui-section-lines rui-navbar-show">
            <Yaybar />
            <Navbar />
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
                  <h1>{currentPage.seo.pageTitle}</h1>
                </div>
              </div>
              <div className='dataTableContainer'>
                <DataTableComp
                  noDataComponent={commonDictionary.noRecordsFount}
                  data={this.state.tickets}
                  pagination={true}
                  rowsPerPage={commonDictionary.rowsPerPage}
                  columns={[
                    {
                      name: commonDictionary.ticketNumber,
                      selector: 'id',
                      sortable: true,
                      cell: row => <a href={ticketDetailsPageUrl + "?searchType=byTicketId&searchParam=" + row.id}>{row.id}</a>
                    }, {
                      name: commonDictionary.date,
                      selector: 'addedDate',
                      sortable: true,
                    },
                    {
                      name: commonDictionary.imeiNo,
                      selector: 'imei',
                      sortable: true,
                    }, {
                      name: commonDictionary.serialNo,
                      selector: 'serialNumber',
                      sortable: true,
                    }, {
                      name: commonDictionary.status,
                      selector: 'status',
                      sortable: true,
                    }, {
                      name: commonDictionary.document,
                      sortable: false,
                      button: true,
                      cell: row => <a href='#!' onClick={() => this.showFile(row.id)}>{commonDictionary.showPdf}</a>
                    },
                    {
                      name: commonDictionary.details,
                      right: true,
                      cell: row => <a href={ticketDetailsPageUrl + "?searchType=byTicketId&searchParam=" + row.id} target="_blank">{commonDictionary.details}</a>
                    },
                  ]}
                />
              </div>
            </div>

          </main>
        </>
      )

    }
    else {
      return (
        <main id="ticketList" data-html-class="bootstrap-custom vendor-custom rootui-custom" data-body-class="pg-C rui-navbar-autohide rui-section-lines rui-navbar-show"></main>
      )
    }

  }
}


export default connect(initsStore)(TicketList);