import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import ChangePassword from '../../Forms/Profile/changePassword';
import Edit from '../../Forms/Profile/edit';

class ProfileSettings extends Component {
    state = {
        currTab: 'profile',
        showAvatarEditModal: false,
    }

    changeTab = (value) => {
        this.setState({ ...this.state, currTab: value })
    }

    onInputChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value;
        setFieldValue(inputName, inputValue, false)
    }

 

    render() {
        const store = this.props.getState()
        const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;

        return (
            <>

                <div className="col-12">
                    <ul className="nav nav-tabs rui-tabs-sliding" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link rui-tabs-link active" id="settings-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="settings" aria-selected="false">
                                {commonDictionary.profileSettings}
                            </a>
                        </li>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="settings" role="tabpanel" aria-labelledby="settings-tab">

                            <div className="row vertical-gap">
                                <div className="col-12 col-lg-auto">
                                    <div className="card">
                                        <div className="card-body pt-20 pr-10 pb-20 pl-10">
                                            <ul className="nav flex-column mnt-3">
                                                <li>
                                                    <a
                                                        href='#!'
                                                        className={this.state.currTab == 'profile' ? 'nav-link active' : 'nav-link'}
                                                        onClick={() => this.changeTab("profile")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user rui-icon rui-icon-stroke-1_5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                                        <span>{commonDictionary.profile}</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        href='#!'
                                                        className={this.state.currTab == 'changePassword' ? 'nav-link active' : 'nav-link'}
                                                        onClick={() => this.changeTab("changePassword")}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-check rui-icon rui-icon-stroke-1_5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                                                        <span>{commonDictionary.changePassword}</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-8">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row vertical-gap sm-gap justify-content-end">
                                               
                                                {
                                                    this.state.currTab == 'changePassword' &&
                                                    <ChangePassword />
                                                }
                                                {
                                                    this.state.currTab == 'profile' &&
                                                    <Edit />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default connect(initsStore)(ProfileSettings);
