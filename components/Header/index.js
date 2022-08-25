import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import { fetchUserInfo } from '../../store/actions/loginUser';
import RequestStepsStatusBar from '../Requests/requestStepsStatusBar'
import Modal from '../UI/Modals/Modal/Modal';
import RequestBasket from '../Requests/BasketItems/requestBasket'
import RegisterForm from '../Forms/RegisterForm'
import LoginForm from '../Forms/LoginForm'
class Header extends Component {

    closeModal = () => {
        this.props.dispatch(setSiteSettings({ showSummaryModal: false }));
    }
    openModal = () => {
        this.props.dispatch(setSiteSettings({ showSummaryModal: true }));
    }
    openLoginModal = () => {
        this.props.dispatch(setSiteSettings({ showLoginModal: true }));
    }
    closeLoginModal = () => {
        this.props.dispatch(setSiteSettings({ showLoginModal: false }));
    }
    openRegisterModal = () => {
        this.props.dispatch(setSiteSettings({ showRegisterModal: true }));
    }
    closeRegisterModal = () => {
        this.props.dispatch(setSiteSettings({ showRegisterModal: false }));
    }
    logout = () => {
        window.location.href = "/"
        localStorage.removeItem('userLogin')
        sessionStorage.removeItem('userLogin')
        this.props.dispatch(fetchUserInfo({ userLogin: null }))
    }
    componentDidMount() {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let qcode = params.get('activateCode');
        if (qcode) {
            const { commonDictionary } = this.props.getState().siteSettings;

            this.openLoginModal()

            setTimeout(function(){
                document.getElementById("f-email-login-modal").focus();
                alert(commonDictionary.accountActivated)
              }, 200);
        }
    }
    render() {
        const store = this.props.getState();
        const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;
        const homePageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/").filter((link) => link.lang == currPageLangSettings.lang))[0].url
        const ticketListPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account/ticketList").filter((link) => link.lang == currPageLangSettings.lang))[0].url
        const accountPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/account").filter((link) => link.lang == currPageLangSettings.lang))[0].url
        const currentRequestStep = store.siteSettings.userRequestSteps.currentRequestStep;

        return (
            <>
                <header>

                    <a id="site-logo" href={homePageUrl} className="logo">
                        <img src="../../static/images/logo-1.png" className="dark-logo" alt="reprep-logo" />
                        <img src="../../static/images/logo-2.png" className="light-logo" alt="reprep-logo" />
                    </a>

                    <nav id="menu-primary">

                    </nav>
                    <nav id="menu-language">
                        {/* <LangSwitcher /> */}
                    </nav>
                    {
                        store.loginUser.isAuth ?
                            (

                                <div id="section-user-menu" className="f-menu-item">
                                    <a href="#" className="f-trigger">
                                        <div className="me-initials">
                                            <span>
                                                {store.loginUser.user.name.substring(0, 1).toUpperCase()}
                                            </span>
                                            <span>
                                                {store.loginUser.user.lastName.substring(0, 1).toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="me-name" title={store.loginUser.user.name + " " + store.loginUser.user.lastName}>{store.loginUser.user.name + " " + store.loginUser.user.lastName}</div>
                                        <div className="me-organization" title={store.loginUser.user.email}> {store.loginUser.user.email}</div>
                                    </a>

                                    <nav className="f-content">
                                        <ul>
                                            <li className="f-topinfo">
                                                <div className="me-name" title={store.loginUser.user.name + " " + store.loginUser.user.lastName}>{store.loginUser.user.name + " " + store.loginUser.user.lastName}</div>
                                                <div className="me-organization" title={store.loginUser.user.email}> {store.loginUser.user.email}</div>
                                            </li>
                                            <li>
                                                <a href={ticketListPageUrl}>  {commonDictionary.myRequests}</a>
                                            </li>
                                            <li>
                                                <a href={accountPageUrl}>{commonDictionary.myAccount}</a>
                                            </li>
                                            <li>
                                                <a href="#" onClick={() => this.logout()}>{commonDictionary.closeSession}</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            ) :
                            (
                                <div id="identityArea">
                                    <a className="register-btn ff-H" href="#" onClick={() => this.openRegisterModal()}>
                                        {commonDictionary.register}
                                    </a>
                                    <a className="login-btn ff-B" href="#" onClick={() => this.openLoginModal()}>
                                        {commonDictionary.login}
                                    </a>
                                </div>
                            )
                    }



                    <RequestStepsStatusBar />
                    {
                        currentRequestStep != "requestStep1" &&
                        <div className="iconSummary">
                            <a href="#" onClick={() => this.openModal()}> <img src="../../static/images/icons/icon-summary.png" alt="icon-doc" /></a>
                        </div>
                    }
                </header>
                {
                    store.siteSettings.userRequestSteps.currentRequestStep != 'requestSummaryStep' &&
                    <Modal show={store.siteSettings.showSummaryModal} clicked={() => this.closeModal()} type='modal-type-02-right summary-wrapper'>
                        <RequestBasket closeModal={() => this.closeModal()} />
                    </Modal>
                }

                    <LoginForm showLoginModal={store.siteSettings.showLoginModal} closeModal={() => this.closeLoginModal()} />
                    <RegisterForm showRegisterModal={store.siteSettings.showRegisterModal} closeModal={() => this.closeRegisterModal()}/>
            </>
        )
    }
}
export default connect(initsStore)(Header);
