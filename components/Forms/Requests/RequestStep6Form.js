import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as config from '../../../config';
import * as Yup from 'yup';
import FSubmitButton from '../../Requests/fSubmitButton';
import InputText from '../Inputs/InputText'
import DatePicker from '../Inputs/DatePicker'
import CssTransion from '../../UI/CssTransition';
import FBackButton from '../../Requests/fBackButton';
import { refreshToolTips } from '../../../static/common.js';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

//serial number imei tarih

class RequestStep6Form extends Component {
  state = {
    imei: "",
    serialNumber: "",
    isValidImeiOrSerialNumber: "",
    checkPurchaseDate: new Date(),
    purchaseDate: new Date(),
    onFocusOrSelectedDate: false,
    goSummary: false

  };

  componentDidUpdate() {
    refreshToolTips()
  }
  onImeiChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value
    inputValue = inputValue.replace(/[^0-9]/g, '');//rakam hariç diğer karakterleri replace ediyor

    if (inputValue.length > 15) {//Girilen karakter 15 karakterden fazla ise son girilen char silinir
      inputValue = inputValue.substring(0, 15)
    }
    let isValidImeiOrSerialNumber = 'error'
    if (inputValue.length != 0) {//Girilen karakter 15 karakterden fazla ise son girilen char silinir
      isValidImeiOrSerialNumber = ''
    }
    setFieldValue(inputName, inputValue)
    this.setState({ ...this.state, imei: inputValue, isValidImeiOrSerialNumber: isValidImeiOrSerialNumber })
  }
  onSerialNumberChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9a-zA-Z]/g, '');//rakam ve harf hariç diğer karakterleri replace ediyor
    setFieldValue(inputName, inputValue)
    let isValidImeiOrSerialNumber = 'error'
    if (this.state.imei.length != 0) {
      isValidImeiOrSerialNumber = ''
    }
    if (inputValue.length != 0) {//Girilen karakter 15 karakterden fazla ise son girilen char silinir
      isValidImeiOrSerialNumber = ''
    }

    this.setState({ ...this.state, serialNumber: inputValue, isValidImeiOrSerialNumber: isValidImeiOrSerialNumber })

  }
  handleChangePurchaseDate = date => {

    this.setState({
      ...this.state,
      purchaseDate: date,
      onFocusOrSelectedDate: true
    });

  };
  handleFocusPurchaseDate = () => {
    this.setState({
      ...this.state,
      onFocusOrSelectedDate: true
    });
  };
  handleOnBlurPurchaseDate = () => {
    this.setState({
      ...this.state,
      onFocusOrSelectedDate: (this.state.checkPurchaseDate - this.state.purchaseDate > 0)
    });
  };
  componentDidMount() {
    refreshToolTips()
    const store = this.props.getState()
    let initialValuesPurchaseDate = '';

    try {
      initialValuesPurchaseDate = store.siteSettings.userRequestSteps.requestStep6FormData.purchaseDate
      if (initialValuesPurchaseDate != '') {
        this.setState({
          ...this.state,
          onFocusOrSelectedDate: true,
          purchaseDate: new Date(initialValuesPurchaseDate)
        });
      }
    }
    catch (e) { }

  }
  previousStep = (step) => {
    let beforeUserRequestSteps = null;
    if (localStorage.getItem('userRequestSteps') != null) {
      beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
    }
    //kullanıcının doldurduğu formlar bu objede tutuluyor 
    const userRequestSteps = {
      ...beforeUserRequestSteps,
      comeFrom: 'default',
      expireDate: new Date().getTime(),
      currentRequestStep: step
    }
    document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
    setTimeout(() => {
      document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
      this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
    }, config.waitToNextComponent);
  }
  goSummaryStep = (submitForm) => {
    this.setState({ ...this.state, goSummary: true })
    submitForm()
  }

  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary, userRequestSteps } = this.props.getState().siteSettings;
    let initialValuesImei = '';
    let initialValuesSerialNumber = '';
    try {
      initialValuesImei = userRequestSteps.requestStep6FormData.imei
    }
    catch (e) { }
    try {
      initialValuesSerialNumber = userRequestSteps.requestStep6FormData.serialNumber
    }
    catch (e) { }

    return (
      <CssTransion>
        <>
          <Formik
            initialValues={{
              imei: initialValuesImei,
              serialNumber: initialValuesSerialNumber,
            }}
            validationSchema={Yup.object().shape({

              imei: Yup.string()
                .min(15, commonDictionary.min15char),
              serialNumber: Yup.string()
                .min(6, commonDictionary.min6Char)
                .matches(/(?=.\d{1})(?=.*[a-zA-Z]{1}).*$/, {
                  message: commonDictionary.min1CharAndNumber,
                  excludeEmptyString: true
                }),
            })}
            onSubmit={values => {
              const { goSummary } = this.state
              const purchaseDate = this.state.purchaseDate;
              const checkPurchaseDate = this.state.checkPurchaseDate;
              if (values.imei == "" && values.serialNumber == "") {
                //imei yada seri no girilmeli uyarısı gösterilecek
                this.setState({ ...this.state, isValidImeiOrSerialNumber: 'error' })
                return;
              }
              const deviceType = this.props.getState().siteSettings.userRequestSteps.requestStep3FormData.model.deviceType
              //cihaz tipimiz smarphone yada wifi tablet ise
              if (deviceType == 2 || deviceType == 0) {
                if (values.imei == "") {
                  this.setState({ ...this.state, isValidImeiOrSerialNumber: 'error' })
                  return;
                }
              }
              //şuanki formun objesi
              const requestStep6FormData = {
                imei: values.imei,
                serialNumber: values.serialNumber,
                purchaseDate: (checkPurchaseDate - purchaseDate > 0 ? purchaseDate : '') //alış tarih seçilmiş ise 
              }

              //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
              const requestSteps = currentPage.requestSteps
              let nextStep = "requestStep6";
              for (let i = 0; i < requestSteps.length - 1; i++) {
                if (requestSteps[i].contentTypeAlias == "requestStep6") {
                  nextStep = requestSteps[i + 1].contentTypeAlias
                }
              }
              nextStep = goSummary ? "requestSummaryStep" : nextStep
              
              let beforeUserRequestSteps = null;
              if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
              }

              //kullanıcınun doldurduğu formlar bu objede tutuluyor 
              const userRequestSteps = {
                ...beforeUserRequestSteps,
                comeFrom: 'default',
                expireDate: new Date().getTime(),
                currentRequestStep: nextStep,
                requestStep6FormData
              }
              document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
              setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                //localStorage'a kayıt edildi
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

                //redux'a kayıt edildi
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
              }, config.waitToNextComponent);

            }}
          >
            {(formikProps) => {
              const { errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched } = formikProps;
              return (
                <Form encType="multipart/form-data" className="requestStep6 f-answer">

                  <div className="grid-wrapper">

                    <div className="f-question-A pr-A translateY-animation">
                      {/* {"'" + store.siteSettings.userRequestSteps.requestStep3FormData.brand.name + " " + store.siteSettings.userRequestSteps.requestStep3FormData.model.label + "' " + currentPage.requestStep6.question} */}
                      {htmlToReactParser.parse(currentPage.requestStep6.question)}

                    </div>
                    <div className={"f-answer-group-B first translateY-animation"}>


                      <InputText
                        type="imei"
                        placeholder=""
                        name="imei"
                        id="f-imei"
                        value={values.imei}
                        onKeyUp={(e) => this.onImeiChange(e, "imei", setFieldValue)}
                        className={
                          errors.imei && touched.imei
                            ? (values.imei.length > 0 ? "tb-A v3 ff-A true error" : "tb-A v3 ff-A error")
                            : (values.imei.length > 0 ? "tb-A v3 ff-A true" : "tb-A v3 ff-A " + this.state.isValidImeiOrSerialNumber)
                        }
                      />
                      <label htmlFor="f-imei" className="placeholder-A">
                        {commonDictionary.imeiNo}
                      </label>
                      {errors.imei && touched.imei ?
                        <div className="ff-C">{errors.imei}</div> : null}
                      {this.state.isValidImeiOrSerialNumber == 'error' ?
                        <div className="ff-C">{commonDictionary.requiredField}</div> : null}

                      <a href='#' className="f-imei-info-area">
                        <div className="f-icon">
                          ?
                        </div>
                        <div className="f-info-text">
                          {htmlToReactParser.parse(commonDictionary.imeiInfo)}
                        </div>
                      </a>
                    </div>
                    {/* <div className={"f-answer-group-B translateY-animation"}>
                      <InputText
                        type="text"
                        placeholder=""
                        name="serialNumber"
                        id="f-serialNumber"
                        value={values.serialNumber}
                        onKeyUp={(e) => this.onSerialNumberChange(e, "serialNumber", setFieldValue)}
                        className={
                          errors.serialNumber && touched.serialNumber
                            ? values.serialNumber.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                            : values.serialNumber.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A " + this.state.isValidImeiOrSerialNumber
                        }
                      />
                      <label htmlFor="f-serialNumber" className="placeholder-A">
                        {commonDictionary.serialNo}
                      </label>
                      {errors.serialNumber && touched.serialNumber ?
                        <div className="ff-C">{errors.serialNumber}</div> : null}
                      {this.state.isValidImeiOrSerialNumber == 'error' ?
                        <div className="ff-C">{commonDictionary.requiredField}</div> : null}
                    </div> */}
                    <div className="f-answer-group-B translateY-animation">
                      <div className={"f-datePicker-group-A " + this.state.onFocusOrSelectedDate}>

                        <DatePicker
                          id="datepicker"
                          name="purchaseDate"
                          value={this.state.purchaseDate}
                          selected={this.state.purchaseDate ? this.state.purchaseDate : new Date()}
                          onChange={this.handleChangePurchaseDate}
                          onFocus={this.handleFocusPurchaseDate}
                          onBlur={this.handleOnBlurPurchaseDate}
                          showMonthDropdown={true}
                          showYearDropdown={true}
                          className={
                            errors.purchaseDate && touched.purchaseDate
                              ? "dp-a error"
                              : "dp-a"
                          }

                        />

                        <label htmlFor="datepicker" className="placeholder-A">
                          {commonDictionary.devicePurchaseDate}
                        </label>

                      </div>
                      <div className="f-info-area pr-B">
                        {commonDictionary.infoDateIsRequired}

                      </div>
                    </div>

                    <FBackButton click={() => this.previousStep("requestStep5")} goBack={commonDictionary.goBack} />

                    <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                    {
                      store.siteSettings.userRequestSteps.comeFrom == "summary" &&
                      <FBackButton click={() => this.goSummaryStep(formikProps.submitForm)}
                        goBack={commonDictionary.complete} classes="summary" />

                    }
                  </div>

                </Form>
               )
              }}
          </Formik>
        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep6Form);