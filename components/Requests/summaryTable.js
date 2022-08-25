

import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import * as config from '../../config';
import Modal from '../UI/Modals/Modal/Modal';
import ConfirmModal from '../UI/Modals/Confirm'
import { drawPatternLines, changeDrawLineStatus } from '../../static/common.js';
import axios from 'axios'

var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
class SummaryTable extends Component {

    state = {
        showPassCode: true
    }

    changeStep = (step) => {
        changeDrawLineStatus(true);
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
            comeFrom: 'summary',
            expireDate: new Date().getTime(),
            currentRequestStep: step
        }

        document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
        setTimeout(() => {

            document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
            const userRequestStepsForRedux = {
                ...userRequestSteps,
                comeFrom: "summary"
            }
            this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestStepsForRedux, withGrandiant: '' }));
        }, config.waitToNextComponent);

        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));


    }
    detectFunctionAfterResult = () => {

        this.closeModal()
        const store = this.props.getState()
        this.deleteSymptom(store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms[0])

    }
    async deleteSymptom(item) {

        const store = this.props.getState()
        let deleteLastSymptom = false
        if (store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms.length == 1) {
            if (store.siteSettings.confirmResult == null) {
                this.openModal()
            }
            else if (store.siteSettings.confirmResult == true) {
                deleteLastSymptom = true
                await this.props.dispatch(setSiteSettings({ confirmResult: null }))

            }
            else if (store.siteSettings.confirmResult == false) {
                await this.props.dispatch(setSiteSettings({ confirmResult: null }))
            }
        }
        else {
            deleteLastSymptom = true
        }

        if (deleteLastSymptom) {
            changeDrawLineStatus(true);
            //kullanıcınun daha önce doldurduğu form var ise onu elimize alıyoruz
            let beforeUserRequestSteps = null;
            if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
            }

            let beforeSymptoms = store.siteSettings.userRequestSteps.requestStep4FormData.Symptoms;
            let newSymptoms = []
            beforeSymptoms.map(function (s) {
                if (s != item) {
                    newSymptoms.push(s)
                }
            })

            const requestStep4FormData = {
                ...store.siteSettings.userRequestSteps.requestStep4FormData,
                Symptoms: newSymptoms
            }
            if (newSymptoms.length == 0) {
                const currentRequestStep = 'requestStep4'
                //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                const userRequestSteps = {
                    ...beforeUserRequestSteps,
                    comeFrom: 'summary',
                    expireDate: new Date().getTime(),
                    currentRequestStep: currentRequestStep,
                    requestStep4FormData: requestStep4FormData
                }
                document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                setTimeout(() => {
                    document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")

                    localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                    const userRequestStepsForRedux = {
                        ...userRequestSteps,
                        comeFrom: "summary"
                    }
                    this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestStepsForRedux }));

                }, config.waitToNextComponent);
            }
            else {
                //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                const userRequestSteps = {
                    ...beforeUserRequestSteps,
                    comeFrom: 'summary',
                    expireDate: new Date().getTime(),
                    requestStep4FormData: requestStep4FormData
                }
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                await this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
            }
        }

    }
    async closeModal() {
        await this.props.dispatch(setSiteSettings({ showConfirmModal: false }));
    }
    async openModal() {
        await this.props.dispatch(setSiteSettings({ showConfirmModal: true }));
    }

    showPdf = () => {
        const store = this.props.getState()
        const getFilesModel =
        {
            fileName: "",
            ticketId: store.siteSettings.finalPageProps.ticketId,
            userId: store.loginUser.user.id,
            isUserFile: false,
        }
        var bodyFormData = new FormData();

        bodyFormData.append('getFilesModel', JSON.stringify(getFilesModel));

        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'bearer ' + JSON.parse(sessionStorage.getItem('userLogin')).token
        }
        axios.post(config.getUserFiles, bodyFormData, {
            headers: headers

        }).then(function (res) {
            let pdfWindow = window.open("")
            pdfWindow.document.write("<iframe width='100%' height='100%' src='" + res.data.byteFile + "'></iframe>")

        })

    }
    componentDidMount() {
        const store = this.props.getState()
        if (store.siteSettings.userRequestSteps.requestStep10FormData.patternOrPasscode == "pattern") {
            drawPatternLines("pattern-wrapper", parseInt(store.siteSettings.userRequestSteps.requestStep10FormData.pattern))
            this.setState({ ...this.state, showPassCode: false })
        }
    }
    render() {
        const store = this.props.getState()
        const { currentPage, commonDictionary } = store.siteSettings;
        const content = this.props.content
        const listItems = content.items.map((item, index) =>
            <ul key={"sumtab" + index} className='cbox-03-A'>

                <li className="hdr-G">
                    {item.title}
                </li>

                {
                    content.id == 2 ?
                        (
                            <li>
                                <ul>
                                    <span className="f-subSymptom ff-P">
                                        {htmlToReactParser.parse(item.value)}
                                    </span>
                                    {
                                        this.props.page != "final" &&
                                        <span className="f-delete lnk-A" onClick={() => this.deleteSymptom(item.item)}>
                                            {commonDictionary.delete}
                                        </span>
                                    }


                                </ul>
                            </li>
                        ) : (
                            content.id == 4 ?
                                (
                                    <li className="ff-P">
                                        {
                                            store.siteSettings.userRequestSteps.requestStep10FormData.patternOrPasscode == "pattern" ?
                                                (
                                                    <>
                                                        <div className={"showPatternCode " + this.state.showPassCode}>
                                                            <div id="pattern-wrapper">
                                                                <div id="dot-1"></div>
                                                                <div id="dot-2"></div>
                                                                <div id="dot-3"></div>
                                                                <div id="dot-4"></div>
                                                                <div id="dot-5"></div>
                                                                <div id="dot-6"></div>
                                                                <div id="dot-7"></div>
                                                                <div id="dot-8"></div>
                                                                <div id="dot-9"></div>
                                                            </div>
                                                            <a onClick={() =>
                                                                this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                                            } href="#" className="showPassLnk lnk-A">{commonDictionary.hide}</a>
                                                        </div>

                                                        <div className={"showPatternCode " + !this.state.showPassCode}>
                                                            <span className="showPassValue">********</span>
                                                            <a onClick={() =>
                                                                this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                                            } href="#" className="showPassLnk lnk-A">{commonDictionary.show2}</a>
                                                        </div>
                                                    </>

                                                ) : (
                                                    store.siteSettings.userRequestSteps.requestStep10FormData.patternOrPasscode == "passCode" ?
                                                        (
                                                            !this.state.showPassCode ? (
                                                                <div>
                                                                    <span className="showPassValue">
                                                                        {htmlToReactParser.parse(item.value)}
                                                                    </span>
                                                                    <a onClick={() =>
                                                                        this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                                                    } href="#" className="showPassLnk lnk-A">{commonDictionary.hide}</a>
                                                                </div>

                                                            ) : (
                                                                    <div>
                                                                        <span className="showPassValue">********</span>
                                                                        <a onClick={() =>
                                                                            this.setState({ ...this.state, showPassCode: !this.state.showPassCode })
                                                                        } href="#" className="showPassLnk lnk-A">{commonDictionary.show2}</a>
                                                                    </div>

                                                                )
                                                        ) : (
                                                            commonDictionary.unspecified
                                                        )
                                                )
                                        }
                                    </li>

                                ) : (
                                    content.id == 0 ?
                                        (
                                            item.value.split('|')[1] == "pdfLink" ?
                                                (
                                                    <li className="ff-P">
                                                        <a className="ff-P color-green" href="#" onClick={() => this.showPdf()}>
                                                            {htmlToReactParser.parse(item.value.split('|')[0])}
                                                        </a>
                                                    </li>
                                                ) : (
                                                    item.value.split('|')[1] == "dhlLink" ?
                                                    (
                                                        <li className="ff-P">
                                                            <a target="_blank" className="ff-P color-green" href={item.value.split('|')[2]}>
                                                                {htmlToReactParser.parse(item.value.split('|')[0])}
                                                            </a>
                                                        </li>
                                                    ) : (
                                                        <li className="ff-P">{htmlToReactParser.parse(item.value.split('|')[0])}</li>
                                                    )
                                                )
                                        ) : (
                                            <li className="ff-P">{htmlToReactParser.parse(item.value)}</li>
                                        )
                                )
                        )
                }
            </ul >
        );

        return (
            <>
                <div className={'summaryTable ' + this.props.customClass}>
                    <div className='cbox-01 hdr-G'>
                        {this.props.content.title}
                    </div>
                    <div className='cbox-02'>
                        <a className="lnk-A" href="#" onClick={() => this.changeStep(this.props.content.step)}>
                            {
                                this.props.page != "final" &&
                                this.props.content.editText
                            }
                        </a>
                    </div>
                    <ul className="t-container">
                        <li className='cbox-03'>
                            {listItems}
                        </li>
                    </ul>
                </div>
                {
                    content.id == 2 &&
                    <Modal show={store.siteSettings.showConfirmModal} clicked={() => this.closeModal()} type='modal-type-04'>
                        <ConfirmModal question={commonDictionary.deleteSymptomQuestion}
                            detectFunctionAfterResult={() => this.detectFunctionAfterResult()} />
                    </Modal>
                }
            </>
        )
    }
}

export default connect(initsStore)(SummaryTable);