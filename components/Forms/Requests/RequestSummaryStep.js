import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import SummaryTable from '../../Requests/summaryTable'
import CssTransion from '../../UI/CssTransition';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

class RequestSummaryStep extends Component {
  state = {
    finalCard: null
  }
  componentDidMount() {
    if (this.props.page == "final") {

      const store = this.props.getState();
      const { commonDictionary } = store.siteSettings;
      let items = []

      items.push({
        title: commonDictionary.deliveryNote.toLocaleUpperCase('de-DE'),
        value: commonDictionary.ticketDetailsPDF+"|"+"pdfLink"
      })

      items.push({
        title: commonDictionary.ticketId.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.finalPageProps.ticketId+ "|"+ "ticketId" 
      })

      items.push({
        title: commonDictionary.dhlLink.toLocaleUpperCase('de-DE'),
        value: commonDictionary.dhlLinkText + "|"+ "dhlLink" + "|" + store.siteSettings.finalPageProps.dhlLink
      })

      items.push({
        title: commonDictionary.shipmentNo.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.finalPageProps.shipmentNo+ "|"+ "shipmentNo"
      })

      const finalCard = {
        title: commonDictionary.orderDetails.toLocaleUpperCase('de-DE'),
        editText: "",
        step: "",
        items: items,
        id: 0
      }

      this.setState({ ...this.state, finalCard: finalCard })
    }
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;

    let requestOwner1 = null;
    let items = []
    try {
      items.push({
        title: commonDictionary.requestor.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep7FormData.name + " " + store.siteSettings.userRequestSteps.requestStep7FormData.lastName
      })
      items.push({
        title: commonDictionary.ePosta.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep1FormData.email
      })
      items.push({
        title: commonDictionary.gsmNo.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep7FormData.phone
      })
      if (store.siteSettings.userRequestSteps.requestStep7FormData.postCode != undefined) {
        items.push({
          title: commonDictionary.postCode.toLocaleUpperCase('de-DE'),
          value: store.siteSettings.userRequestSteps.requestStep7FormData.postCode
        })
      }
      items.push({
        title: commonDictionary.adress.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep8FormData.adress
      })
      items.push({
        title: commonDictionary.country.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep8FormData.country.label
      })
      items.push({
        title: commonDictionary.city.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep8FormData.city.label
      })

    } catch (e) { }
    requestOwner1 = {
      title: commonDictionary.requestOwnerAndContactInfo.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep7",
      items: items,
      id: 1
    };


    let requestOwner2 = null;
    let items2 = []
    try {

      store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms.map((item, index) => {

        items2.push({
          title: item.mainSymptom.name.toLocaleUpperCase('de-DE'),
          value: item.subSymptom.name,
          item: item
        })
      })


    } catch (e) { }
    requestOwner2 = {
      title: commonDictionary.mainAndSubSymptoms.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep4",
      items: items2,
      id: 2
    };


    let requestOwner3 = null;
    let items3 = []
    try {

      items3.push({
        title: "",
        value: store.siteSettings.userRequestSteps.requestStep9FormData.accessories ?
          store.siteSettings.userRequestSteps.requestStep9FormData.accessories.join(", ") :
          commonDictionary.nothingAdded
      })


    } catch (e) { }
    requestOwner3 = {
      title: commonDictionary.sendedAccessoriesWithDevice.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep9",
      items: items3,
      id: 3
    };


    let requestOwner4 = null;
    let items4 = []
    try {
      if (store.siteSettings.userRequestSteps.requestStep10FormData.passExist == "exist") {
        if (store.siteSettings.userRequestSteps.requestStep10FormData.patternOrPasscode == "pattern") {
          items4.push({
            title: "",
            value: store.siteSettings.userRequestSteps.requestStep10FormData.pattern
          })
        }
        else {
          items4.push({
            title: "",
            value: store.siteSettings.userRequestSteps.requestStep10FormData.passCode.join("")
          })
        }
      }
      else {
        items4.push({
          title: "",
          value: "Belirtilmemiş"
        })
      }
    } catch (e) { }
    requestOwner4 = {
      title: commonDictionary.devicePassword.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep10",
      items: items4,
      id: 4
    };


    let requestOwner5 = null;
    let items5 = []
    try {

      store.siteSettings.userRequestSteps.requestStep11FormData.additionalServices.map((item, index) => {
        items5.push({
          title: "",
          // value: item.service + " (" + item.total + " €)"
          value: item.serviceLong
        })
      })

    } catch (e) { }
    requestOwner5 = {
      title: commonDictionary.additionalServices.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep11",
      items: items5,
      id: 5
    };

    let requestOwner6 = null;
    let items6 = []
    try {
      if (store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesNames) {

        let valueHtml = "<ul>"
        store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesNames.map((item, index) => {
          if (item.substring(item.length - 3) == "pdf") {
            valueHtml += "<li className='f-level2'><img className='f-image' title='" + item + "' src='../../../static/images/icons/pdf-icon.png'/><span className='f-value'>" + item + "</span></li>"
          }
          else {
            valueHtml += "<li className='f-level2'><img className='f-image' title='" + item + "' src='../../../static/images/icons/image-icon.png'/><span className='f-value'>" + item + "</span></li>"
          }
        })
        valueHtml += "</ul>"
        items6.push({
          title: commonDictionary.files.toLocaleUpperCase('de-DE'),
          value: valueHtml
        })

      }
      if (store.siteSettings.userRequestSteps.requestStep12FormData.note) {
        items6.push({
          title: commonDictionary.note.toLocaleUpperCase('de-DE'),
          value: store.siteSettings.userRequestSteps.requestStep12FormData.note
        })

      }

    } catch (e) { }

    requestOwner6 = {
      title: commonDictionary.filesAndNote.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep12",
      items: items6,
      id: 6
    };



    let requestOwner7 = null;
    let items7 = []
    try {
      items7.push({
        title: commonDictionary.imeiNo.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep6FormData.imei
      })
      if (store.siteSettings.userRequestSteps.requestStep6FormData.purchaseDate) {
        items7.push({
          title: commonDictionary.devicePurchaseDate.toLocaleUpperCase('de-DE'),
          value: store.siteSettings.userRequestSteps.requestStep6FormData.purchaseDate.substring(0, 10)
        })
      }
    } catch (e) { }
    requestOwner7 = {
      title: commonDictionary.imeiAndDate.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep6",
      items: items7,
      id: 7
    };

    let requestOwner8 = null;
    let items8 = []
    try {
      items8.push({
        title: commonDictionary.brand.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep3FormData.brand.name
      })
      items8.push({
        title: commonDictionary.deviceModel.toLocaleUpperCase('de-DE'),
        value: store.siteSettings.userRequestSteps.requestStep3FormData.model.label
      })

    } catch (e) { }
    requestOwner8 = {
      title: commonDictionary.brandAndModel.toLocaleUpperCase('de-DE'),
      editText: commonDictionary.edit,
      step: "requestStep3",
      items: items8,
      id: 8
    };

    return (
      <CssTransion>
        <>
          <div className='summaryStep f-answer'>
            {
              this.props.page != "final" &&
              <div className="f-question-A pr-A translateY-animation">
                {htmlToReactParser.parse(commonDictionary.summaryOfRequest)}
              </div>
            }
            {
              this.props.page == "final" &&
              <div className="f-question-A pr-A translateY-animation">
                {htmlToReactParser.parse(commonDictionary.yourRequestCreatedSuccessfully)}
              </div>
            }
            <div className="summaryTables">
              {
                this.state.finalCard != null &&
                this.props.page == "final" &&
                <SummaryTable content={this.state.finalCard} customClass="v1" page={this.props.page} />
              }
              <SummaryTable content={requestOwner8} customClass="v1" page={this.props.page} />
              <SummaryTable content={requestOwner7} customClass="v1" page={this.props.page} />
              <SummaryTable content={requestOwner1} customClass="v1" page={this.props.page} />
              <SummaryTable content={requestOwner2} customClass="v2" page={this.props.page} />
              <SummaryTable content={requestOwner3} customClass="v2" page={this.props.page} />
              {
                items4.length > 0 &&
                <SummaryTable content={requestOwner4} customClass="v2" page={this.props.page} />
              }
              {
                items5.length > 0 &&
                <SummaryTable content={requestOwner5} customClass="v1" page={this.props.page} />
              }

              {
                items6.length > 0 &&
                <SummaryTable content={requestOwner6} customClass="v1" page={this.props.page} />
              }

            </div>
          </div>
        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestSummaryStep);