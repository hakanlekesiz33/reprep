import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { fetchUserInfo } from '../../../store/actions/loginUser';
import Router from 'next/router'
import SearchUserTickets from '../../Forms/Profile/searchUserTickets';
import Link from 'next/link';
import axios from 'axios'
import * as config from '../../../config';


class Navbar extends Component {
  state = {
    showYaybar: true,
    hoverAvatar: false,
    profileImage:null
  }

  logout = () => {
    window.location.href = "/"
    localStorage.removeItem('userLogin')
    sessionStorage.removeItem('userLogin')
    this.props.dispatch(fetchUserInfo({ userLogin: null }))
  }

  hideYayBar = () => {
    if (this.state.showYaybar) {
      document.getElementsByTagName('body')[0].classList.add('yay-hide');
      document.getElementsByTagName('body')[0].classList.remove('rui-navbar-show');
    }
    else {
      document.getElementsByTagName('body')[0].classList.add('rui-navbar-show');
      document.getElementsByTagName('body')[0].classList.remove('yay-hide');
    }

    this.setState({ ...this.state, showYaybar: !this.state.showYaybar });

  }

  onHoverAvatar = (value) => {
    this.setState({ ...this.state, hoverAvatar: value });
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


axios.post(config.getUserImages,bodyFormData, {
    headers: headers
})
    .then(function (res) {
        if(res.data.profileImage!=null){
            _this.setState({ ..._this.state, profileImage: res.data.profileImage });
        }
    });

  
}

  render() {
    const store = this.props.getState()
    const { sharedContent, currPageLangSettings, commonDictionary } = this.props.getState().siteSettings;
    const accountPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account").filter((link) => link.lang == currPageLangSettings.lang))[0].url
    
    return (
      <>
        <nav className="rui-navbar rui-navbar-top rui-navbar-sticky f-account-navbar">
          <div className="rui-navbar-brand">
            <a href={currPageLangSettings.homePageUrl} className="rui-navbar-logo">
              <img src="/static/images/logo-1.png" width="45" />
            </a>


            <button className="yay-toggle rui-yaybar-toggle" type="button" onClick={() => this.hideYayBar()}>
              <span></span>
            </button>

          </div>
          <div className="container-fluid">
            <div className="rui-navbar-content">
              <ul className="nav rui-navbar-right">
                <li className="nav-item">
                  <SearchUserTickets />
                </li>
                <li className={this.state.hoverAvatar ? "dropdown dropdown-hover dropdown-triangle dropdown-keep-open rui-dropdown-triangle-ready hover show" : "dropdown dropdown-hover dropdown-triangle dropdown-keep-open rui-dropdown-triangle-ready"}

                  onMouseLeave={() => this.onHoverAvatar(false)}
                  onMouseEnter={() => this.onHoverAvatar(true)}
                >
                  <a className="dropdown-item rui-navbar-avatar mnr-6" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.hoverAvatar}>
                    <img src={this.state.profileImage == null ? "/static/images/default-avatar.jpg" : this.state.profileImage}
                      alt="profile-image" />
                  </a>
                  <ul className={this.state.hoverAvatar ? "nav dropdown-menu hover show" : "nav dropdown-menu"} x-placement="bottom-start">
               
                    <li>
                      <a href="#!" className="nav-link" onClick={() => this.logout()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-out rui-icon rui-icon-stroke-1_5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        <span>{commonDictionary.logout}</span>
                        <span className="rui-nav-circle"></span>
                      </a>
                    </li>
                    <span className="dropdown-menu-triangle"></span>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="rui-navbar rui-navbar-mobile">
          <div className="rui-navbar-head">
            <button className="rui-yaybar-toggle rui-yaybar-toggle-inverse yay-toggle" type="button" aria-label="Toggle side navigation">
              <span></span>
            </button>
            <Link href="/" as={currPageLangSettings.homePageUrl}>
              <a className="rui-navbar-logo mr-auto">
                <img src="/static/images/logo-1.png" alt="" width="45" />
              </a>
            </Link>
            <SearchUserTickets />
            <div className="dropdown dropdown-triangle">
              <a className="dropdown-item rui-navbar-avatar" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={store.loginUser.user.profileImage == "" ? "/static/images/default-avatar.jpg" : store.loginUser.user.profileImage}
                      alt="profile-image" />
              </a>
              <ul className="dropdown-menu nav">

                <li>
                    <a href={accountPageUrl} className="nav-link">
                      <span data-feather="users" className="rui-icon rui-icon-stroke-1_5"></span>
                      <span>{commonDictionary.dashboard}</span>
                      <span className="rui-nav-circle"></span>
                    </a>
                </li>
                <li>
                  <a href="#!" className="nav-link" onClick={() => this.logout()}>
                    <span data-feather="log-out" className="rui-icon rui-icon-stroke-1_5"></span>
                    <span>{commonDictionary.logout}</span>
                    <span className="rui-nav-circle"></span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
        <div className="rui-navbar-bg"></div>
      </>
    )
  }
}

export default connect(initsStore)(Navbar);
