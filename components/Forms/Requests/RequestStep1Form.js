import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { fetchUserInfo } from '../../../store/actions/loginUser';
import axios from 'axios'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as config from '../../../config';
import InputText from '../Inputs/InputText';
import FacebookGoogleLogin from '../../UI/FacebookGoogleLogin'
import CheckBox from '../Inputs/CheckBox';
import FSubmitButton from '../../Requests/fSubmitButton';
import CssTransion from '../../UI/CssTransition';
import { getElementsOffsetHeight } from '../../../static/common.js';
import FBackButton from '../../Requests/fBackButton';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();


class RequestStep1Form extends Component {

  state = {
    name: '',
    email: '',
    alternativeLoginType: '',
    isAlternativeLoginedUser: false,
  }

  onInputChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[0-9/()@%+^'=!&}æß{½$#£"]/g, '');//bu karakterler var ise inputtan çıkarıyoruz
    inputValue = inputValue.replace(/[-_*?.:;,~|<>]/g, '');//bu karakterler var ise inputtan çıkarıyoruz
    setFieldValue(inputName, inputValue, false)
  }
  onEmailChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value;
    setFieldValue(inputName, inputValue, false)
  }
  forgetPass = (requestPageUrl) => {
    const _this = this
    const store = this.props.getState()

    this.props.dispatch(setSiteSettings({ showLayer: true }));

    axios.get(config.resetPassword + '?email=' + _this.state.email + '&redirectUrl=request')
      .then(function (response) {
        if (response.data.result) {
          let translateYValue3 = getElementsOffsetHeight("citem-03", "translateY-animation")
          translateYValue3 = -(translateYValue3 + config.translateYTopValue)
          let step1PageStatus = {
            class: "active3 move-up",
            insideOfStep: true,
            translateYValue1: translateYValue3 + store.siteSettings.step1PageStatus.translateYValue1,
            translateYValue2: translateYValue3 + store.siteSettings.step1PageStatus.translateYValue2,
            translateYValue3: translateYValue3
          }

          _this.props.dispatch(setSiteSettings({ showLayer: false, step1PageStatus: step1PageStatus }));

        }
      });
  }
  previousStep = (stayCurrentStep, classes,setFieldValue) => {
    if(setFieldValue){
      setFieldValue("resetPwCode", "", false)
      setFieldValue("cPassword", "", false)
      setFieldValue("passwordConfirmation", "", false)

    }
    if (stayCurrentStep) {
      let step1PageStatus = {
        ...this.props.getState().siteSettings.step1PageStatus,
        insideOfStep: true,
        class: classes,
        translateYValue1: 0,
        translateYValue2: 0,
        translateYValue3: 0
      }
      this.props.dispatch(setSiteSettings({ step1PageStatus: step1PageStatus, withGrandiant: '' }));
    }
  }

  render() {
    const _this = this
    const store = this.props.getState();
    const { currentPage, commonDictionary, currPageLangSettings } = store.siteSettings;
    const requestPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/request").filter((link) => link.lang == currPageLangSettings.lang))[0].url

    let initialValuesName = '';
    let initialValuesEmail = '';

    try {
      initialValuesName = store.siteSettings.userRequestSteps.requestStep1FormData.name
    }
    catch (e) { }
    try {
      if (store.siteSettings.userRequestSteps.requestStep1FormData.email) {
        initialValuesEmail = store.siteSettings.userRequestSteps.requestStep1FormData.email
      }
    }
    catch (e) { }
    try {
      if (store.siteSettings.step1PageStatus.insideOfStep) {
        insideOfStep = store.siteSettings.step1PageStatus.insideOfStep
      }
    }
    catch (e) { }
    return (
      <CssTransion>
        <>
          <div className="clickGrandiant" onClick={() => this.previousStep(true, "move-down")}></div>
          <div className={"citem-01 " + store.siteSettings.step1PageStatus.class}>
            <Formik
              initialValues={{
                name: initialValuesName,
              }}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string()
                    .required(commonDictionary.requiredField),
                })
              }
              onSubmit={values => {
                this.props.dispatch(setSiteSettings({ showLayer: true }));

                //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                let beforeUserRequestSteps = null;
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }
                const beforeStep1Data = beforeUserRequestSteps != null ? beforeUserRequestSteps.requestStep1FormData : null
                const requestStep1FormData = {
                  ...beforeStep1Data,
                  name: values.name,
                }

                const userRequestSteps = {
                  ...beforeUserRequestSteps,
                  expireDate: new Date().getTime(),
                  comeFrom: 'default',
                  currentRequestStep: "requestStep1",
                  requestStep1FormData,
                }

                let translateYValue1 = getElementsOffsetHeight("citem-01", "translateY-animation")
                translateYValue1 = -(translateYValue1 + config.translateYTopValue)
                let step1PageStatus = {
                  class: "active move-up",
                  insideOfStep: true,
                  translateYValue1: translateYValue1,
                  translateYValue2: 0,
                  translateYValue3: 0,
                }

                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                this.props.dispatch(setSiteSettings({ withGrandiant: "withGrandiant", step1PageStatus: step1PageStatus, userRequestSteps: userRequestSteps, showLayer: false }));
                this.setState({ ...this.state, name: values.name })

              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep1 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        {htmlToReactParser.parse(currentPage.requestStep1.question)}
                      </div>

                      <div className="f-answer-group-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        <InputText
                          type="text"
                          placeholder=""
                          name="name"
                          id="f-name"
                          value={values.name}
                          onKeyUp={ev => this.onInputChange(ev, "name", setFieldValue)}
                          className={
                            errors.name && touched.name
                              ? values.name.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                              : values.name.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                          }
                        />
                        <label htmlFor="f-name" className="placeholder-A">
                          {commonDictionary.firstAndlastName}
                        </label>
                        {errors.name && touched.name ? <div className="ff-C">{errors.name}</div> : null}

                      </div>
                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                    </div>

                  </Form>
                )}
            </Formik>
          </div>
          <div className={"citem-02 " + store.siteSettings.step1PageStatus.class}>
            <Formik
              initialValues={{
                email: initialValuesEmail,
              }}
              validationSchema={
                Yup.object().shape({
                  email: Yup.string()
                    .email(commonDictionary.invalidEmail)
                    .required(commonDictionary.requiredField),
                })
              }
              onSubmit={values => {
                const name = this.state.name
                //şuanki formun objesi
                const requestStep1FormData = {
                  name: name,
                  email: values.email
                }

                //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
                const requestSteps = currentPage.requestSteps
                let nextStep = "requestStep1"
                for (let i = 0; i < requestSteps.length - 1; i++) {
                  if (requestSteps[i].contentTypeAlias == "requestStep1") {
                    nextStep = requestSteps[i + 1].contentTypeAlias
                  }
                }
                //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                let beforeUserRequestSteps = null;
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }
                this.props.dispatch(setSiteSettings({ showLayer: true }));

                axios.get(config.checkUser + values.email)
                  .then(function (res) {
                    if (!res.data.userExist) {//kullanıcı yok ise sonraki step'e geçiliyor
                      //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                      const userRequestSteps = {
                        ...beforeUserRequestSteps,
                        expireDate: new Date().getTime(),
                        comeFrom: 'default',
                        currentRequestStep: nextStep,
                        requestStep1FormData
                      }
                      let step1PageStatus = {
                        class: "",
                        insideOfStep: false,
                        translateYValue1: 0,
                        translateYValue2: 0,
                        translateYValue3: 0
                      }
                      document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                      setTimeout(() => {
                        document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                        //localStorage'a kayıt edildi
                        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

                        _this.props.dispatch(setSiteSettings({ showLayer: false, userRequestSteps: userRequestSteps, step1PageStatus: step1PageStatus, withGrandiant: '' }));
                      }, config.waitToNextComponent);



                    }
                    else {//kullnaıcı var ise login edilip sonraki stepe geçilecek login etme işlemi bu step'in 3. adımında gerçekleşecek

                      const userRequestSteps = {
                        ...beforeUserRequestSteps,
                        expireDate: new Date().getTime(),
                        comeFrom: 'default',
                        currentRequestStep: 'requestStep1',
                        requestStep1FormData,
                      }
                      //localStorage'a kayıt edildi
                      const isAlternativeLoginedUser = res.data.isAlternativeLoginedUser ? res.data.isAlternativeLoginedUser : false
                      const alternativeLoginType = isAlternativeLoginedUser ? res.data.alternativeLoginType : ''
                      _this.setState({
                        ..._this.state,
                        email: values.email,
                        isAlternativeLoginedUser: isAlternativeLoginedUser,
                        alternativeLoginType: alternativeLoginType
                      })

                      let translateYValue2 = getElementsOffsetHeight("citem-02", "translateY-animation")
                      translateYValue2 = -(translateYValue2 + config.translateYTopValue)
                      let step1PageStatus = {
                        class: "active2 move-up",
                        insideOfStep: true,
                        translateYValue1: translateYValue2 + store.siteSettings.step1PageStatus.translateYValue1,
                        translateYValue2: translateYValue2,
                        translateYValue3: 0,
                      }

                      localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                      _this.props.dispatch(setSiteSettings({ showLayer: false, step1PageStatus: step1PageStatus, userRequestSteps: userRequestSteps }));

                    }
                  })
              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep1 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue2 + "px)"
                        }}
                      >
                        {htmlToReactParser.parse(commonDictionary.hello + " " + this.state.name.split(" ")[0] + currentPage.requestStep1.question2)}
                      </div>

                      <div className="f-answer-group-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue2 + "px)"
                        }}
                      >
                        <InputText
                          type="text"
                          placeholder=""
                          name="email"
                          id="f-email"
                          value={values.email}
                          onKeyUp={ev => this.onEmailChange(ev, "email", setFieldValue)}
                          className={
                            errors.email && touched.email
                              ? values.email.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                              : values.email.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                          }
                        />
                        <label htmlFor="f-email" className="placeholder-A">
                          {commonDictionary.ePosta}
                        </label>
                        {errors.email && touched.email ? <div className="ff-C">{errors.email}</div> : null}

                      </div>
                      <FBackButton click={() => this.previousStep(true, "move-down")} goBack={commonDictionary.goBack} />
                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                    </div>
                  </Form>
                )}
            </Formik>
          </div>
          <div className={"citem-03 " + store.siteSettings.step1PageStatus.class}>
            {

              this.state.isAlternativeLoginedUser ? (
                <div className="requestStep1 f-answer">
                  <div className="grid-wrapper">
                    <div className="f-question-A pr-A translateY-animation"
                      style={{
                        transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue3 + "px)"
                      }}
                    >
                      {htmlToReactParser.parse(currentPage.requestStep1.alternativeEnterText)}

                    </div>
                    <div className="f-answer-group-A alternativeLoginArea translateY-animation"
                      style={{
                        transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue3 + "px)"
                      }}
                    >
                      <FacebookGoogleLogin alternativeLoginType={this.state.alternativeLoginType} redirectUrl={requestPageUrl} />
                    </div>
                  </div>
                </div>

              ) : (
                  <Formik

                    initialValues={{
                      email2: '',
                      password: '',
                      //rememberMe: false
                    }}
                    validationSchema={
                      Yup.object().shape({
                        password: Yup.string()
                          .required(commonDictionary.requiredField),
                      })
                    }
                    onSubmit={values => {
                      const rememberMe = false
                      const user = {
                        Email: _this.state.email,
                        Password: values.password,
                        Code: "",
                      }
                      var bodyFormData = new FormData();
                      bodyFormData.append('loginForm', JSON.stringify(user));
                      const headers = {
                        'Content-Type': 'multipart/form-data'
                      }
                      this.props.dispatch(setSiteSettings({ showLayer: true }));

                      axios.post(config.login, bodyFormData, {
                        headers: headers
                      })
                        .then(function (response) {

                          if (response.data.login) {
                            const userLogin = {
                              ...response.data,
                              rememberMe: rememberMe,
                              expireDate: new Date().getTime()
                            }

                            if (rememberMe) {
                              localStorage.setItem('userLogin', JSON.stringify(userLogin))
                            }
                            else {
                              localStorage.removeItem('userLogin')
                            }
                            sessionStorage.setItem('userLogin', JSON.stringify(userLogin))

                            _this.props.dispatch(fetchUserInfo(userLogin))

                            //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
                            const requestSteps = currentPage.requestSteps
                            let nextStep = "requestStep1"
                            for (let i = 0; i < requestSteps.length - 1; i++) {
                              if (requestSteps[i].contentTypeAlias == "requestStep1") {
                                nextStep = requestSteps[i + 1].contentTypeAlias
                              }
                            }

                            //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                            let beforeUserRequestSteps = null;
                            if (localStorage.getItem('userRequestSteps') != null) {
                              beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                            }
                            const requestStep1FormData = {
                              name: _this.state.name,
                              email: _this.state.email,
                              id: userLogin.user.id
                            }
                            const requestStep7FormData = {
                              name: userLogin.user.name != null ? userLogin.user.name : "",
                              lastName: userLogin.user.lastName != null ? userLogin.user.lastName : "",
                              phone: userLogin.user.phone != null ? userLogin.user.phone : "",
                            }
                            const requestStep8FormData = {
                              adress: userLogin.user.adress != null ? userLogin.user.adress : "",
                              postCode: userLogin.user.postalCode != null ? userLogin.user.postalCode : "",
                            }

                            const userRequestSteps = {
                              ...beforeUserRequestSteps,
                              expireDate: new Date().getTime(),
                              comeFrom: 'default',
                              currentRequestStep: nextStep,
                              requestStep1FormData,
                              requestStep7FormData,
                              requestStep8FormData
                            }
                            let step1PageStatus = {
                              class: "",
                              insideOfStep: false,
                              translateYValue1: 0,
                              translateYValue2: 0,
                              translateYValue3: 0
                            }
                            document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                            setTimeout(() => {
                              document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                              localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                              _this.props.dispatch(setSiteSettings({ showLayer: false, userRequestSteps: userRequestSteps, step1PageStatus: step1PageStatus, withGrandiant: '' }));
                            }, config.waitToNextComponent);

                          }
                          else {
                            _this.props.dispatch(setSiteSettings({ showLayer: false }));
                            alert(commonDictionary.wrongPassEntered)
                          }
                        });
                    }}
                  >
                    {({ errors, touched, values, handleSubmit, setFieldValue,
                      setFieldTouched }) => (

                        <Form encType="multipart/form-data" className="requestStep1 f-answer">

                          <div className="grid-wrapper">

                            <div className="f-question-A pr-A translateY-animation"
                              style={{
                                transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue3 + "px)"
                              }}
                            >
                              {htmlToReactParser.parse(currentPage.requestStep1.question3)}
                            </div>
                            <div className="f-answer-group-A translateY-animation"
                              style={{
                                transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue3 + "px)"
                              }}
                            >
                              <InputText
                                type="text"
                                placeholder=""
                                name="email2"
                                id="f-email-2"
                                value={_this.state.email}
                                disabled={true}
                                className="tb-A ff-A true"
                              />
                              <label htmlFor="f-email-2" className="placeholder-A">
                                {commonDictionary.ePosta}
                              </label>


                            </div>
                            <div className="f-answer-group-A translateY-animation"
                              style={{
                                transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue3 + "px)"
                              }}
                            >
                              <InputText
                                type="password"
                                placeholder=""
                                name="password"
                                id="f-password"
                                value={values.password}
                                onKeyUp={ev => this.onEmailChange(ev, "password", setFieldValue)}
                                className={
                                  errors.password && touched.password
                                    ? values.password.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                                    : values.password.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                                }
                              />
                              <label htmlFor="f-password" className="placeholder-A">
                                {commonDictionary.password}
                              </label>
                              {errors.password && touched.password ? <div className="ff-C">{errors.password}</div> : null}

                            </div>

                            <div className="forgetPassword translateY-animation"
                              style={{
                                transform: "translateY(" + store.siteSettings.step1PageStatus.translateYValue3 + "px)"
                              }}
                            >

                              {/* <CheckBox
                                name="rememberMe"
                                id="rememberMe"
                                label={commonDictionary.rememberMe}
                                value={values.rememberMe}
                                className={
                                  errors.rememberMe && touched.rememberMe
                                    ? "chk-B ff-A error"
                                    : "chk-B ff-A"
                                }
                              /> */}

                              <a className="f-imei-info-area" href='#' onClick={() => this.forgetPass(requestPageUrl)}>
                                <div className="f-icon">?</div>
                                <div className="f-info-text v2"> {commonDictionary.forgetPassword}</div>
                              </a>
                            </div>
                            <FBackButton click={() => this.previousStep(true, "move-down")} goBack={commonDictionary.goBack} />
                            <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                          </div>
                        </Form>
                      )}
                  </Formik>
                )
            }

          </div>
          <div className={"citem-04 " + store.siteSettings.step1PageStatus.class}>
            <Formik
              initialValues={{
                resetPwCode: '',
                cPassword: '',
                passwordConfirmation: ''
              }}
              validationSchema={
                Yup.object().shape({
                  resetPwCode: Yup.string()
                    .required(commonDictionary.requiredField),
                  cPassword: Yup
                    .string()
                    .required(commonDictionary.requiredField)
                    .min(6, commonDictionary.min6Char)
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, commonDictionary.minANumberOrSpecialChar),
                  passwordConfirmation: Yup.string()
                    .required(commonDictionary.requiredField)
                    .oneOf([Yup.ref('cPassword'), null], commonDictionary.passwordsDoesNotMatch)
                })
              }
              onSubmit={values => {

                const confirmPassword = {
                  NewPassword: values.cPassword,
                  ResetPwCode: values.resetPwCode,
                }
                var bodyFormData = new FormData();
                bodyFormData.append('confirmPassword', JSON.stringify(confirmPassword));
                const headers = {
                  'Content-Type': 'multipart/form-data'
                }
                this.props.dispatch(setSiteSettings({ showLayer: true }));

                axios.post(config.confirmPassword, bodyFormData, {
                  headers: headers
                })
                  .then(function (response) {
                    const userLogin = {
                      ...response.data,
                      rememberMe: false,
                      expireDate: new Date().getTime()
                    }
                    localStorage.setItem('userLogin', JSON.stringify(userLogin))
                    sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
                    _this.props.dispatch(fetchUserInfo(userLogin))

                    const requestSteps = currentPage.requestSteps
                    let nextStep = "requestStep1"
                    for (let i = 0; i < requestSteps.length - 1; i++) {
                      if (requestSteps[i].contentTypeAlias == "requestStep1") {
                        nextStep = requestSteps[i + 1].contentTypeAlias
                      }
                    }

                    //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
                    let beforeUserRequestSteps = null;
                    if (localStorage.getItem('userRequestSteps') != null) {
                      beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                    }
                    const requestStep1FormData = {
                      name: _this.state.name,
                      email: _this.state.email,
                      id: userLogin.user.id
                    }
                    const requestStep7FormData = {
                      name: userLogin.user.name != null ? userLogin.user.name : "",
                      lastName: userLogin.user.lastName != null ? userLogin.user.lastName : "",
                      phone: userLogin.user.phone != null ? userLogin.user.phone : "",
                    }
                    const requestStep8FormData = {
                      adress: userLogin.user.adress != null ? userLogin.user.adress : "",
                      postCode: userLogin.user.postalCode != null ? userLogin.user.postalCode : "",
                    }

                    const userRequestSteps = {
                      ...beforeUserRequestSteps,
                      expireDate: new Date().getTime(),
                      currentRequestStep: nextStep,
                      comeFrom: 'default',
                      requestStep1FormData,
                      requestStep7FormData,
                      requestStep8FormData
                    }
                    let step1PageStatus = {
                      class: "",
                      insideOfStep: false,
                      translateYValue1: 0,
                      translateYValue2: 0,
                      translateYValue3: 0
                    }
                    document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                    setTimeout(() => {
                      document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                      localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                      _this.props.dispatch(setSiteSettings({ showLayer: false, userRequestSteps: userRequestSteps, step1PageStatus: step1PageStatus, withGrandiant: '' }));
                    }, config.waitToNextComponent);
                  })
                  .catch(function (response) {
                    _this.props.dispatch(setSiteSettings({ showLayer: false }));
                    alert(commonDictionary.wrongCodeEntered)
                  })
              }}
            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep1 f-answer">

                    <div className="grid-wrapper">
                      <div className="f-question-A pr-A translateY-animation">
                        {htmlToReactParser.parse(currentPage.requestStep1.recoverPassCodeText)}

                      </div>

                      <div className="f-answer-group-A translateY-animation">
                        <InputText
                          type="text"
                          placeholder=""
                          name="resetPwCode"
                          id="f-resetPwCode"
                          value={values.resetPwCode}
                          onKeyUp={ev => this.onEmailChange(ev, "resetPwCode", setFieldValue)}
                          className={
                            errors.resetPwCode && touched.resetPwCode
                              ? values.resetPwCode.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                              : values.resetPwCode.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                          }
                        />
                        <label htmlFor="f-resetPwCode" className="placeholder-A">
                          {commonDictionary.resetPasswordCode}
                        </label>
                        {errors.resetPwCode && touched.resetPwCode ? <div className="ff-C">{errors.resetPwCode}</div> : null}

                      </div>


                      <div className="f-answer-group-A translateY-animation">
                        <InputText
                          type="password"
                          placeholder=""
                          name="cPassword"
                          id="f-cPassword"
                          value={values.cPassword}
                          onKeyUp={(e) => this.onEmailChange(e, "cPassword", setFieldValue)}
                          className={
                            errors.cPassword && touched.cPassword
                              ? values.cPassword.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                              : values.cPassword.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                          }
                        />
                        <label htmlFor="f-cPassword" className="placeholder-A">
                          {commonDictionary.newPassword}
                        </label>
                        {errors.cPassword && touched.cPassword ? <div className="ff-C">{errors.cPassword}</div> : null}

                      </div>
                      <div className="f-answer-group-A translateY-animation">
                        <InputText
                          type="password"
                          placeholder=""
                          name="passwordConfirmation"
                          id="f-passwordConfirmation"
                          value={values.passwordConfirmation}
                          onKeyUp={(e) => this.onEmailChange(e, "passwordConfirmation", setFieldValue)}
                          className={
                            errors.passwordConfirmation && touched.passwordConfirmation
                              ? values.passwordConfirmation.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                              : values.passwordConfirmation.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                          }
                        />
                        <label htmlFor="f-passwordConfirmation" className="placeholder-A">
                          {commonDictionary.reEnterNewPassword}
                        </label>
                        {errors.passwordConfirmation && touched.passwordConfirmation ? <div className="ff-C">{errors.passwordConfirmation}</div> : null}
                      </div>


                      <FBackButton click={() => this.previousStep(true, "move-down",setFieldValue)} goBack={commonDictionary.goBack} />
                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                    </div>

                  </Form>
                )}
            </Formik>

          </div>
        </>
      </CssTransion >


    )
  }
}

export default connect(initsStore)(RequestStep1Form);