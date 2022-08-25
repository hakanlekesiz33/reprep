import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import InputText from '../Inputs/InputText'
import { connect } from 'react-redux';
import initsStore from '../../../store';

class SearchUserTickets extends Component {

    onInputChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value;
        setFieldValue(inputName, inputValue, false)
    }

    render() {
        const store = this.props.getState()
        const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;
        const ticketListPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account/ticketList").filter((link) => link.lang == currPageLangSettings.lang))[0].url
        const ticketDetailsPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account/ticketDetails").filter((link) => link.lang == currPageLangSettings.lang))[0].url

        return (
            <>
                <Formik
                    initialValues={{
                        searchParam: '',
                    }}
                    validationSchema={Yup.object().shape({
                        searchParam: Yup.string().required('required')
                    })}

                    onSubmit={values => {
                        //kullanıcının ticket'ı varsa
                        if (store.loginUser.user.tickets != null) {
                            //sadece number ise "imei" yada "ticketId
                            if (/^[0-9]*$/.test(values.searchParam)) {
                                if (values.searchParam.length == 15) {//imei
                                    const tickets = store.loginUser.user.tickets.ticketList.filter((ticket) => ticket.ticketDetails.imei == values.searchParam);
                                    if (tickets.length == 1) {//tek sonuç varsa ticket detail sayfasına
                                        window.location.href = ticketDetailsPageUrl + "?searchType=byImei&searchParam=" + values.searchParam
                                    }
                                    else {//birden fazla sonuç varsa ticketlist sayfasına
                                        window.location.href = ticketListPageUrl + "?searchType=byImei&searchParam=" + values.searchParam
                                    }
                                }
                                else {//ticketId
                                    const tickets = store.loginUser.user.tickets.ticketList.filter((ticket) => ticket.ticketDetails.id == values.searchParam);
                                    if (tickets.length == 1) {//tek sonuç varsa ticket detail sayfasına
                                        window.location.href = ticketDetailsPageUrl + "?searchType=byTicketId&searchParam=" + values.searchParam
                                    }
                                    else {//birden fazla sonuç varsa ticketlist sayfasına
                                        window.location.href = ticketListPageUrl + "?searchType=byTicketId&searchParam=" + values.searchParam
                                    }
                                }

                            }
                            //number değilse "seri no" 
                            else {
                                const tickets = store.loginUser.user.tickets.ticketList.filter((ticket) => ticket.ticketDetails.serialNumber == values.searchParam);
                                if (tickets.length == 1) {//tek sonuç varsa ticket detail sayfasına
                                    window.location.href = ticketDetailsPageUrl + "?searchType=bySerialNumber&searchParam=" + values.searchParam
                                }
                                else {//birden fazla sonuç varsa ticketlist sayfasına
                                    window.location.href = ticketListPageUrl + "?searchType=bySerialNumber&searchParam=" + values.searchParam
                                }
                            }
                        }
                        else{
                            window.location.href = ticketListPageUrl + "?searchType=byTicketId&searchParam=" + values.searchParam
                        }


                    }}
                >
                    {({ errors, touched, values, handleSubmit, setFieldValue,
                        setFieldTouched }) => (
                            <div className="rui-search-head">
                                <Form>
                                    <div className="input-group">
                                        <InputText
                                            type="search"
                                            placeholder={commonDictionary.searchTicket}
                                            name="searchParam"
                                            value={values.searchParam}
                                            onKeyUp={(e) => this.onInputChange(e, "searchParam", setFieldValue)}
                                            className={
                                                errors.searchParam && touched.searchParam
                                                    ? "form-control form-control-clean order-12 error"
                                                    : "form-control form-control-clean order-12"
                                            }
                                        />
                                        <div className="input-group-prepend mnl-3 order-1">
                                            <button type="submit" className="btn btn-clean btn-uniform btn-grey-5 mb-0 mnl-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" name="search" className="rui-icon">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        )}
                </Formik>
            </>
        )
    }
}

export default connect(initsStore)(SearchUserTickets);