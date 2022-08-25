import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as config from '../../../config';
import * as Yup from 'yup';
import RadioButtonsGroup from '../Inputs/RadioButtonsGroup'
import FSubmitButton from '../../Requests/fSubmitButton';
import CssTransion from '../../UI/CssTransition';
import { getElementsOffsetHeight } from '../../../static/common.js';
import FBackButton from '../../Requests/fBackButton';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

//symptoms seçimi
class RequestStep4Form extends Component {
  state = {
    mainSymptom: '',
    subSymptoms: [],
    goSummary: false

  };
  previousStep = (stayCurrentStep, step) => {
    const store = this.props.getState();
    if (stayCurrentStep) {
      let step4PageStatus = {
        ...store.siteSettings.step4PageStatus,
        insideOfStep: true,
        class: "move-down",
        translateYValue1: 0,
      }
      this.props.dispatch(setSiteSettings({ withGrandiant: "", step4PageStatus: step4PageStatus }));
    }
    else {
      let beforeUserRequestSteps = null;
      if (localStorage.getItem('userRequestSteps') != null) {
        beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
      }

      //kullanıcınun doldurduğu formlar bu objede tutuluyor 
      const userRequestSteps = {
        ...beforeUserRequestSteps,
        comeFrom: 'default',
        expireDate: new Date().getTime(),
        currentRequestStep: step
      }
      document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
      setTimeout(() => {
        document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
        let step4PageStatus = {
          class: "",
          translateYValue1: 0,
        }
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
        this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step4PageStatus: step4PageStatus }));

      }, config.waitToNextComponent);
    }

  }
  goSummaryStep = (submitForm) => {
    this.setState({ ...this.state, goSummary: true })
    submitForm()
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary, userRequestSteps } = this.props.getState().siteSettings;

    const mainSymptoms = []

    currentPage.requestStep4.mainSymptom.map(function (m) {
      //radio button özellikler
      mainSymptoms.push({
        name: 'mainSymptom',
        id: m.id,
        label: m.name
      })
    })
    let askQuestion1 = true
    if (userRequestSteps.requestStep4FormData != null) {
      askQuestion1 = userRequestSteps.requestStep4FormData.Symptoms.length == 0
    }

    return (
      <CssTransion>
        <>
          <div className="clickGrandiant" onClick={() => this.previousStep(true, "move-down")}></div>
          <div className={"citem-01 " + store.siteSettings.step4PageStatus.class}>

            <Formik
              initialValues={{
                mainSymptom: ''
              }}
              validationSchema={Yup.object().shape({
                mainSymptom: Yup.string().required(commonDictionary.requiredField)
              })}
              onSubmit={values => {
                //Ana Problem seçildikten sonra alt problemleri cascade ediyoruz
                const newSubSymptoms = []
                currentPage.requestStep4.mainSymptom.map(function (m) {
                  if (m.id == values.mainSymptom) {
                    m.subSymptom.map(function (s) {
                      newSubSymptoms.push({
                        name: 'subSymptom',
                        id: s.id,
                        label: s.name
                      })
                    })
                  }
                })

                this.setState({
                  ...this.state,
                  mainSymptom: values.mainSymptom,
                  subSymptoms: newSubSymptoms
                });

                //Ana Problem  seçildiği için Symptomlara active classı ekliyoruz
                let translateYValue1 = getElementsOffsetHeight("citem-01", "translateY-animation")
                translateYValue1 = -(translateYValue1 + config.translateYTopValue)
                let step4PageStatus = {
                  class: "active move-up",
                  insideOfStep: true,
                  translateYValue1: translateYValue1
                }

                this.props.dispatch(setSiteSettings({ withGrandiant: "withGrandiant", step4PageStatus: step4PageStatus }));

              }}

            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep4 f-answer">

                    <div className="grid-wrapper">

                      <div className="f-question-A pr-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step4PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        {
                          htmlToReactParser.parse(askQuestion1 ? currentPage.requestStep4.question1 : currentPage.requestStep4.question3)

                        }


                      </div>
                      <div className="f-answer-group-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step4PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        <RadioButtonsGroup
                          id="mainSymptom"
                          label=""
                          value={values.mainSymptom}
                          error={errors.mainSymptom}
                          touched={touched.mainSymptom}
                          radioButtons={mainSymptoms}
                          className={
                            errors.mainSymptom && touched.mainSymptom
                              ? "rb-A ff-A error"
                              : "rb-A ff-A"
                          }
                        />
                      </div>
                      <FBackButton click={() => this.previousStep(false, "requestStep3")} goBack={commonDictionary.goBack} />

                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />

                    </div>
                  </Form>
                )}
            </Formik>

          </div>
          <div className={"citem-02 " + store.siteSettings.step4PageStatus.class}>

            <Formik
              initialValues={{
                subSymptom: ''
              }}
              validationSchema={Yup.object().shape({
                subSymptom: Yup.string().required(commonDictionary.requiredField)
              })}
              onSubmit={values => {
                const { goSummary } = this.state

                //daha önce var olan symptom'ların üstüne yeni symptom ekliyoruz
                let beforeSymptoms = []
                let newSymptoms = []
                let beforeSymptomCodes = []
                let beforeFailure = ""
                let newFailure = ""

                try {
                  beforeSymptoms = store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms;
                  newSymptoms = beforeSymptoms;
                  beforeSymptomCodes = store.siteSettings.userRequestSteps.requestStep4FormData.symptomCodes;
                }
                catch (e) { }

                let mainSymptomName = ''
                let subSymptomName = ''
                let barcode1 = ''
                let errorTextValue = ''
                let samsungSymptomCode = ''
                let total = 0

                const mainSymp = this.state.mainSymptom

                currentPage.requestStep4.mainSymptom.map(function (m) {
                  if (m.id == mainSymp) {
                    mainSymptomName = m.name
                    m.subSymptom.map(function (s) {
                      if (s.id == values.subSymptom) {
                        subSymptomName = s.name
                        barcode1 = s.barcode1
                        errorTextValue = s.errorTextValue
                        samsungSymptomCode = s.samsungSymptomCode
                        if (store.siteSettings.userRequestSteps.modelPrices != "") {
                          store.siteSettings.userRequestSteps.modelPrices.map(function (mp) {
                            if (mp.Barcode1 == barcode1) {
                              total = mp.Price
                            }
                          })
                        }
                      }
                    })
                  }
                })

                beforeSymptomCodes = beforeSymptomCodes == '' ? samsungSymptomCode : beforeSymptomCodes
                newFailure = errorTextValue

                newSymptoms.push({
                  mainSymptom: { id: mainSymp, name: mainSymptomName },
                  subSymptom: {
                    id: values.subSymptom,
                    name: subSymptomName,
                    barcode1: barcode1,
                    errorTextValue: errorTextValue,
                    samsungSymptomCode: samsungSymptomCode
                  },
                  total: total
                })

                //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
                const requestSteps = currentPage.requestSteps
                let nextStep = "requestStep4";
                for (let i = 0; i < requestSteps.length - 1; i++) {
                  if (requestSteps[i].contentTypeAlias == "requestStep4") {
                    nextStep = requestSteps[i + 1].contentTypeAlias
                  }
                }
                nextStep = goSummary ? "requestSummaryStep" : nextStep
                //şuanki formun objesi
                const requestStep4FormData = {
                  Symptoms: newSymptoms,
                  symptomCodes: beforeSymptomCodes,
                  failure: newFailure
                }

                //kullanıcınun daha önce doldurduğu form var ise onu elimize alıyoruz
                let beforeUserRequestSteps = null;
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }
               const comeFrom= this.props.getState().siteSettings.userRequestSteps.comeFrom == "summary" ? "summary" : "default"
                //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                const userRequestSteps = {
                  ...beforeUserRequestSteps,
                  comeFrom: comeFrom,
                  expireDate: new Date().getTime(),
                  currentRequestStep: nextStep,
                  requestStep4FormData
                }
                document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                setTimeout(() => {
                  document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                  let step4PageStatus = {
                    class: "",
                    insideOfStep: false,
                    translateYValue1: 0
                  }

                  localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                  this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step4PageStatus: step4PageStatus }));
                }, config.waitToNextComponent);

              }}

            >
              {(formikProps) => {
                const { errors, touched, values, handleSubmit, setFieldValue,
                  setFieldTouched } = formikProps;
                return (
                  <Form encType="multipart/form-data" className="requestStep4 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation">
                        {
                          htmlToReactParser.parse(askQuestion1 ? currentPage.requestStep4.question2 : currentPage.requestStep4.question4)

                        }
                      </div>
                      <div className="f-answer-group-A translateY-animation">
                        <RadioButtonsGroup
                          id="subSymptom"
                          label=""
                          value={values.subSymptom}
                          error={errors.subSymptom}
                          touched={touched.subSymptom}
                          radioButtons={this.state.subSymptoms}
                          className={
                            errors.subSymptom && touched.subSymptom
                              ? "rb-A ff-A error"
                              : "rb-A ff-A"
                          }
                        />
                      </div>
                      <FBackButton click={() => this.previousStep(true, "requestStep4")}
                        goBack={commonDictionary.goBack}
                        classes={store.siteSettings.userRequestSteps.comeFrom == "summary" ? "fromSummary" : ""} />

                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn}
                        classes={store.siteSettings.userRequestSteps.comeFrom == "summary" ? "fromSummary" : ""} />
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

          </div>
        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep4Form);