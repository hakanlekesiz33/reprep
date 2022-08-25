import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as config from '../../../config';
import * as Yup from 'yup';
import FSubmitButton from '../../Requests/fSubmitButton';
import InputText from '../Inputs/InputText'
import CssTransion from '../../UI/CssTransition';
import FBackButton from '../../Requests/fBackButton';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

//ad soyad telefon


class RequestStep7Form extends Component {
  state = {
    goSummary: false
  }
  onInputChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value;
    setFieldValue(inputName, inputValue, false)
  }
  onNameChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value
    inputValue = inputValue.replace(/[0-9/()@%+^'=!&}æß{½$#£"]/g, '');//bu karakterler var ise inputtan çıkarıyoruz
    inputValue = inputValue.replace(/[-_*?.:;,~|<>]/g, '');//bu karakterler var ise inputtan çıkarıyoruz

    setFieldValue(inputName, inputValue)
  }

  onPhoneChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value
    inputValue = inputValue.replace(/[^0-9]/g, '');//rakam hariç diğer karakterleri replace ediyor
    if (inputValue.length > 18) {//Girilen karakter 15 karakterden fazla ise son girilen char silinir
      inputValue = inputValue.substring(0, 18)
    }

    setFieldValue(inputName, inputValue)
    // this.setState({ ...this.state, imei: inputValue })
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
    let initialValuesName = '';
    let initialValuesLastName = '';
    let initialValuesPhone = '';
    try {
      initialValuesName = store.siteSettings.userRequestSteps.requestStep7FormData.name
    }
    catch (e) { }
    try {
      initialValuesLastName = store.siteSettings.userRequestSteps.requestStep7FormData.lastName
    }
    catch (e) { }
    try {
      initialValuesPhone = store.siteSettings.userRequestSteps.requestStep7FormData.phone
    }
    catch (e) { }

    if (initialValuesName == '') {
      initialValuesName=store.siteSettings.userRequestSteps.requestStep1FormData.name.split(" ")[0]
    }
    if (initialValuesLastName == '') {
      initialValuesLastName=store.siteSettings.userRequestSteps.requestStep1FormData.name.split(" ").filter((item, index) => index != 0).join(" ")
    }
    return (
      <CssTransion>
        <>
          <Formik
            initialValues={{
              name: initialValuesName,
              lastName: initialValuesLastName,
              phone: initialValuesPhone,
            }}
            validationSchema={Yup.object().shape({

              name: Yup.string()
                .trim()
                .required(commonDictionary.requiredField),
              lastName: Yup.string()
                .trim()
                .required(commonDictionary.requiredField),
              phone: Yup.string()
                .required(commonDictionary.requiredField)
                .min(8, commonDictionary.min8Char)

            })}
            onSubmit={values => {
              const { goSummary } = this.state
              //phone maskelendiği için içinde karakterler var önce onları yok ediyor sonra length bakıyoruz
              // if ((values.phone.replace(/[^0-9]/g, '')).length < 10) {
              //   //en az 10 karakter girilmeli hatası eklenecek
              //   return;
              // }
              const requestStep7FormData = {
                name: values.name,
                lastName: values.lastName,
                phone: values.phone,
              }

              const requestSteps = currentPage.requestSteps
              let nextStep = "requestStep7";
              for (let i = 0; i < requestSteps.length - 1; i++) {
                if (requestSteps[i].contentTypeAlias == "requestStep7") {
                  nextStep = requestSteps[i + 1].contentTypeAlias
                }
              }
              nextStep = goSummary ? "requestSummaryStep" : nextStep
           
              let beforeUserRequestSteps = null;
              if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
              }
              const beforeStep1Data = beforeUserRequestSteps.requestStep1FormData
              const requestStep1FormData = {
                ...beforeStep1Data,
                name: values.name+" "+values.lastName,
              }
              
              const userRequestSteps = {
                ...beforeUserRequestSteps,
                comeFrom: 'default',
                expireDate: new Date().getTime(),
                currentRequestStep: nextStep,
                requestStep1FormData,
                requestStep7FormData
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
                <Form encType="multipart/form-data" className="requestStep7 f-answer">

                  <div className="grid-wrapper">

                    <div className="f-question-A pr-A translateY-animation">
                      {htmlToReactParser.parse(values.name + currentPage.requestStep7.question)}
                    </div>
                    <div className="f-input-group-A first translateY-animation">
                      <div className="f-answer-group-B">
                        <InputText
                          type="name"
                          placeholder=""
                          name="name"
                          id="f-name"
                          value={values.name}
                          onKeyUp={(e) => this.onNameChange(e, "name", setFieldValue)}
                          className={
                            errors.name && touched.name
                              ? values.name.trim().length > 0 ? "tb-A v2 ff-A true error" : "tb-A v2 ff-A error"
                              : values.name.trim().length > 0 ? "tb-A v2 ff-A true" : "tb-A v2 ff-A"
                          }
                        />
                        <label htmlFor="f-name" className="placeholder-A">
                          {commonDictionary.yourName}
                        </label>
                        {errors.name && touched.name ? <div>{errors.name}</div> : null}
                      </div>
                      <div className="f-answer-group-B">
                        <InputText
                          type="name"
                          placeholder=""
                          name="lastName"
                          id="f-lastName"
                          value={values.lastName}
                          onKeyUp={(e) => this.onNameChange(e, "lastName", setFieldValue)}
                          className={
                            errors.lastName && touched.lastName
                              ? values.lastName.trim().length > 0 ? "tb-A v2 ff-A true error" : "tb-A v2 ff-A error"
                              : values.lastName.trim().length > 0 ? "tb-A v2 ff-A true" : "tb-A v2 ff-A"
                          }
                        />
                        <label htmlFor="f-lastName" className="placeholder-A">
                          {commonDictionary.yourLastName}
                        </label>
                        {errors.lastName && touched.lastName ? <div>{errors.lastName}</div> : null}
                      </div>

                    </div>

                    <div className="f-answer-group-B translateY-animation">


                      <InputText
                        type="text"
                        placeholder=""
                        name="phone"
                        id="f-phone"
                        value={values.phone}
                        onKeyUp={(e) => this.onPhoneChange(e, "phone", setFieldValue)}
                        className={
                          errors.phone && touched.phone
                            ? values.phone.trim().length > 0 ? "tb-A v3 ff-A true error" : "tb-A v3 ff-A error"
                            : values.phone.trim().length > 0 ? "tb-A v3 ff-A true" : "tb-A v3 ff-A"
                        }
                      />
                      <label htmlFor="f-phone" className="placeholder-A">
                        {commonDictionary.gsmNo}
                      </label>
                      {errors.phone && touched.phone ? <div>{errors.phone}</div> : null}
                    </div>

                    <FBackButton click={() => this.previousStep("requestStep6")} goBack={commonDictionary.goBack}
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

        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep7Form);