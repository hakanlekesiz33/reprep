import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import * as config from '../../../config';

class BasketItem5 extends Component {
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

        if (store.siteSettings.step1PageStatus.insideOfStep) {
            let step1PageStatus = {
                ...store.siteSettings.step1PageStatus,
                insideOfStep: true,
                class: "move-down",
                translateYValue1: 0,
                translateYValue2: 0,
                translateYValue3: 0
            }
            this.props.dispatch(setSiteSettings({ step1PageStatus: step1PageStatus,withGrandiant:'' }));

        }
        //step dışından düzenle basılırsa
        else {
            document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
            setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                let step1PageStatus = {
                    class: "",
                    insideOfStep: true,
                    translateYValue1: 0,
                    translateYValue2: 0,
                    translateYValue3: 0
                }
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps, step1PageStatus: step1PageStatus,withGrandiant:'' }));
            }, config.waitToNextComponent);
        }

        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

    }
 
    render() {
        return (
            <>
                <div className="citemA">
                    <div className="citemA-01 ff-N"> {this.props.item.title}</div>
                    <div className="citemA-02 lnk-A" 
                    onClick={() => this.changeStep(this.props.item.step)}
                    >
                        {this.props.item.edit}
                    </div>
                    
                    {
                        this.props.item.body2 != "" ? (
                            <div className="citemA-03 ff-O">{this.props.item.body2}</div>
                        ) : (
                                null
                            )

                    }
                </div>
            </>
        )
    }
}

export default connect(initsStore)(BasketItem5);