import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../../store';
import { setSiteSettings } from '../../../../store/actions/setSiteSettings';

class ConfirmModal extends Component {

    async setConfirmResult  (result){
       await this.props.dispatch(setSiteSettings({ confirmResult: result }))
    this.props.detectFunctionAfterResult()
    }

    render() {
        const store = this.props.getState();
        const { commonDictionary } = store.siteSettings;
        return (
            <>
                <div className="confirmModal">
                    <div className="f-question">
                        {this.props.question}
                   </div>
                    <a className="f-answer-yes" href="#" onClick={()=>this.setConfirmResult(true)}>
                        {commonDictionary.yes}
                   </a>
                    <a className="f-answer-no" href="#" onClick={()=>this.setConfirmResult(false)}>
                        {commonDictionary.no}
                   </a>
                </div>
            </>
        )
    }
}
export default connect(initsStore)(ConfirmModal);
