import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import ProfileSettings from '../components/profileSettings';
import Link from 'next/link';
import axios from 'axios'
import * as config from '../../../config';

class Content extends Component {


    state = {
        profileImage: null
    }

    async componentDidMount() {
        const _this = this;
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'bearer ' + JSON.parse(sessionStorage.getItem('userLogin')).token
        }

        const email = {
            email: this.props.getState().loginUser.user.email
        }

        var bodyFormData = new FormData();
        bodyFormData.append('email', JSON.stringify(email));


        axios.post(config.getUserImages, bodyFormData, {
            headers: headers
        })
            .then(function (res) {
                if (res.data.profileImage != null) {
                    _this.setState({ ..._this.state, profileImage: res.data.profileImage });
                }
            });


    }
    render() {
        const store = this.props.getState()
        const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;
        const ticketListPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account/ticketList").filter((link) => link.lang == currPageLangSettings.lang))[0].url
        let closedTickets = 0
        if (store.loginUser.user.tickets) {

            closedTickets = store.loginUser.user.tickets.ticketList.filter(item => item.ticketDetails.status == 59 || item.ticketDetails.status == 60 || item.ticketDetails.status == 61).length
        }

        return (
            <>
                <div className="rui-page content-wrap f-margin-top-65">
                    <div className="rui-page-title">
                        <div className="container-fluid">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">

                                    <li className="breadcrumb-item">
                                        <a href="/">
                                            {commonDictionary.homePage}
                                        </a>
                                    </li>

                                    <li className="breadcrumb-item">
                                        {currentPage.seo.pageTitle}
                                    </li>

                                </ol>
                            </nav>
                            <h1>{currentPage.seo.pageTitle}</h1>
                        </div>
                    </div>
                    <div className="rui-page-content">
                        <div className="container-fluid">
                            <div className="rui-profile row vertical-gap">
                                <div className="col-lg-6 col-xl-5">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row vertical-gap">
                                                <div className="col-auto">
                                                    <div className="rui-profile-img f-profile-img">
                                                        <img src={this.state.profileImage == null ? "../../../static/images/default-avatar.jpg" : this.state.profileImage}
                                                            alt="profile-image" />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="rui-profile-info">
                                                        <h3 className="rui-profile-info-title h4">{store.loginUser.user.name}</h3>
                                                        <small className="text-grey-6 mt-2 mb-15">{store.loginUser.user.company}</small>
                                                        <a className="rui-profile-info-mail" href="#">{store.loginUser.user.email}</a>
                                                        <a className="rui-profile-info-phone" href="#">{store.loginUser.user.phone}</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="rui-profile-numbers">
                                                <div className="row justify-content-center">
                                                    <div className="col"></div>
                                                    <div className="col-auto">
                                                        <div className="rui-profile-number text-center">
                                                            <h4 className="rui-profile-number-title h2">
                                                                {store.loginUser.user.tickets == null ? 0 : store.loginUser.user.tickets.ticketList.length}
                                                            </h4>
                                                            <small className="text-grey-6">
                                                                <a href={ticketListPageUrl}>
                                                                    {commonDictionary.tickets}
                                                                </a>
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="col p-0"></div>
                                                    <div className="col-auto">
                                                        <div className="rui-profile-number text-center">
                                                            <h4 className="rui-profile-number-title h2">
                                                                {store.loginUser.user.tickets == null ? 0 : store.loginUser.user.tickets.ticketList.length - closedTickets}
                                                            </h4>
                                                            <small className="text-grey-6">
                                                                <a href={ticketListPageUrl + "?status=0"}>
                                                                    {commonDictionary.active}
                                                                </a>
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="col p-0"></div>
                                                    <div className="col-auto">
                                                        <div className="rui-profile-number text-center">
                                                            <h4 className="rui-profile-number-title h2">
                                                                {store.loginUser.user.tickets == null ? 0 : closedTickets}
                                                            </h4>
                                                            <small className="text-grey-6">
                                                                <a href={ticketListPageUrl + "?status=-1"}>
                                                                    {commonDictionary.closed}
                                                                </a>
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="col"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="col-lg-6 col-xl-7">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <h2 className="card-title mnb-6 mr-auto">{commonDictionary.userLogs}</h2>
                                            </div>
                                            <ul className="list-group list-group-flush rui-profile-task-list">
                                                {store.loginUser.user.listedUserLogs.map((item, index) => (

                                                    <li className="list-group-item" key={"userLog" + index}>

                                                        <div className="rui-task rui-task-success">
                                                            <div className="rui-task-icon">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle rui-icon rui-icon-stroke-1_5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                                            </div>
                                                            <div className="rui-task-content">
                                                                <a className="rui-task-title" href="#">{item.title}</a>
                                                                <small className="rui-task-subtitle">#{store.loginUser.user.listedUserLogs.length - index} {item.status} at {' "' + item.createdDate.substring(0, 10) + '" '} by <a href="#">{store.loginUser.user.name}</a></small>
                                                            </div>

                                                        </div>

                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                */}
                                <ProfileSettings />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default connect(initsStore)(Content);
