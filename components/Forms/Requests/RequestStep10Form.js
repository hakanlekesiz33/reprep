import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as config from '../../../config';
import * as Yup from 'yup';
import RadioButtonsGroup from '../Inputs/RadioButtonsGroup'
import Modal from '../../UI/Modals/Modal/Modal';
import Passcode from '../../Passcode';
import Pattern from '../../Pattern';
import FSubmitButton from '../../Requests/fSubmitButton';
import CssTransion from '../../UI/CssTransition';
import { getElementsOffsetHeight } from '../../../static/common.js';
import FBackButton from '../../Requests/fBackButton';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
//cihaz şifresi

class RequestStep10Form extends Component {

  state = {
    showPasscode: false,
    showPattern: false,
    goSummary: false
  }
  onInputChange = (e) => {
    if (e.target.value == 'passcode') {
      this.setState({ ...this.state, showPasscode: true });
    }
    else if (e.target.value == 'pattern') {
      this.setState({ ...this.state, showPattern: true });
    }
  }

  closeModal = (value) => {
    if (value == 'passcode') {
      this.setState({ ...this.state, showPasscode: false });
    }
    else if (value == 'pattern') {
      this.setState({ ...this.state, showPattern: false });
    }
  }
  previousStep = (stayCurrentStep, step) => {
    const store = this.props.getState();
    if (stayCurrentStep) {
      let step10PageStatus = {
        ...store.siteSettings.step10PageStatus,
        insideOfStep: true,
        class: "move-down",
        translateYValue1: 0,
      }
      this.props.dispatch(setSiteSettings({ withGrandiant: "", step10PageStatus: step10PageStatus }));
    }
    else {
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
        let step10PageStatus = {
          class: "",
          insideOfStep: false,
          translateYValue1: 0,
        }
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
        this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step10PageStatus: step10PageStatus }));
      }, config.waitToNextComponent);
    }

  }
  goSummaryStep = (submitForm) => {
    this.setState({ ...this.state, goSummary: true })
    submitForm()
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
    let initialIsPass = ''
    let initialPatternOrPasscode = ''
    try {
      initialIsPass = store.siteSettings.userRequestSteps.requestStep10FormData.passExist
    }
    catch (e) { }
    try {
      initialPatternOrPasscode = store.siteSettings.userRequestSteps.requestStep10FormData.patternOrPasscode
    }
    catch (e) { }
    return (
      <CssTransion>
        <>
          <Modal show={this.state.showPasscode} clicked={() => this.closeModal("passcode")} type='modal-type-01'>
            <Passcode clicked={() => this.closeModal("passcode")} />
          </Modal >
          <Modal show={this.state.showPattern} clicked={() => this.closeModal("pattern")} type='modal-type-01'>
            <Pattern clicked={() => this.closeModal("pattern")} />
          </Modal>

          <div className="clickGrandiant" onClick={() => this.previousStep(true, "move-down")}></div>
          <div className={"citem-01 " + store.siteSettings.step10PageStatus.class}>

            <Formik
              initialValues={{
                isPass: initialIsPass
              }}
              validationSchema={Yup.object().shape({
                isPass: Yup.string().required(commonDictionary.requiredField)
              })}
              onSubmit={values => {
                const { goSummary } = this.state
                if (values.isPass == 'exist') {

                  //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                  let beforeUserRequestSteps = null;
                  if (localStorage.getItem('userRequestSteps') != null) {
                    beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                  }
                  const requestStep10FormData = {
                    finalValues: "~|~|~|~|~",
                    ...beforeUserRequestSteps.requestStep10FormData,
                    passExist: 'exist'

                  }
                  //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                  const userRequestSteps = {
                    ...beforeUserRequestSteps,
                    expireDate: new Date().getTime(),
                    requestStep10FormData
                  }
                  //marka seçildiği için model e active classı ekliyoruz
                  let translateYValue1 = getElementsOffsetHeight("citem-01", "translateY-animation")
                  translateYValue1 = -(translateYValue1 + config.translateYTopValue)
                  let step10PageStatus = {
                    class: "active move-up",
                    insideOfStep: true,
                    translateYValue1: translateYValue1
                  }

                  localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                  this.props.dispatch(setSiteSettings({ withGrandiant: "withGrandiant", userRequestSteps: userRequestSteps, step10PageStatus: step10PageStatus }));

                }
                else {
                  const requestSteps = currentPage.requestSteps

                  let nextStep = "requestStep10";
                  for (let i = 0; i < requestSteps.length - 1; i++) {
                    if (requestSteps[i].contentTypeAlias == "requestStep10") {
                      nextStep = requestSteps[i + 1].contentTypeAlias
                    }
                  }
                  nextStep = goSummary ? "requestSummaryStep" : nextStep

                  //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                  let beforeUserRequestSteps = null;
                  if (localStorage.getItem('userRequestSteps') != null) {
                    beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                  }
                  const requestStep10FormData = {
                    finalValues: "~|~|~|~|~",
                    passExist: 'notExist'
                  }
                  //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                  const userRequestSteps = {
                    ...beforeUserRequestSteps,
                    comeFrom: 'default',
                    expireDate: new Date().getTime(),
                    currentRequestStep: nextStep,
                    requestStep10FormData
                  }

                  document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                  setTimeout(() => {
                    document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                    let step10PageStatus = {
                      class: "",
                      insideOfStep: false,
                      translateYValue1: 0
                    }
                    localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                    this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step10PageStatus: step10PageStatus }));
                  }, config.waitToNextComponent);
                }
              }}

            >
              {(formikProps) => {
                const { errors, touched, values, handleSubmit, setFieldValue,
                  setFieldTouched } = formikProps;
                return (
                  <Form encType="multipart/form-data" className="requestStep10 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step10PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        {htmlToReactParser.parse(currentPage.requestStep10.question1)}
                      </div>
                      <div className="f-answer-group-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step10PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        <RadioButtonsGroup
                          id="isPass"
                          label=""
                          value={values.isPass}
                          error={errors.isPass}
                          touched={touched.isPass}
                          radioButtons={[
                            { name: 'isPass', id: 'exist', label: commonDictionary.exist },
                            { name: 'isPass', id: 'notExist', label: commonDictionary.notExist }
                          ]}
                          className={
                            errors.isPass && touched.isPass
                              ? "rb-A ff-A error"
                              : "rb-A ff-A"
                          }
                        />
                      </div>
                      <FBackButton click={() => this.previousStep(false, "requestStep9")} goBack={commonDictionary.goBack}
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
          <div className={"citem-02 " + store.siteSettings.step10PageStatus.class}>

            <Formik
              initialValues={{
                PatternOrPasscode: initialPatternOrPasscode
              }}
              validationSchema={Yup.object().shape({
                PatternOrPasscode: Yup.string().required(commonDictionary.requiredField)
              })}
              onSubmit={values => {
                const { goSummary } = this.state

                if (values.PatternOrPasscode == 'pattern') {

                  let pattern = '';
                  try {
                    pattern = store.siteSettings.pattern
                  }
                  catch (e) { }
                  if (pattern == '') {
                    //pattern çizilmemiş
                    return;
                  }

                  const requestSteps = currentPage.requestSteps
                  let nextStep = "requestStep10";
                  for (let i = 0; i < requestSteps.length - 1; i++) {
                    if (requestSteps[i].contentTypeAlias == "requestStep10") {
                      nextStep = requestSteps[i + 1].contentTypeAlias
                    }
                  }
                  nextStep = goSummary ? "requestSummaryStep" : nextStep

                  //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                  let beforeUserRequestSteps = null;
                  if (localStorage.getItem('userRequestSteps') != null) {
                    beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                  }
                  const requestStep10FormData = {
                    ...beforeUserRequestSteps.requestStep10FormData,
                    pattern: pattern,
                    passCode: [],
                    patternOrPasscode: 'pattern',
                    finalValues: '~|Entsperrmuster~' + pattern + '|~|~|~'
                  }
                  //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                  const userRequestSteps = {
                    ...beforeUserRequestSteps,
                    comeFrom: 'default',
                    expireDate: new Date().getTime(),
                    currentRequestStep: nextStep,
                    requestStep10FormData
                  }
                  document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                  setTimeout(() => {
                    document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                    let step10PageStatus = {
                      class: "",
                      insideOfStep: false,
                      translateYValue1: 0
                    }
                    localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                    this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step10PageStatus: step10PageStatus }));
                  }, config.waitToNextComponent);
                }
                else if (values.PatternOrPasscode == 'passcode') {

                  let passCode = store.siteSettings.passcode
                  if (passCode.length == 0) {
                    //passCode girilmemiş
                    return;
                  }



                  const requestSteps = currentPage.requestSteps

                  let nextStep = "requestStep10";
                  for (let i = 0; i < requestSteps.length - 1; i++) {
                    if (requestSteps[i].contentTypeAlias == "requestStep10") {
                      nextStep = requestSteps[i + 1].contentTypeAlias
                    }
                  }
                  nextStep = goSummary ? "requestSummaryStep" : nextStep

                  //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                  let beforeUserRequestSteps = null;
                  if (localStorage.getItem('userRequestSteps') != null) {
                    beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                  }
                  const requestStep10FormData = {
                    ...beforeUserRequestSteps.requestStep10FormData,
                    pattern: '',
                    passCode: passCode,
                    patternOrPasscode: 'passCode',
                    finalValues: '~|~|Kostenpfl. Rep.~' + passCode.join('') + '|~|~'
                  }

                  //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                  const userRequestSteps = {
                    ...beforeUserRequestSteps,
                    comeFrom: 'default',
                    expireDate: new Date().getTime(),
                    currentRequestStep: nextStep,
                    requestStep10FormData
                  }
                  document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                  setTimeout(() => {
                    document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                    let step10PageStatus = {
                      class: "",
                      insideOfStep: false,
                      translateYValue1: 0
                    }
                    localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                    this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step10PageStatus: step10PageStatus }));
                  }, config.waitToNextComponent);
                }
              }}

            >
              {(formikProps) => {
                const { errors, touched, values, handleSubmit, setFieldValue,
                  setFieldTouched } = formikProps;
                return (
                  <Form encType="multipart/form-data" className="requestStep10 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation">
                        {htmlToReactParser.parse(currentPage.requestStep10.question2)}
                      </div>
                      <div className="f-answer-group-A translateY-animation">
                        <RadioButtonsGroup
                          id="PatternOrPasscode"
                          label=""
                          value={values.PatternOrPasscode}
                          error={errors.PatternOrPasscode}
                          touched={touched.PatternOrPasscode}
                          radioButtons={[
                            { name: 'PatternOrPasscode', id: 'pattern', label: commonDictionary.drawPattern, onSelect: ((e) => this.onInputChange(e)) },
                            { name: 'PatternOrPasscode', id: 'passcode', label: commonDictionary.enterPasscode, onSelect: ((e) => this.onInputChange(e)) }
                          ]}
                          className={
                            errors.PatternOrPasscode && touched.PatternOrPasscode
                              ? "rb-A ff-A error"
                              : "rb-A ff-A"
                          }
                        />
                      </div>
                      <FBackButton click={() => this.previousStep(true, "requestStep10")} goBack={commonDictionary.goBack}
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

export default connect(initsStore)(RequestStep10Form);