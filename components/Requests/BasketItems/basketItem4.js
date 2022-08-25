import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';

class BasketItem4 extends Component {

    removeService = (item) => {
        
        //mobilde modal içinden gösterdiğimiz için önce modalı kapatıyoruz
        this.props.dispatch(setSiteSettings({ showSummaryModal: false }));

        let beforeUserRequestSteps = null;
        if (localStorage.getItem('userRequestSteps') != null) {
            beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
        }

        let beforeServices = this.props.getState().siteSettings.userRequestSteps.requestStep11FormData.additionalServices;
        let newServices = []
        beforeServices.map(function (s) {
            if (s != item) {
                newServices.push(s)
            }
        })
        let beforeFinalAdditionalServices = this.props.getState().siteSettings.userRequestSteps.requestStep11FormData.finalAdditionalServices;
        let newFinalAdditionalServices = []
        beforeFinalAdditionalServices.map(function (s) {
            if (s.service != item.fService) {
                newFinalAdditionalServices.push(s)
            }
        })
        const requestStep11FormData = {
            ...this.props.getState().siteSettings.userRequestSteps.requestStep11FormData,
            additionalServices: newServices,
            finalAdditionalServices: newFinalAdditionalServices
        }

        //kullanıcınun doldurduğu formlar bu objede tutuluyor 
        const userRequestSteps = {
            ...beforeUserRequestSteps,
            comeFrom: 'basket',
            expireDate: new Date().getTime(),
            requestStep11FormData
        }
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

        //redux'a kayıt edildi
        this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps,withGrandiant:'' }));
   

    };

    render() {
        const store = this.props.getState();
        const { currentPage, commonDictionary } = store.siteSettings;
        
        return (
            <>
                <div className="citemB basketItem4">
                    <div className="cbox01 ff-N"> {this.props.item.title}</div>
                    {this.props.item.services.map((item, index) => (

                        <div className="cbox02" key={"services" + index + item.service}>
                          
                            <div className='cbox02-B ff-O'>
                                {item.service}
                                {/* <span className='cbox02-B-01'>
                                    {" (" + item.total + "€)"}
                                </span> */}
                            </div>

                            <div className="cbox02-C lnk-A" onClick={() => this.removeService(item)}>
                            {commonDictionary.edit}
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )
    }
}

export default connect(initsStore)(BasketItem4);