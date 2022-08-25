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
class RequestStep2Form extends Component {

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
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
    let initialValuesIsGuarantee = '';
    try {
      initialValuesIsGuarantee = store.siteSettings.userRequestSteps.requestStep2FormData.isGuarantee
    }
    catch (e) { }


    return (
      <CssTransion>
        <Formik
          initialValues={{
            isGuarantee: initialValuesIsGuarantee,
          }}
          validationSchema={Yup.object().shape({
            isGuarantee: Yup.string().required(commonDictionary.requiredField)
          })}
          onSubmit={values => {

            //şuanki formun objesi
            const requestStep2FormData = {
              isGuarantee: values.isGuarantee
            }

            //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
            const requestSteps = currentPage.requestSteps
            let nextStep = "requestStep2";
            for (let i = 0; i < requestSteps.length - 1; i++) {
              if (requestSteps[i].contentTypeAlias == "requestStep2") {
                nextStep = requestSteps[i + 1].contentTypeAlias
              }
            }
            let beforeUserRequestSteps = null;
            //kullanıcınun doldurduğu formlar bu objede tutuluyor 
            if (localStorage.getItem('userRequestSteps') != null) {
              beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
            }


            const userRequestSteps = {
              ...beforeUserRequestSteps,
              expireDate: new Date().getTime(),
              comeFrom: 'default',
              currentRequestStep: nextStep,
              requestStep2FormData,
              requestStep3FormData: null, //model marka bilgileri varsa temizleniyor
              requestStep4FormData: null, //symptoms bilgileri varsa temizleniyor
              requestStep11FormData: null //additional info bilgileri varsa temizleniyor
            }
            document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
            setTimeout(() => {
              document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
              localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
              this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
            }, config.waitToNextComponent);


          }}
        >
          {({ errors, touched, values, handleSubmit, setFieldValue,
            setFieldTouched }) => (
              <Form encType="multipart/form-data" className="requestStep2 f-answer">

                <div className="grid-wrapper">

                  <div className="f-question-A pr-A translateY-animation"
                    style={{
                      transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue1 + "px)"
                    }}
                  >
                    {htmlToReactParser.parse(currentPage.requestStep2.text1
                      + " " + store.siteSettings.userRequestSteps.requestStep1FormData.name
                      + " " + currentPage.requestStep2.text2)}
                  </div>
                  <div className="f-answer-group-A">
                    <RadioButtonsGroup
                      id="isGuarantee"
                      label=""
                      value={values.isGuarantee}
                      error={errors.isGuarantee}
                      touched={touched.isGuarantee}
                      radioButtons={[
                        { name: 'isGuarantee', id: 'exist', label: commonDictionary.exist },
                        { name: 'isGuarantee', id: 'notExist', label: commonDictionary.notExist }
                      ]}
                      className={
                        errors.isGuarantee && touched.isGuarantee
                          ? "rb-A ff-A error"
                          : "rb-A ff-A"
                      }
                    />
                  </div>
                  <FBackButton click={() => this.previousStep("requestStep1")} goBack={commonDictionary.goBack}/>
                   
                  <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />

                </div>

              </Form>
            )}
        </Formik>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep2Form);