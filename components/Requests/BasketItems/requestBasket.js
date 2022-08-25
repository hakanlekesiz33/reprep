import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import * as config from '../../../config';

import BasketItem1 from './basketItem1';
import BasketItem2 from './basketItem2';
import BasketItem3 from './basketItem3';
import BasketItem4 from './basketItem4';
import BasketItem5 from './basketItem5';
import BasketItem6 from './basketItem6';
import PostRequest from '../postRequest';
import { getElementsOffsetHeight, refreshToolTips } from '../../../static/common.js';

class RequestBasket extends Component {

    componentDidMount() {
        refreshToolTips()
    }
    componentDidUpdate() {
        refreshToolTips()
    }
    changeStep = (step) => {
        const store = this.props.getState();
        //mobilde modal içinden gösterdiğimiz için önce modalı kapatıyoruz
        this.props.dispatch(setSiteSettings({ showSummaryModal: false }));

        //kullanıcının daha önce doldurduğu form var ise onu elimize alıyoruz
        let beforeUserRequestSteps = null;
        if (localStorage.getItem('userRequestSteps') != null) {
            beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
        }
        //kullanıcının doldurduğu formlar bu objede tutuluyor 
        const userRequestSteps = {
            ...beforeUserRequestSteps,
            comeFrom: 'basket',
            expireDate: new Date().getTime(),
            currentRequestStep: step
        }
        if (store.siteSettings.step3PageStatus.insideOfStep) {
            let step3PageStatus = {
                ...store.siteSettings.step3PageStatus,
                insideOfStep: true,
                class: "move-down",
                translateYValue1: 0
            }
            this.props.dispatch(setSiteSettings({ step3PageStatus: step3PageStatus, withGrandiant: '' }));

        }
        //step dışından düzenle basılırsa
        else {
            document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
            setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                let step3PageStatus = {
                    class: "",
                    insideOfStep: true,
                    translateYValue1: 0
                }
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps, step3PageStatus: step3PageStatus, withGrandiant: '' }));
            }, config.waitToNextComponent);
            localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
        }
    }

    render() {
        const store = this.props.getState();
        const { currentPage, commonDictionary } = this.props.getState().siteSettings;

        let step1 = null;
        let step3 = null;
        let step3BrandImgSrc = ''
        let step3ImageAlt = ''
        let step3ModelImgSrc = ''
        let step3ModelImgAlt = ''
        let step4 = null;
        let step6 = null;
        let step7 = null;
        let step8 = null;
        let step9 = null;
        let step10 = null;
        let step11 = null;
        let symptomTotal = 0;
        let addServicesTotal = 0;
        try {
            if (store.siteSettings.userRequestSteps.requestStep1FormData.email) {

                step1 = {
                    title: currentPage.requestStep1.basketValue,
                    body2: store.siteSettings.userRequestSteps.requestStep1FormData.email,
                    step: 'requestStep1',
                    edit: commonDictionary.edit
                };
            }
        } catch (e) { }
        try {
            let body2 = ""
            try {
                if (store.siteSettings.userRequestSteps.requestStep3FormData.model.label) {
                    body2 = store.siteSettings.userRequestSteps.requestStep3FormData.model.label
                }
            } catch (e) { }

            step3 = {
                title: commonDictionary.deviceModelAndBrand,
                body1: commonDictionary.brand + ": " + store.siteSettings.userRequestSteps.requestStep3FormData.brand.name,
                body2: body2,
                step: 'requestStep3',
                edit: commonDictionary.edit
            };
        } catch (e) { }
        try {
            if (store.siteSettings.userRequestSteps.requestStep3FormData != null) {
                step3BrandImgSrc = store.siteSettings.userRequestSteps.requestStep3FormData.brand.imgSrc
                step3ImageAlt = store.siteSettings.userRequestSteps.requestStep3FormData.brand.name
                step3ModelImgSrc = store.siteSettings.userRequestSteps.requestStep3FormData.model.imgSrc
                step3ModelImgAlt = store.siteSettings.userRequestSteps.requestStep3FormData.model.label
            }
        } catch (e) { }
        try {
            if (store.siteSettings.userRequestSteps.requestStep4FormData != null) {
                if (store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms.length > 0) {
                    step4 = {
                        title: commonDictionary.problem,
                        symptoms: store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms,
                        step: 'requestStep4'
                    };
                }
            }

        } catch (e) { }
        try {
            let purchaseDate = store.siteSettings.userRequestSteps.requestStep6FormData.purchaseDate
            purchaseDate = purchaseDate == "" ? "" : JSON.stringify(purchaseDate).substring(1, 11)
            step6 = {
                title: commonDictionary.deviceDetails,
                body: [
                    { title: commonDictionary.imeiNo, content: store.siteSettings.userRequestSteps.requestStep6FormData.imei },
                    { title: commonDictionary.serialNo, content: store.siteSettings.userRequestSteps.requestStep6FormData.serialNumber },
                    { title: commonDictionary.devicePurchaseDate, content: purchaseDate },
                ],
                step: 'requestStep6',
                edit: commonDictionary.edit,
            };
        } catch (e) { }
        try {
            step7 = {
                title: commonDictionary.personelInformation,
                body: [
                    { title: commonDictionary.yourName, content: store.siteSettings.userRequestSteps.requestStep7FormData.name + " " + store.siteSettings.userRequestSteps.requestStep7FormData.lastName },
                    { title: commonDictionary.gsmNo, content: store.siteSettings.userRequestSteps.requestStep7FormData.phone },
                ],
                step: 'requestStep7',
                edit: commonDictionary.edit,
            };
        } catch (e) { }
        try {
            step8 = {
                title: commonDictionary.contactInfo,
                body: [
                    {
                        title: "",
                        content: store.siteSettings.userRequestSteps.requestStep8FormData.adress + "</br>" +
                                 store.siteSettings.userRequestSteps.requestStep8FormData.postCode + " " +
                                 store.siteSettings.userRequestSteps.requestStep8FormData.city.label + " " +
                                 store.siteSettings.userRequestSteps.requestStep8FormData.country.label
                    },

                ],
                step: 'requestStep8',
                edit: commonDictionary.edit,
            };
        } catch (e) { }
        try {
            step9 = {
                title: commonDictionary.deviceNear,
                body: [
                    {
                        title: "",
                        content: store.siteSettings.userRequestSteps.requestStep9FormData.accessories.join(", ")
                    }
                ],
                step: 'requestStep9',
                edit: commonDictionary.edit,
            };
        } catch (e) { }
        try {
            if (store.siteSettings.userRequestSteps.requestStep10FormData.pattern) {
                step10 = {
                    title: commonDictionary.devicePass,
                    body: [
                        {
                            title: "Pattern",
                            content: store.siteSettings.userRequestSteps.requestStep10FormData.pattern
                        },
                    ],
                    step: 'requestStep10',
                    edit: commonDictionary.edit,
                };
            }
            else if (store.siteSettings.userRequestSteps.requestStep10FormData.passCode) {
                step10 = {
                    title: commonDictionary.devicePass,
                    body: [
                        {
                            title: "Passcode",
                            content: store.siteSettings.userRequestSteps.requestStep10FormData.passCode.join('')
                        },
                    ],
                    step: 'requestStep10',
                    edit: commonDictionary.edit,
                };
            }
            else {
                step10 = {
                    title: commonDictionary.devicePass,
                    body: [
                        {
                            title: "unspecified",
                            content: unspecified
                        },
                    ],
                    step: 'requestStep10',
                    edit: commonDictionary.edit,
                };
            }

        } catch (e) {
            step10 = null
            // step10 = {
            //     title: commonDictionary.devicePass,
            //     body: [
            //         {
            //             title: "unspecified",
            //             content: commonDictionary.unspecified
            //         },
            //     ],
            //     step: 'requestStep10',
            //     edit: commonDictionary.edit,
            // };
        }
        try {
            if (store.siteSettings.userRequestSteps.requestStep4FormData != null) {
                let totall = 0
                symptomTotal = store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms.reduce((totall, symptom) => totall + symptom.total, 0)
            }
        } catch (e) { }
        try {
            if (store.siteSettings.userRequestSteps.requestStep11FormData != null) {
                let totall = 0
                addServicesTotal = store.siteSettings.userRequestSteps.requestStep11FormData.additionalServices.reduce((totall, addServ) => totall + addServ.total, 0)
            }
        } catch (e) { }
        try {
            if (store.siteSettings.userRequestSteps.requestStep11FormData.additionalServices.length > 0) {
               
                step11 = {
                    title: commonDictionary.additionalServices,
                    body: [
                        {
                            title: "",
                            content:  store.siteSettings.userRequestSteps.requestStep11FormData.additionalServices.map(function(elem){
                                return elem.service;
                            }).join(", ")
                        }
                    ],
                    step: 'requestStep11',
                    edit: commonDictionary.edit,
                };
            }
            else {
                step11 = null
            }
        } catch (e) { }

        return (
            <>
                {
                    store.siteSettings.userRequestSteps.currentRequestStep == 'requestSummaryStep' &&
                    <aside id="summary-wrapper" className="summary-wrapper active">
                        <PostRequest total={(symptomTotal + addServicesTotal)} page={this.props.page} />
                    </aside>

                }
                {
                    store.siteSettings.userRequestSteps.currentRequestStep != 'requestSummaryStep' &&
                    <aside id="summary-wrapper" className={step1 != null ? "summary-wrapper active" : "summary-wrapper"}>
                        <div className="basketItems">
                            {step3BrandImgSrc != '' &&
                                <div className="device-info">
                                    <img src={step3ModelImgSrc} alt={step3ModelImgAlt} className='model-logo'></img>
                                    <div className='sub-device-info'>
                                        {
                                            step3 != null &&
                                            <a href="#" onClick={() => this.changeStep(step3.step)} className='model-edit lnk-A'>{step3.edit}</a>
                                        }
                                        <img src={step3BrandImgSrc} alt={step3ImageAlt} className='brand-logo'></img>
                                        {
                                            step3 != null &&
                                            <div className='model-name'>{step3.body2}</div>
                                        }
                                    </div>
                                </div>

                            }
                            {step6 != null &&
                                <BasketItem1 item={step6} />
                            }
                            {step1 != null &&
                                <BasketItem5 item={step1} />
                            }
                            {step7 != null &&
                                <BasketItem1 item={step7} />
                            }
                            {step8 != null &&
                                <BasketItem1 item={step8} />
                            }
                            {step9 != null &&
                                <BasketItem1 item={step9} />
                            }
                            {step10 != null &&
                                <BasketItem1 item={step10} />
                            }
                            {step4 != null &&
                                <BasketItem2 item={step4} />
                            }

                            {step11 != null &&
                                <BasketItem1 item={step11} />
                            }

                            {/* {symptomTotal + addServicesTotal != 0 &&
                                <BasketItem3 total={symptomTotal + addServicesTotal} />
                            } */}

                        </div>
                    </aside>


                }

            </>
        )
    }
}

export default connect(initsStore)(RequestBasket);