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
import FBackButton from '../../Requests/fBackButton';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
//symptom seçimi sonrası tekrar syptom seçmek isterse
class RequestStep5Form extends Component {

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
  render() {

    const { currentPage, commonDictionary,userRequestSteps } = this.props.getState().siteSettings;
    return (
      <CssTransion>
        <>
          <Formik
            initialValues={{
              isAnotherSymptom: '',
            }}
            validationSchema={Yup.object().shape({
              isAnotherSymptom: Yup.string().required(commonDictionary.requiredField)
            })}
            onSubmit={values => {


              //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
              const requestSteps = currentPage.requestSteps

              let nextStep = "requestStep5";
              if (values.isAnotherSymptom == 'notExist') {
                for (let i = 0; i < requestSteps.length - 1; i++) {
                  if (requestSteps[i].contentTypeAlias == "requestStep5") {
                    nextStep = requestSteps[i + 1].contentTypeAlias
                  }
                }
              }
              else {
                nextStep = "requestStep4";
              }

              let beforeUserRequestSteps = null;

              //kullanıcınun doldurduğu formlar bu objede tutuluyor 
              if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
              }

              const userRequestSteps = {
                ...beforeUserRequestSteps,
                expireDate: new Date().getTime(),
                currentRequestStep: nextStep,
              }
              document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
              setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                //localStorage'a kayıt edildi
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

                //redux'a kayıt edildi
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
                let isSymptomActive = '';
                this.props.dispatch(setSiteSettings({ isSymptomActive: isSymptomActive }));
              }, config.waitToNextComponent);


            }}
          >
            {({ errors, touched, values, handleSubmit, setFieldValue,
              setFieldTouched }) => (
                <Form encType="multipart/form-data" className="requestStep5 f-answer">

                  <div className="grid-wrapper">
                    <div className="f-question-A pr-A translateY-animation">
                      {
                        htmlToReactParser.parse(userRequestSteps.requestStep4FormData.Symptoms.length==1 &&
                        currentPage.requestStep5.question)
                      }
                       {
                        htmlToReactParser.parse(userRequestSteps.requestStep4FormData.Symptoms.length>1 &&
                        currentPage.requestStep5.question2)
                      }
                    </div>
                    <div className="f-answer-group-A translateY-animation">
                      <RadioButtonsGroup
                        id="isAnotherSymptom"
                        label=""
                        value={values.isAnotherSymptom}
                        error={errors.isAnotherSymptom}
                        touched={touched.isAnotherSymptom}
                        radioButtons={[
                          { name: 'isAnotherSymptom', id: 'exist', label: currentPage.requestStep5.exist },
                          { name: 'isAnotherSymptom', id: 'notExist', label: currentPage.requestStep5.notExist }
                        ]}
                        className={
                          errors.isAnotherSymptom && touched.isAnotherSymptom
                            ? "rb-A ff-A error"
                            : "rb-A ff-A"
                        }
                      />
                    </div>
                    <FBackButton click={() => this.previousStep("requestStep4")} goBack={commonDictionary.goBack} />

                    <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />

                  </div>

                </Form>
              )}
          </Formik>

        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep5Form);