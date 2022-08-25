import React, { Component } from 'react';
import axios from 'axios'
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { fetchUserInfo } from '../../../store/actions/loginUser';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import * as config from '../../../config';

class FacebookGoogleLogin extends Component {
    state = {
        spinnerGoogleShow: false,
        spinnerFacebookShow: false
    }
    checkUserInfo = (userInfo, profileImgUrl, alternativeLoginType) => {
        const _this = this
        const registerForm = {
            Email: userInfo.email,
            Name: userInfo.name,
            LastName: userInfo.lastName,
            ProfilImageUrl: profileImgUrl,
            AlternativeLoginType: alternativeLoginType
        }

        var bodyFormData = new FormData();
        bodyFormData.append('registerForm', JSON.stringify(registerForm));

        const headers = {
            'Content-Type': 'multipart/form-data'
        }
        axios.post(config.registerWithAlternativeLogin, bodyFormData, {
            headers: headers

        }).then(function (res) {
           // _this.setState({ ..._this.state, spinnerGoogleShow: false, spinnerFacebookShow: false })

            if (res.status == 200) {

                const userLogin = {
                    ...res.data,
                    rememberMe: false,
                    expireDate: new Date().getTime()
                }

                sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
                _this.props.dispatch(fetchUserInfo(userLogin))
                //_this.props.closeModal()
                window.location.href = _this.props.redirectUrl
            }

        })
    }

    responseFacebook = (response) => {
        if (response.status != "unknown") {
            //this.setState({ ...this.state, spinnerFacebookShow: true })
            const nameArray = response.name.split(" ")
            const lastName = nameArray.length > 0 ? nameArray[nameArray.length - 1] : ""
            const firstNameArray = nameArray.splice(0, nameArray.length - 1);

            const userInfo = {
                email: response.email,
                name: firstNameArray.join(' '),
                lastName: lastName
            }

            this.checkUserInfo(userInfo, response.picture.data.url, "facebook")
        }

    }

    responseGoogle = (response) => {
        if (response) {
            const userInfo = {
                email: response.profileObj.email,
                name: response.profileObj.givenName,
                lastName: response.profileObj.familyName
            }

            this.checkUserInfo(userInfo, response.profileObj.imageUrl, "google")
        }

    }

    render() {
        const { commonDictionary } = this.props.getState().siteSettings;
        return (
            <>
                {
                    (this.props.alternativeLoginType == 'all' || this.props.alternativeLoginType == 'facebook') &&
                    <FacebookLogin
                        appId="808192912944785" //APP ID NOT CREATED YET
                        textButton={<>{commonDictionary.loginWithFacebook}
                            {/* <Spinner show={this.state.spinnerFacebookShow} type="dark" /> */}
                        </>}
                        fields="name,email,picture"
                        cssClass="btnFacebook ff-J"
                        callback={this.responseFacebook}
                    />
                }
                {
                    (this.props.alternativeLoginType == 'all' || this.props.alternativeLoginType == 'google') &&
                    <GoogleLogin
                        clientId="971032915318-727vc8u3go7kfau18ev09fufvhlrqvf6.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                        render={renderProps => (
                            <button className="btnGoogle ff-K"
                                onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                {commonDictionary.loginWithGoogle}
                                {/* {<Spinner show={this.state.spinnerGoogleShow} type="dark" />} */}
                            </button>
                        )}
                        onSuccess={this.responseGoogle}
                    //onFailure={this.responseGoogle}
                    />
                }

            </>
        )
    }
}

export default connect(initsStore)(FacebookGoogleLogin);