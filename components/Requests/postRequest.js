import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import * as config from '../../config';
import axios from 'axios';
import Spinner from '../../components/UI/Spinner'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CheckBox from '../Forms/Inputs/CheckBox';
import Modal from '../UI/Modals/Modal/Modal';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

class PostRequest extends Component {
  state = {
    spinnerShow: false,
    showModal: false,
    content: ""
  }
  postRequestForm = () => {
    const _this = this
    this.setState({ ...this.state, spinnerShow: true })
    const store = this.props.getState()
    const _props = this.props
    const requestFinalPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/requestFinal").filter((link) => link.lang == store.siteSettings.currPageLangSettings.lang))[0].url

    const moreInfo = {
      symptoms: store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms,
      additionalServices: store.siteSettings.userRequestSteps.requestStep11FormData.finalAdditionalServices
    }
    const ticketForm = {
      imei: store.siteSettings.userRequestSteps.requestStep6FormData.imei,
      serialNo: store.siteSettings.userRequestSteps.requestStep6FormData.serialNumber,
      modelID: store.siteSettings.userRequestSteps.requestStep3FormData.model.value,
      modelName: store.siteSettings.userRequestSteps.requestStep3FormData.model.label,
      brandID: parseInt(store.siteSettings.userRequestSteps.requestStep3FormData.brand.id),
      brandName: store.siteSettings.userRequestSteps.requestStep3FormData.brand.name,
      title: "x",
      firstName: store.siteSettings.userRequestSteps.requestStep7FormData.name,
      lastName: store.siteSettings.userRequestSteps.requestStep7FormData.lastName,
      firmID: config.firmID,
      region: config.region,
      company: "",
      address1: store.siteSettings.userRequestSteps.requestStep8FormData.adress,
      address2: "",
      postalCode: store.siteSettings.userRequestSteps.requestStep8FormData.postCode,
      city: store.siteSettings.userRequestSteps.requestStep8FormData.city.value,
      country: store.siteSettings.userRequestSteps.requestStep8FormData.country.value,
      phone: store.siteSettings.userRequestSteps.requestStep7FormData.phone,
      cell: "",
      email: store.siteSettings.userRequestSteps.requestStep1FormData.email,
      purchaseDate: store.siteSettings.userRequestSteps.requestStep6FormData.purchaseDate == "" ? "1753-01-01T12:00:00.000Z" : store.siteSettings.userRequestSteps.requestStep6FormData.purchaseDate,
      accessories: store.siteSettings.userRequestSteps.requestStep9FormData.finalValues,
      additionalInfo: store.siteSettings.userRequestSteps.requestStep10FormData.finalValues,
      frequency: "permanent||||||",
      failure: store.siteSettings.userRequestSteps.requestStep4FormData.failure,
      moreInfo: JSON.stringify(moreInfo),
      appearance: "||~",
      reference: config.firmID,
      manufacturerMayContact: false,
      symptomCodes: store.siteSettings.userRequestSteps.requestStep4FormData.symptomCodes
    }
    var bodyFormData = new FormData();
    bodyFormData.append('ticketForm', JSON.stringify(ticketForm));
    bodyFormData.append('filesGuid', store.siteSettings.userRequestSteps.requestStep12FormData.acceptedFilesGuid);
    const headers = {
      'Content-Type': 'multipart/form-data'
    }
    this.props.dispatch(setSiteSettings({ showLayer: true }));

    axios.post(config.createTicket, bodyFormData, {
      headers: headers

    }).then(function (response) {
      _this.setState({ ..._this.state, spinnerShow: false })
      if (response.data.result == "TFMCreateTicketError") {
        alert("ticket oluşturma hatası (umbraco eklenecek)")
      }
      else if (response.data.result == "userRegisterError") {
        alert("userRegisterError (umbraco eklenecek)")
      }
      else {
        const userLogin = {
          user: response.data.result.user,
          token: response.data.result.token,
          login: true,
          rememberMe: false,
          expireDate: new Date().getTime()
        }
        const finalPageProps = {
          ticketId: response.data.result.ticketId,
          dhlLink: response.data.result.dhlLink,
          shipmentNo: response.data.result.shipmentNo,
        }

        sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
        sessionStorage.setItem('finalPageProps', JSON.stringify(finalPageProps))
        sessionStorage.setItem('userRequestSteps', localStorage.getItem('userRequestSteps'));
        localStorage.removeItem('userRequestSteps')

        window.location.href = requestFinalPageUrl
      }
      _this.props.dispatch(setSiteSettings({ showLayer: false }));

    })
      .catch(error => {
        _this.setState({ ..._this.state, spinnerShow: false })
        alert("talep formu oluşturlamadı genel hata (umbraco eklenecek)")
      });
  }

  render() {
    const store = this.props.getState();
    const { currentPage, sharedContent, commonDictionary } = store.siteSettings;
    let step3ModelImgSrc = ''
    let step3ModelImgAlt = ''
    const _this = this;
    const { showModal } = this.state;
    try {
      if (store.siteSettings.userRequestSteps.requestStep3FormData != null) {
        step3ModelImgSrc = store.siteSettings.userRequestSteps.requestStep3FormData.model.imgSrc
        step3ModelImgAlt = store.siteSettings.userRequestSteps.requestStep3FormData.model.label
      }
    } catch (e) { }

    return (
      <>
        <div className='postRequest'>
          <img className="f-model-img" src={step3ModelImgSrc} alt={step3ModelImgAlt}></img>

          {
            this.props.page != "final" &&
            <>
              {/* <div className='total'>
                  {commonDictionary.totalAmount + ": " + this.props.total + "₺"}
                </div> */}
              <Formik
                initialValues={{
                  chk1: false,
                  chk2: false,
                  chk3: false,
                }}
                validationSchema={
                  Yup.object().shape({
                    chk1: Yup.boolean()
                      .oneOf([true], "Must be checked"),
                    chk2: Yup.boolean()
                      .oneOf([true], "Must be checked"),
                    chk3: Yup.boolean()
                      .oneOf([true], "Must be checked"),
                  })
                }
                onSubmit={values => {
                  this.postRequestForm()

                }}
              >
                {({ errors, touched, values, handleSubmit, setFieldValue,
                  setFieldTouched }) => (
                    <Form encType="multipart/form-data" className="f-agreements">

                      <div className={"f-agreement chk-B"}>
                        <CheckBox
                          name="chk1"
                          id="chk1"
                          label={""}
                          value={values.chk1}
                          className={
                            errors.chk1 && touched.chk1
                              ? "ff-A error"
                              : "ff-A"
                          }
                        />
                        <a href='#'>
                          {htmlToReactParser.parse(sharedContent.aggreements.permission1_1)}
                        </a>


                      </div>
                      <div className={"f-agreement chk-B"}>
                        <CheckBox
                          name="chk2"
                          id="chk2"
                          label={""}
                          value={values.chk2}
                          className={
                            errors.chk2 && touched.chk2
                              ? "ff-A error"
                              : "ff-A"
                          }
                        />
                        <a href='#'>
                          {htmlToReactParser.parse(sharedContent.aggreements.permission1_2)}
                        </a>


                      </div>
                      <div className={"f-agreement chk-B"}>
                        <CheckBox
                          name="chk3"
                          id="chk3"
                          label={""}
                          value={values.chk3}
                          className={
                            errors.chk3 && touched.chk3
                              ? "ff-A error"
                              : "ff-A"
                          }
                        />

                        <div className="f-agreement-links">
                          <span>
                            {htmlToReactParser.parse(sharedContent.aggreements.permission1_3_1)}
                          </span>

                          <a href="#" onClick={() => this.setState({ ...this.state, showModal: true, content: "chk2" })}>
                            {htmlToReactParser.parse(sharedContent.aggreements.permission1_3_2)}
                          </a>
                          <span>
                            {htmlToReactParser.parse(sharedContent.aggreements.permission1_3_3)}
                          </span>

                          <a href="#" onClick={() => this.setState({ ...this.state, showModal: true, content: "chk3" })}>
                            {htmlToReactParser.parse(sharedContent.aggreements.permission1_3_4)}
                          </a>
                          <span>
                            {htmlToReactParser.parse(sharedContent.aggreements.permission1_3_1)}
                          </span>

                        </div>




                      </div>

                      <button type="submit" className='submitRequest btn-01 lnk-C'>
                        {commonDictionary.completeRequestProcess}
                        {<Spinner show={this.state.spinnerShow} type="light" />}
                      </button>

                    </Form>
                  )}
              </Formik>


            </>
          }
        </div>
        <Modal showCloseIcon={true} show={showModal} clicked={() => this.setState({ ...this.state, showModal: false })} type='modal-type-05'>
          {
            this.state.content == "chk2" &&
            <div className={"f-modal-agreement " + this.state.content}>
              {
                htmlToReactParser.parse(sharedContent.aggreements.permission2_2)
              }
            </div>
          }

          {
            this.state.content == "chk3" &&
            <div className={"f-modal-agreement " + this.state.content}>
              {
                htmlToReactParser.parse(sharedContent.aggreements.permission2_3)
              }
            </div>
          }




        </Modal>
      </>
    )
  }
}

export default connect(initsStore)(PostRequest);