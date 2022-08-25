import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { fetchUserInfo } from '../../../store/actions/loginUser';
const axios = require('axios');
import https from 'https'
import InputText from '../Inputs/InputText'
import * as config from '../../../config';
import FacebookGoogleLogin from '../../UI/FacebookGoogleLogin'
import Spinner from '../../UI/Spinner'
import Modal from '../../UI/Modals/Modal/Modal';

class LoginForm extends Component {

  state = {
    code: "",
    status: "",
    spinnerShow: false
  }

  componentDidMount() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let qcode = params.get('activateCode');
    let qstatus = params.get('status');
    this.setState({ ...this.state, code: qcode, status: qstatus });
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
  closeModal = (setFieldValue) => {
    setFieldValue("email", "", false)
    setFieldValue("password", "", false)

    this.props.closeModal()
  }
  render() {
    const _props = this.props;
    const store = this.props.getState()
    const { commonDictionary, currPageLangSettings } = this.props.getState().siteSettings;
    const accountPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account").filter((link) => link.lang == currPageLangSettings.lang))[0].url
    const forgetPasswordPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/forgetPassword").filter((link) => link.lang == currPageLangSettings.lang))[0].url

    return (
      <>

        <Formik
          initialValues={{
            email: '',
            password: ''
          }}
          validationSchema={Yup.object().shape({

            email: Yup.string()
              .email(commonDictionary.invalidEmail)
              .required(commonDictionary.requiredField),
            password: Yup.string()
              .required(commonDictionary.requiredField),

          })}

          onSubmit={(values, { resetForm }) => {
            const _this = this
            this.setState({ ...this.state, spinnerShow: true })
            const scode = this.state.code != "" ? this.state.code : null;
            const sStatus = this.state.status
            const user = {
              Email: values.email,
              Password: values.password,
              Code: scode,
              Status: sStatus
            }
            var bodyFormData = new FormData();
            bodyFormData.append('loginForm', JSON.stringify(user));
            const headers = {
              'Content-Type': 'multipart/form-data'
            }
            const agent = new https.Agent({
              rejectUnauthorized: false
            })
            axios.post(config.login, bodyFormData, {
              headers: headers,
              httpsAgent: agent
            })
              .then(function (response) {
                _this.setState({ ..._this.state, spinnerShow: false })
                const userLogin = {
                  ...response.data,
                  rememberMe: false,
                  expireDate: new Date().getTime()
                }

                if (response.status == 200) {

                  if (userLogin.login) {

                    sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
                    _props.dispatch(fetchUserInfo(userLogin))
                    window.location.href = accountPageUrl
                    resetForm({
                      email: '',
                      password: ''
                    });
                    _this.props.closeModal()
                  }
                  else {
                    alert(commonDictionary.wrongPasswordOrUsername)
                  }
                }
              

              })
              .catch(error => {
                _this.setState({ ..._this.state, spinnerShow: false })
                alert(commonDictionary.errorLogin)
              })
          }}
        >
          {({ errors, touched, values, handleSubmit, setFieldValue,
            setFieldTouched }) => (

              <Modal show={this.props.showLoginModal} clicked={() => this.closeModal(setFieldValue)} type='modal-type-03 height420'>
                <h3 className="loginModalTitle hdr-B">
                  {commonDictionary.login}
                </h3>
                <Form encType="multipart/form-data" className="modalForm-01">


                  <div className="f-answer-group-C">
                    <div className="inputText-typeC">
                      <InputText
                        type="text"
                        placeholder=""
                        id="f-email-login-modal"
                        name="email"
                        value={values.email}
                        onKeyUp={(e) => this.onInputChange(e, "email", setFieldValue)}
                        className={
                          errors.email && touched.email
                            ? values.email.trim().length > 0 ? "tb-B ff-A true error" : "tb-B ff-A error"
                            : values.email.trim().length > 0 ? "tb-B ff-A true" : "tb-B ff-A"
                        }
                      />
                      <label htmlFor="f-email-login-modal" className="placeholder-B">
                        {commonDictionary.yourEmail}
                      </label>
                      {errors.email && touched.email ? <div className="ff-C">{errors.email}</div> : null}

                    </div>
                    <div className="inputText-typeC">
                      <InputText
                        type="password"
                        placeholder=""
                        name="password"
                        id="f-password-login-modal"
                        value={values.password}
                        onKeyUp={(e) => this.onInputChange(e, "password", setFieldValue)}
                        className={
                          errors.password && touched.password
                            ? values.password.trim().length > 0 ? "tb-B ff-A true error" : "tb-B ff-A error"
                            : values.password.trim().length > 0 ? "tb-B ff-A true" : "tb-B ff-A"
                        }
                      />
                      <label htmlFor="f-password-login-modal" className="placeholder-B">
                        {commonDictionary.yourPassword}
                      </label>
                      {errors.password && touched.password ? <div className="ff-C">{errors.password}</div> : null}

                    </div>
                  </div>

                  <div className="f-submit-group-C">
                    <button type="submit" className="btn-submit btn-02 ff-I">{commonDictionary.login}
                      {<Spinner show={this.state.spinnerShow} type="grey" />}
                    </button>
                  </div>


                </Form>
                   {/* <h5 className="loginModalTitle2 hdr-C">
          {commonDictionary.or}
        </h5>
        <div className="alternativeLoginArea">
          <FacebookGoogleLogin alternativeLoginType={'all'} redirectUrl={accountPageUrl} />
        </div> */}
            
                <a href={forgetPasswordPageUrl} className="loginModalLink ff-L">
                  {commonDictionary.forgetPassword}
                </a>
              </Modal>

            )}
        </Formik>

 


      </>
    )
  }
}

export default connect(initsStore)(LoginForm);
