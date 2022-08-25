import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as config from '../../../config';
import CheckBoxesGroup from '../Inputs/CheckBoxesGroup'
import FSubmitButton from '../../Requests/fSubmitButton';
import CssTransion from '../../UI/CssTransition';
import FBackButton from '../../Requests/fBackButton';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
//ek hizmetler
class RequestStep11Form extends Component {
  state = {
    goSummary: false
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
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
    }, config.waitToNextComponent);
  }
  goSummaryStep = (submitForm) => {
    this.setState({ ...this.state, goSummary: true })
    submitForm()
  }


  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
    const additionalServices = []

    let initialValuesAdditionalServices = [];
    try {
      const finalResult = store.siteSettings.userRequestSteps.requestStep11FormData.finalAdditionalServices
      finalResult.map(function (item){
        initialValuesAdditionalServices.push(item.service)
      })
    }
    catch (e) { }

    //checkbox seçeneklerini getiriyoruz
    currentPage.requestStep11.additionalService.map(function (as) {
      let price = 0;
      if (store.siteSettings.userRequestSteps.modelPrices != "") {
        store.siteSettings.userRequestSteps.modelPrices.map(function (mp) {
          if (mp.Barcode1 == as.barcode1) {
            price = mp.Price
          }
        })
      }

      additionalServices.push({
        name: "additionalServicesGroup",
        id: as.barcode1,
        //label: (as.name + " " + '<strong>(' + price + '€)</strong>')
        label: as.name
      })
    })

    return (
      <CssTransion>
        <>
          <Formik
            initialValues={{
              additionalServices: initialValuesAdditionalServices
            }}
            validationSchema={null}
            onSubmit={values => {
              const { goSummary } = this.state

              let newAddServices = []
              let valuesAddServices = []

              values.additionalServices.map(function (m) {
                let total = 0;
                let service = '';
                let serviceLong=''
                if (store.siteSettings.userRequestSteps.modelPrices != "") {
                  store.siteSettings.userRequestSteps.modelPrices.map(function (mp) {
                    if (mp.Barcode1 == m) {
                      total = mp.Price
                    }
                  })
                }

                currentPage.requestStep11.additionalService.map(function (as) {
                  if (as.barcode1 == m) {
                    service = as.shortName
                    serviceLong = as.name
                  }
                })
                newAddServices.push({
                  service: service,
                  fService:m,
                  total: total,
                  serviceLong:serviceLong
                })
                valuesAddServices.push({
                  service: m,
                  total: total,
                  serviceLong:serviceLong
                })
              })

              const requestStep11FormData = {
                additionalServices: newAddServices,
                finalAdditionalServices: valuesAddServices
              }

              //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
              const requestSteps = currentPage.requestSteps
              let nextStep = "requestStep11";
              for (let i = 0; i < requestSteps.length - 1; i++) {
                if (requestSteps[i].contentTypeAlias == "requestStep11") {
                  nextStep = requestSteps[i + 1].contentTypeAlias
                }
              }
              nextStep = goSummary ? "requestSummaryStep" : nextStep
              //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
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
                requestStep11FormData
              }

              document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
              setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
              }, config.waitToNextComponent);
            }}

          >
          {(formikProps) => {
              const { errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched } = formikProps;
              return (
                <Form encType="multipart/form-data" className="requestStep11 f-answer">

                  <div className="grid-wrapper">
                    <div className="f-question-A pr-A translateY-animation">
                      {htmlToReactParser.parse(store.siteSettings.userRequestSteps.requestStep7FormData.name +
                      currentPage.requestStep11.question)}
                    </div>
                    <div className="f-answer-group-A translateY-animation">
                      <CheckBoxesGroup
                        id="additionalServices"
                        label=""
                        value={values.additionalServices}
                        error={errors.additionalServices}
                        touched={touched.additionalServices}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        checkBoxes={additionalServices}
                        className={
                          errors.additionalServices && touched.additionalServices
                            ? "cb-A ff-A error"
                            : "cb-A ff-A"
                        }
                      />
                    </div>
                    <FBackButton click={() => this.previousStep("requestStep10")} goBack={commonDictionary.goBack}
                         classes={store.siteSettings.userRequestSteps.comeFrom == "summary" ? "fromSummary":""}   />
                   
                   <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} 
                         classes={store.siteSettings.userRequestSteps.comeFrom == "summary" ? "fromSummary":""}   />
                   {
                      store.siteSettings.userRequestSteps.comeFrom == "summary" &&
                      <FBackButton click={() => this.goSummaryStep(formikProps.submitForm)} 
                      goBack={commonDictionary.complete} classes="summary" />

                    }
                  </div>
                </Form>
              )}}
          </Formik>
        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep11Form);