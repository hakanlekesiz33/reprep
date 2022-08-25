import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
const axios = require('axios');
import InputText from '../components/Forms/Inputs/InputText'
import { connect } from 'react-redux';
import initsStore from '../store';
import * as config from '../config';
import Spinner from '../components/UI/Spinner'
import Head from 'next/head'
import { setSiteSettings } from '../store/actions/setSiteSettings';

class ForgetPassword extends Component {
    static async getInitialProps({ ctx, store }) {

        const cstore = await store.getState()
        const lang = cstore.siteSettings.currPageLangSettings.lang
        let currentPage = cstore.umbracoContent.TR.forgetPasswordPageContent

        if (lang == "EN") {
            currentPage = cstore.umbracoContent.EN.forgetPasswordPageContent
        }
        else if (lang == "DE") {
            currentPage = cstore.umbracoContent.DE.forgetPasswordPageContent
        }
        await store.dispatch(setSiteSettings({ currentPage: currentPage }));

        return {}
    }
    state = {
        spinnerShow: false
      }
    onInputChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value;
        setFieldValue(inputName, inputValue, false)
    }

    render() {
        const { currentPage,commonDictionary } = this.props.getState().siteSettings;
        return (
            <>
               <Head>
          <title>{currentPage.seo.pageTitle}</title>
        </Head>
                <main id="forgetPassword" data-body-class="pg-A f-forgetPassword">
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={Yup.object().shape({
                            email: Yup.string()
                                .email(commonDictionary.invalidEmail)
                                .required(commonDictionary.requiredField),

                        })}

                        onSubmit={values => {
                            this.setState({...this.state, spinnerShow: true})
                            const _this=this
                            axios.get(config.resetPassword + '?email=' + values.email + '&redirectUrl=')
                                .then(function (response) {
                                    _this.setState({..._this.state, spinnerShow: false})

                                    if (response.data.result) {
                                        alert(commonDictionary.mailSendForForgetPassword)
                                        window.location.href="/"
                                    }
                                    else {
                                        alert(commonDictionary.mailNotExist)
                                    }
                                });
                        }}
                    >
                        {({ errors, touched, values, handleSubmit, setFieldValue,
                            setFieldTouched }) => (
                                <Form encType="multipart/form-data" className="requestStep1 f-answer">

                                    <div className="grid-wrapper">
                                        <div className="f-question-A pr-A" >
                                            {commonDictionary.forgetPasswordDesc}
                                        </div>

                                        <div className="f-answer-group-A" >
                                            <InputText
                                                type="text"
                                                placeholder=""
                                                name="email"
                                                id="f-email"
                                                value={values.email}
                                                onKeyUp={e => this.onInputChange(e, "email", setFieldValue)}
                                                className={
                                                    errors.email && touched.email
                                                        ? values.email.trim().length > 0 ? "tb-A ff-A true error" : "tb-A ff-A error"
                                                        : values.email.trim().length > 0 ? "tb-A ff-A true" : "tb-A ff-A"
                                                }
                                            />
                                            <label htmlFor="f-email" className="placeholder-A">
                                                {commonDictionary.yourEmail}
                                            </label>
                                            {errors.email && touched.email ? <div className="ff-C">{errors.email}</div> : null}

                                        </div>
                                        <div className={"f-submit-group-A"}>
                                            <button type="submit" className="btn-submit btn-01 ff-B forgotPassButton">
                                                {commonDictionary.sendMail}
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

export default connect(initsStore)(ForgetPassword);