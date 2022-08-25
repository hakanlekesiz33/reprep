import { connect } from 'react-redux';
import initsStore from '../store';
import { setSiteSettings } from '../store/actions/setSiteSettings';
import { fetchUserInfo } from '../store/actions/loginUser';
import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
const axios = require('axios');
import InputText from '../components/Forms/Inputs/InputText'
import * as config from '../config';
import Spinner from '../components/UI/Spinner'
import Head from 'next/head'

class ResetPassword extends Component {
    static async getInitialProps({ ctx, store }) {

        const cstore = await store.getState()
        const lang = cstore.siteSettings.currPageLangSettings.lang
        let currentPage = cstore.umbracoContent.TR.resetPasswordPageContent

        if (lang == "EN") {
            currentPage = cstore.umbracoContent.EN.resetPasswordPageContent
        }
        else if (lang == "DE") {
            currentPage = cstore.umbracoContent.DE.resetPasswordPageContent
        }
        await store.dispatch(setSiteSettings({ currentPage: currentPage }));

        return {}
    }

    state = {
        resetPwCode: "",
        redirectUrl: ""
    };

    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.setState({
            ...this.state,
            resetPwCode: params.get('ResetPwCode'),
            redirectUrl: params.get('redirectUrl')
        });
    }
    onInputChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value;
        setFieldValue(inputName, inputValue, false)
    }

    render() {
        const _this = this
        const store = this.props.getState()
        const { currentPage,commonDictionary, currPageLangSettings } = this.props.getState().siteSettings;
        const accountPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account").filter((link) => link.lang == currPageLangSettings.lang))[0].url

        return (
            <>
               <Head>
          <title>{currentPage.seo.pageTitle}</title>
        </Head>
                <main id="resetPassword" data-html-class="" data-body-class="pg-A f-forgetPassword">
                    <Formik
                        initialValues={{
                            password: '',
                            passwordConfirmation: ''
                        }}
                        validationSchema={Yup.object().shape({
                            password: Yup
                            .string()
                            .required(commonDictionary.requiredField)
                            .min(6, commonDictionary.min6Char)
                            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/, commonDictionary.minANumberOrSpecialChar),
                            passwordConfirmation: Yup.string()
                                .required(commonDictionary.requiredField)
                                .oneOf([Yup.ref('password'), null], commonDictionary.passwordsDoesNotMatch)
                        })}

                        onSubmit={values => {
                            const resetPwCode = this.state.resetPwCode != null ? this.state.resetPwCode : null;

                            const confirmPassword = {
                                NewPassword: values.password,
                                ResetPwCode: resetPwCode,
                            }
                            var bodyFormData = new FormData();
                            bodyFormData.append('confirmPassword', JSON.stringify(confirmPassword));
                            const headers = {
                                'Content-Type': 'multipart/form-data'
                            }
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
                                    let redirectUrl = ""
                                    let redirectUrlJsFile = ""
                                    if (_this.state.redirectUrl != null) {
                                        redirectUrl = _this.state.redirectUrl.split("|")[0]
                                        redirectUrlJsFile = _this.state.redirectUrl.split("|")[1]
                                    }
                                    window.location.href = redirectUrlJsFile == "request" ? redirectUrl : accountPageUrl
                                });

                        }}
                    >
                        {({ errors, touched, values, handleSubmit, setFieldValue,
                            setFieldTouched }) => (
                                <Form encType="multipart/form-data" className="requestStep1 f-answer">

                                    <div className="grid-wrapper">
                                        <div className="f-question-A pr-A" >
                                            {commonDictionary.resetPasswordDesc}
                                        </div>

                                        <div className="f-answer-group-A" >
                                            <InputText
                                                type="password"
                                                placeholder=""
                                                name="password"
                                                value={values.password}
                                                id="f-password"
                                                onKeyUp={e => this.onInputChange(e, "password", setFieldValue)}
                                                className={
                                                    errors.password && touched.password
                                                        ? values.password.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                                                        : values.password.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                                                }
                                            />
                                            <label htmlFor="f-password" className="placeholder-A">
                                                {commonDictionary.password}
                                            </label>
                                            {
                                                errors.password && touched.password ?
                                                    <div className={errors.password.length > 18 ? "ff-C v2" : "ff-C"}>
                                                        {errors.password}
                                                    </div>
                                                    : null
                                            }

                                        </div>
                                        <div className="f-answer-group-A" >
                                            <InputText
                                                type="password"
                                                placeholder=""
                                                name="passwordConfirmation"
                                                value={values.passwordConfirmation}
                                                id="f-passwordConfirmation"
                                                onKeyUp={e => this.onInputChange(e, "passwordConfirmation", setFieldValue)}
                                                className={
                                                    errors.passwordConfirmation && touched.passwordConfirmation
                                                        ? values.passwordConfirmation.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                                                        : values.passwordConfirmation.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                                                }
                                            />
                                            <label htmlFor="f-passwordConfirmation" className="placeholder-A">
                                                {commonDictionary.passwordConfirmation}
                                            </label>
                                            {errors.passwordConfirmation && touched.passwordConfirmation ? <div className="ff-C">{errors.passwordConfirmation}</div> : null}

                                        </div>
                                        <div className={"f-submit-group-A"}>
                                            <button type="submit" className="btn-submit btn-01 ff-B forgotPassButton">
                                                {commonDictionary.recoverPassword}
                                                {<Spinner show={this.state.spinnerShow} type="light" />}
                                            </button>

                                        </div>

                                    </div>


                                </Form>
                            )}
                    </Formik>

                </main>

            </>
        )
    }
}

export default connect(initsStore)(ResetPassword);