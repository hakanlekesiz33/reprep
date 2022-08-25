import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as config from '../../../config';
import FSubmitButton from '../../Requests/fSubmitButton';
import DragDropFile from '../../UI/DragDropFile'
import CssTransion from '../../UI/CssTransition';
import FBackButton from '../../Requests/fBackButton';
import InputTextArea from '../Inputs/InputTextArea'
import { getElementsOffsetHeight } from '../../../static/common.js';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
//dosya ve not

class RequestStep12Form extends Component {
  previousStep = (stayCurrentStep, step) => {
    const store = this.props.getState();
    if (stayCurrentStep) {
      let step12PageStatus = {
        ...store.siteSettings.step12PageStatus,
        insideOfStep: true,
        class: "move-down",
        translateYValue1: 0,
      }
      this.props.dispatch(setSiteSettings({ withGrandiant: "", step12PageStatus: step12PageStatus }));
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
        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
      }, config.waitToNextComponent);
    }

  }
  onInputChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value;
    setFieldValue(inputName, inputValue, false)
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;

    let initialValuesNote = '';

    try {
      const vall = store.siteSettings.userRequestSteps.requestStep12FormData.note
      initialValuesNote = vall == undefined ? "" : vall
    }
    catch (e) {
    }
    return (
      <CssTransion>
        <>
          <div className="clickGrandiant" onClick={() => this.previousStep(true, "move-down")}></div>
          <div className={"citem-01 " + store.siteSettings.step12PageStatus.class}>
            <Formik
              initialValues={null}
              validationSchema={null}
              onSubmit={values => {
                //2. soruya active classı ekliyoruz
                let translateYValue1 = getElementsOffsetHeight("citem-01", "translateY-animation")
                translateYValue1 = -(translateYValue1 + config.translateYTopValue+10)
                let step12PageStatus = {
                  class: "active move-up",
                  insideOfStep: true,
                  translateYValue1: translateYValue1
                }

                this.props.dispatch(setSiteSettings({ withGrandiant: "withGrandiant", step12PageStatus: step12PageStatus }));

                //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                let beforeUserRequestSteps = null;
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }
                const requestStep12FormData = {
                  ...beforeUserRequestSteps.requestStep12FormData,
                  note: initialValuesNote
                }
                //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                const userRequestSteps = {
                  ...beforeUserRequestSteps,
                  comeFrom: 'default',
                  expireDate: new Date().getTime(),
                  requestStep12FormData
                }
                //localStorage'a kayıt edildi
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

                //redux'a kayıt edildi
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
              }}

            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep12 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step12PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        {htmlToReactParser.parse(currentPage.requestStep12.question)}
                      </div>

                      <div className="f-answer-group-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step12PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        <DragDropFile
                          text1={currentPage.requestStep12.text1}
                          text2={currentPage.requestStep12.text2}
                          text3={currentPage.requestStep12.text3}
                          text4={commonDictionary.addFile}
                        />
                      </div>
                      <FBackButton click={() => this.previousStep(false, "requestStep11")} goBack={commonDictionary.goBack} />

                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />

                    </div>

                  </Form>
                )}
            </Formik>
          </div>
          <div className={"citem-02 " + store.siteSettings.step12PageStatus.class}>
            <Formik
              initialValues={{
                note: initialValuesNote,
              }}
              validationSchema={null}
              onSubmit={values => {


                let beforeUserRequestSteps = null;
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }

                const requestStep12FormData = {
                  ...beforeUserRequestSteps.requestStep12FormData,
                  note: values.note
                }

                let nextStep = "requestSummaryStep";
                //kullanıcının doldurduğu formlar bu objede tutuluyor 
                const userRequestSteps = {
                  ...beforeUserRequestSteps,
                  comeFrom: 'default',
                  expireDate: new Date().getTime(),
                  currentRequestStep: nextStep,
                  requestStep12FormData
                }

                document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                setTimeout(() => {
                  document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                  //localStorage'a kayıt edildi
                  localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                  let step12PageStatus = {
                    class: "",
                    insideOfStep: false,
                    translateYValue1: 0
                  }
                  //redux'a kayıt edildi
                  this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step12PageStatus: step12PageStatus }));
                }, config.waitToNextComponent);
              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep12 f-answer">


                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation">
                      {htmlToReactParser.parse(currentPage.requestStep12.note)}
                      </div>

                      <div className="f-answer-group-A translateY-animation">
                        <div className="inputTextArea-typeA">
                          <InputTextArea
                            type="text"
                            placeholder=""
                            name="note"
                            id="f-note"
                            rows={6}
                            value={values.note}
                            onKeyUp={ev => this.onInputChange(ev, "note", setFieldValue)}
                            className={
                              values.note != "" ? "ta-A ff-A true" : "ta-A ff-A"
                            }
                          />
                          <label htmlFor="f-note" className="placeholder-A">
                            {commonDictionary.yourNote}
                          </label>
                        </div>



                      </div>
                      <FBackButton click={() => this.previousStep(true, "move-down")} goBack={commonDictionary.goBack} />
                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                    </div>
                  </Form>
                )}
            </Formik>

          </div>

        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep12Form);