import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
const axios = require('axios');
import InputText from '../Inputs/InputText'
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { fetchUserInfo } from '../../../store/actions/loginUser';
import * as config from '../../../config';

class ChangePassword extends Component {

    onInputChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value;
        setFieldValue(inputName, inputValue, false)
    }

    render() {
        const _props = this.props;
        const { commonDictionary } = this.props.getState().siteSettings;
        return (
            <>
                <Formik
                    initialValues={{
                        oldPassword: '',
                        password: '',
                        passwordConfirmation: ''
                    }}
                    validationSchema={Yup.object().shape({
                        oldPassword: Yup.string()
                            .required(commonDictionary.requiredField),
                        password: Yup.string()
                            .required(commonDictionary.requiredField)
                            .min(6, commonDictionary.min6Char)
                            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, commonDictionary.minANumberOrSpecialChar),
                 
                            passwordConfirmation: Yup.string()
                            .required(commonDictionary.passwordsDoesNotMatch)
                            .oneOf([Yup.ref('password'), null], commonDictionary.passwordsDoesNotMatch)
                    })}

                    onSubmit={values => {
                        const changePassword = {
                            OldPassword: values.oldPassword,
                            NewPassword: values.password,
                        }
                        var bodyFormData = new FormData();
                        bodyFormData.append('changePassword', JSON.stringify(changePassword));
                        const headers = {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'bearer ' + JSON.parse(sessionStorage.getItem('userLogin')).token
                        }

                        axios.post(config.changePassword, bodyFormData, {
                            headers: headers
                        })
                            .then(function (response) {
                             
                                if (response.data.isAuth) {

                                    let user = response.data.user
                                    if (response.data.user.alternativeLogin) {
                                        user = {
                                            ...response.data.user,
                                            // profileImage: JSON.parse(sessionStorage.getItem('userLogin')).user.profileImage
                                        }

                                    }
                                    const userLogin = {
                                        ...response.data,
                                        user,
                                        expireDate: new Date().getTime()
                                    }
                                    if (JSON.parse(sessionStorage.getItem('userLogin')).rememberMe) {
                                        localStorage.setItem('userLogin', JSON.stringify(userLogin))
                                    }

                                    sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
                                    _props.dispatch(fetchUserInfo(userLogin))
                                    alert(commonDictionary.passwordChanged)
                                }
                                else {
                                    if (response.data.errorMessage == "wrongOldPassword") {
                                        alert(commonDictionary.wrongOldPassword)
                                    }
                                    else if (response.data.errorMessage == "errorOccured") {
                                        alert(commonDictionary.errorChangePassword)
                                    }
                                }
                            });
                    }}
                >
                    {({ errors, touched, values, handleSubmit, setFieldValue,
                        setFieldTouched }) => (
                            <div className="col-12">
                                <Form encType="multipart/form-data">
                                    <div>
                                        <label>{commonDictionary.oldPassword}</label>

                                        <InputText
                                            type="password"
                                            placeholder=""
                                            name="oldPassword"
                                            value={values.oldPassword}
                                            onKeyUp={(e) => this.onInputChange(e, "oldPassword", setFieldValue)}
                                            className={
                                                errors.oldPassword && touched.oldPassword
                                                    ? "form-control margin-bottom-30 error"
                                                    : "form-control margin-bottom-30"
                                            }
                                        />
                                        {errors.oldPassword && touched.oldPassword ? <div className="ff-C">{errors.oldPassword}</div> : null}

                                    </div>
                                    <div>
                                        <label>{commonDictionary.newPassword}</label>
                                        <InputText
                                            type="password"
                                            placeholder=""
                                            name="password"
                                            value={values.password}
                                            onKeyUp={(e) => this.onInputChange(e, "password", setFieldValue)}
                                            className={
                                                errors.password && touched.password
                                                    ? "form-control margin-bottom-30 error"
                                                    : "form-control margin-bottom-30"
                                            }
                                        />
                                        {errors.password && touched.password ?
                                            <div className={errors.password.length > 40 ? "ff-C v2" : "ff-C"}>
                                                {errors.password}
                                            </div> : null}

                                    </div>
                                    <div>
                                        <label>{commonDictionary.reEnterNewPassword}</label>
                                        <InputText
                                            type="password"
                                            placeholder=""
                                            name="passwordConfirmation"
                                            value={values.passwordConfirmation}
                                            onKeyUp={(e) => this.onInputChange(e, "passwordConfirmation", setFieldValue)}
                                            className={
                                                errors.passwordConfirmation && touched.passwordConfirmation
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                        {errors.passwordConfirmation && touched.passwordConfirmation ?
                                         <div className={errors.passwordConfirmation.length > 40 ? "ff-C v2" : "ff-C"}>
                                             {errors.passwordConfirmation}
                                             </div> : null}

                                    </div>

                                    <div className="col-auto submitContainer">
                                        <button className="btn btn-brand" type="submit">{commonDictionary.save}</button>
                                    </div>
                                </Form>

                            </div>

                        )}
                </Formik>
            </>
        )
    }
}

export default connect(initsStore)(ChangePassword);