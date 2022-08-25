import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
const axios = require('axios');
const recaptchaRef = React.createRef();
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import InputText from '../Inputs/InputText'
import * as config from '../../../config';
import Spinner from '../../UI/Spinner'
import Modal from '../../UI/Modals/Modal/Modal';


class RegisterForm extends Component {
  state = {
    spinnerShow: false
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
    setFieldValue("name", "", false)
    setFieldValue("lastName", "", false)

    this.props.closeModal()
  }
  render() {
    const { commonDictionary } = this.props.getState().siteSettings;

    return (
      <>
        <Formik
          initialValues={{
            email: '',
            password: '',
            name: '',
            lastName: '',
          }}

          validationSchema={Yup.object().shape({

            name: Yup.string()
              .required(commonDictionary.requiredField),
            lastName: Yup.string()
              .required(commonDictionary.requiredField),
            email: Yup.string()
              .email(commonDictionary.invalidEmail)
              .required(commonDictionary.requiredField),
            password: Yup
              .string()
              .required(commonDictionary.requiredField)
              .min(6, commonDictionary.min6Char)
              .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, commonDictionary.minANumberOrSpecialChar),
          })}
          onSubmit={(values, { resetForm }) => {
            const _this = this
            this.setState({ ...this.state, spinnerShow: true })
            const registerForm =
            {
              Email: values.email,
              Password: values.password,
              Name: values.name,
              LastName: values.lastName
            }

            var bodyFormData = new FormData();

            bodyFormData.append('registerForm', JSON.stringify(registerForm));

            const headers = {
              'Content-Type': 'multipart/form-data'
            }

            axios.post(config.register, bodyFormData, {
              headers: headers

            }).then(function (res) {
              _this.setState({ ..._this.state, spinnerShow: false })


              if (res.data.result == "usedEmail") {
                alert(commonDictionary.errorUsedMail)
              }
              else if (res.data.result == "errorRegister") {
                alert(commonDictionary.errorRegister)
                _this.props.closeModal()
              }
              else if (res.data.result == "mailSend") {
                alert(commonDictionary.mailSendForRegister)
                resetForm({
                  email: '',
                  password: '',
                  name: '',
                  lastName: '',
                });
                _this.props.closeModal()
              }
              else if (res.data.result == "mailCantSend") {
                alert(commonDictionary.mailCantSendForRegister)
                _this.props.closeModal()
              }
            
            })
              .catch(error => {
                _this.setState({ ..._this.state, spinnerShow: false })
                alert(commonDictionary.errorRegister)
                resetForm({
                  email: '',
                  password: '',
                  name: '',
                  lastName: '',
                });
                _this.props.closeModal()

              })
          }}
        >
          {({ errors,
            touched,
            values,
            handleSubmit,
            setFieldValue,
            setFieldTouched }) => (
           
                <Modal show={this.props.showRegisterModal} clicked={() => this.closeModal(setFieldValue)} type='modal-type-03'>
                  <Form encType="multipart/form-data" className="modalForm-01">

                    <div className="f-answer-group-C">
                      <div className="inputText-typeC">
                        <InputText
                          type="text"
                          placeholder=""
                          id="f-name-register-modal"
                          name="name"
                          value={values.name}
                          onKeyUp={(e) => this.onNameChange(e, "name", setFieldValue)}
                          className={
                            errors.name && touched.name
                              ? values.name.trim().length > 0 ? "tb-B ff-A true error" : "tb-B ff-A error"
                              : values.name.trim().length > 0 ? "tb-B ff-A true" : "tb-B ff-A"
                          }
                        />
                        <label htmlFor="f-name-register-modal" className="placeholder-B">
                          {commonDictionary.yourName}
                        </label>
                        {errors.name && touched.name ? <div className="ff-C">{errors.name}</div> : null}

                      </div>
                      <div className="inputText-typeC">

                        <InputText
                          type="text"
                          placeholder=""
                          id="f-lastName-register-modal"
                          name="lastName"
                          value={values.lastName}
                          onKeyUp={(e) => this.onNameChange(e, "lastName", setFieldValue)}
                          className={
                            errors.lastName && touched.lastName
                              ? values.lastName.trim().length > 0 ? "tb-B ff-A true error" : "tb-B ff-A error"
                              : values.lastName.trim().length > 0 ? "tb-B ff-A true" : "tb-B ff-A"
                          }
                        />
                        <label htmlFor="f-lastName-register-modal" className="placeholder-B">
                          {commonDictionary.yourLastName}
                        </label>
                        {errors.lastName && touched.lastName ? <div className="ff-C">{errors.lastName}</div> : null}

                      </div>
                      <div className="inputText-typeC">

                        <InputText
                          type="text"
                          placeholder=""
                          id="f-email-register-modal"
                          name="email"
                          value={values.email}
                          onKeyUp={(e) => this.onInputChange(e, "email", setFieldValue)}
                          className={
                            errors.email && touched.email
                              ? values.email.trim().length > 0 ? "tb-B ff-A true error" : "tb-B ff-A error"
                              : values.email.trim().length > 0 ? "tb-B ff-A true" : "tb-B ff-A"
                          }
                        />
                        <label htmlFor="f-email-register-modal" className="placeholder-B">
                          {commonDictionary.yourEmail}
                        </label>
                        {errors.email && touched.email ? <div className="ff-C">{errors.email}</div> : null}

                      </div>
                      <div className="inputText-typeC">
                        <InputText
                          type="password"
                          placeholder=""
                          id="f-password-register-modal"
                          name="password"
                          value={values.password}
                          onKeyUp={(e) => this.onInputChange(e, "password", setFieldValue)}
                          className={
                            errors.password && touched.password
                              ? values.password.trim().length > 0 ? "tb-B ff-A true error" : "tb-B ff-A error"
                              : values.password.trim().length > 0 ? "tb-B ff-A true" : "tb-B ff-A"
                          }
                        />
                        <label htmlFor="f-password-register-modal" className="placeholder-B">
                          {commonDictionary.yourPassword}
                        </label>
                        {errors.password && touched.password ? <div className={errors.password.length > 18 ? "ff-C v2" : "ff-C"}>{errors.password}</div> : null}

                      </div>
                    </div>

                    <div className="f-submit-group-C">
                      <button type="submit" className="btn-submit btn-02 ff-I"> {commonDictionary.register}
                        {<Spinner show={this.state.spinnerShow} type="grey" />}</button>
                    </div>

                  </Form>
                </Modal>

            )}
        </Formik>

      </>
    )
  }
}

export default connect(initsStore)(RegisterForm);
