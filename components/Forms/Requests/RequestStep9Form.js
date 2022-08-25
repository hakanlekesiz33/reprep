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
//aksesuar seçimi
class RequestStep9Form extends Component {
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
    const accessories = []

    let initialValuesAccessories = '';
    try {
      initialValuesAccessories = store.siteSettings.userRequestSteps.requestStep9FormData.accessories
    }
    catch (e) { }

    //checkbox seçeneklerini getiriyoruz
    currentPage.requestStep9.accessories.map(function (a) {

      accessories.push({
        name: "accessoriesGroup",
        id: a.name,
        label: a.name
      })
    })

    return (
      <CssTransion>
        <>
          <Formik
            initialValues={{
              accessories: initialValuesAccessories
            }}
            validationSchema={null}
            onSubmit={values => {
              const { goSummary } = this.state

              let finalValues = ""
              try {
                values.accessories.map(function (item) {
                  currentPage.requestStep9.accessories.map(function (a) {
                    if (item == a.name) {
                      finalValues = finalValues + a.value + "~|"
                    }
                  })
                })
              }
              catch (e) { }


              finalValues = (finalValues !== "" ? finalValues.substring(0, finalValues.length - 1) : '');

              const requestStep9FormData = {
                accessories: values.accessories,
                finalValues: finalValues
              }

              //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
              const requestSteps = currentPage.requestSteps
              let nextStep = "requestStep9";
              for (let i = 0; i < requestSteps.length - 1; i++) {
                if (requestSteps[i].contentTypeAlias == "requestStep9") {
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
                requestStep9FormData
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
                <Form encType="multipart/form-data" className="requestStep9 f-answer">

                  <div className="grid-wrapper">
                    <div className="f-question-A pr-A translateY-animation">
                      {htmlToReactParser.parse(currentPage.requestStep9.question)}
                    </div>
                    <div className="f-answer-group-A translateY-animation">
                      <CheckBoxesGroup
                        id="accessories"
                        label=""
                        value={values.accessories}
                        error={errors.accessories}
                        touched={touched.accessories}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        checkBoxes={accessories}
                        className={
                          errors.accessories && touched.accessories
                            ? "cb-A ff-A error"
                            : "cb-A ff-A"
                        }
                      />
                    </div>
                    <FBackButton click={() => this.previousStep("requestStep8")} goBack={commonDictionary.goBack}
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

export default connect(initsStore)(RequestStep9Form);