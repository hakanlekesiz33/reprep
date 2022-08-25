import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import * as config from '../../../config';
import Modal from '../../UI/Modals/Modal/Modal';
import ConfirmModal from '../../UI/Modals/Confirm'

class BasketItem2 extends Component {

    removeSmyptom = (item) => {
        const store = this.props.getState();
        //mobilde modal içinden gösterdiğimiz için önce modalı kapatıyoruz
        this.props.dispatch(setSiteSettings({ showSummaryModal: false }));

        //kullanıcınun daha önce doldurduğu form var ise onu elimize alıyoruz
        let beforeUserRequestSteps = null;
        if (localStorage.getItem('userRequestSteps') != null) {
            beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
        }

        let beforeSymptoms = this.props.getState().siteSettings.userRequestSteps.requestStep4FormData.Symptoms;
        let newSymptoms = []
        beforeSymptoms.map(function (s) {
            if (s != item) {
                newSymptoms.push(s)
            }
        })
        let currentRequestStep = beforeUserRequestSteps.currentRequestStep
        const requestStep4FormData = {
            ...this.props.getState().siteSettings.userRequestSteps.requestStep4FormData,
            Symptoms: newSymptoms
        }
        if (newSymptoms.length == 0) {
            currentRequestStep = 'requestStep4'
            //kullanıcınun doldurduğu formlar bu objede tutuluyor 
            const userRequestSteps = {
                ...beforeUserRequestSteps,
            comeFrom: 'basket',
            expireDate: new Date().getTime(),
                currentRequestStep: currentRequestStep,
                requestStep4FormData: requestStep4FormData
            }
            document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
            setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                let step4PageStatus = {
                    class: "",
                    translateYValue1: 0,
                }
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps, step4PageStatus: step4PageStatus,withGrandiant:'' }));

            }, config.waitToNextComponent);
        }
        else {
            
            const userRequestSteps = {
                ...beforeUserRequestSteps,
                expireDate: new Date().getTime(),
                requestStep4FormData: requestStep4FormData
            }
            this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps,withGrandiant:'' }));
        }


    }
  
    detectFunctionAfterResult = () => {
        this.closeModal()
        const store = this.props.getState()
        if (store.siteSettings.confirmResult){
            this.removeSmyptom(this.state.deletedItem)
        }

    }
   
    async closeModal() {
        await this.props.dispatch(setSiteSettings({ showConfirmModal: false }));
    }
    async openModal(item) {
        this.setState({...this.state,deletedItem:item})
        await this.props.dispatch(setSiteSettings({ showConfirmModal: true }));
    }
    render() {
        const store = this.props.getState()
        const { currentPage, commonDictionary } = store.siteSettings;
        return (
            <>
                <div className="citemB">
                    <div className="cbox01 ff-N"> {this.props.item.title}</div>
                    {this.props.item.symptoms.map((item, index) => (

                        <div className="cbox02" key={"symptoms" + index + item.subSymptom.id}>
                            <div className='cbox02-A ff-O'>
                                {item.mainSymptom.name}
                            </div>
                            <div className='cbox02-B ff-O'>
                                {item.subSymptom.name}
                                {/* <span className='cbox02-B-01'>
                                    {" (" + item.total + "₺)"}
                                </span> */}
                            </div>

                            <div className="cbox02-C lnk-A" onClick={() => this.openModal(item)}>
                            {commonDictionary.delete}
                            </div>
                        </div>
                    ))}
                </div>
                <Modal show={store.siteSettings.showConfirmModal} clicked={() => this.closeModal()} type='modal-type-04'>
                        <ConfirmModal question={commonDictionary.deleteSymptomQuestion}
                         detectFunctionAfterResult={() => this.detectFunctionAfterResult()} />
                </Modal>
            </>
        )
    }
}

export default connect(initsStore)(BasketItem2);