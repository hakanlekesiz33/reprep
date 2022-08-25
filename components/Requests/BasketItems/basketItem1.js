import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import * as config from '../../../config';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
class BasketItem1 extends Component {

    state = {
        showPassCode: false
    }
    changeStep = (step) => {
        const store = this.props.getState()
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
        if (step == "requestStep10") {
            if (store.siteSettings.step10PageStatus.insideOfStep) {
                let step10PageStatus = {
                    ...store.siteSettings.step10PageStatus,
                    insideOfStep: true,
                    class: "move-down",
                    translateYValue1: 0,
                }
                this.props.dispatch(setSiteSettings({ step10PageStatus: step10PageStatus, withGrandiant: '' }));
            }
            //step dışından düzenle basılırsa
            else {
                document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                setTimeout(() => {
                    document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                    let step10PageStatus = {
                        class: "",
                        insideOfStep: true,
                        translateYValue1: 0,
                    }
                    this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps, step10PageStatus: step10PageStatus, withGrandiant: '' }));
                }, config.waitToNextComponent);
            }
        }
        else {
            document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
            setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps, withGrandiant: '' }));
            }, config.waitToNextComponent);
        }
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));


    }
    render() {
        const store = this.props.getState()
        const { commonDictionary } = store.siteSettings;
        let isThereAnySymptom = false

        if (store.siteSettings.userRequestSteps.requestStep4FormData != null) {
            if (store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms) {
                isThereAnySymptom = store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms.length > 0
            }
        }


        const thisStep = this.props.item.step
        const list = this.props.item.body.map((item, index) => (
            item.content == undefined || item.content == "" ?
                (
                    null
                ) : (
                    thisStep == "requestStep10" ?
                        (
                            item.title != "unspecified" ?
                                (
                                    this.state.showPassCode ? (
                                        <div className="citemA-03 ff-O" key={thisStep + index}>
                                            <span>
                                                {item.title != "" && item.title + ": "}
                                                {item.content}
                                            </span>

                                            <a onClick={() =>
                                                this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                            } style={{ marginLeft: '10px' }} href="#" className="lnk-A">{commonDictionary.hide}</a>
                                        </div>

                                    ) : (
                                            <div className="citemA-03 ff-O" key={thisStep + index}>
                                                <span>
                                                    {item.title != "" && item.title + ": "}
                                                ********
                                                </span>
                                                <a onClick={() =>
                                                    this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                                } style={{ marginLeft: '10px' }} href="#" className="lnk-A">{commonDictionary.show2}</a>
                                            </div>

                                        )

                                ) : (
                                    <div className="citemA-03 ff-O" key={thisStep + index}>
                                        {htmlToReactParser.parse(item.content)}
                                    </div>
                                )
                        ) : (
                            <div className="citemA-03 ff-O" key={thisStep + index}>
                                {item.title != "" && item.title + ": "}
                                {htmlToReactParser.parse(item.content)}
                            </div>
                        )

                )
        ))

        return (
            <>
                <div className="citemA">
                    <div className="citemA-01 ff-N"> {this.props.item.title}</div>

                    {
                        //  (thisStep == "requestStep2") || isThereAnySymptom ?
                        false || isThereAnySymptom ?
                            (
                                <div className="citemA-02 lnk-A f-tooltip-deleted" onClick={() => this.changeStep(thisStep)}>
                                    {this.props.item.edit}
                                </div>

                            ) : (
                                <div className="citemA-02 lnk-A f-tooltip-A" data-tooltip-text={store.siteSettings.commonDictionary.symptomsRequired}>
                                    {this.props.item.edit}
                                </div>
                            )

                    }

                    {
                        list
                    }
                </div>
            </>
        )
    }
}

export default connect(initsStore)(BasketItem1);