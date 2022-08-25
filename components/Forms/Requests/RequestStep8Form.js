import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import axios from 'axios'
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as config from '../../../config';
import InputText from '../Inputs/InputText'
import InputSelect2 from '../Inputs/InputSelect2'
import FSubmitButton from '../../Requests/fSubmitButton';
import CssTransion from '../../UI/CssTransition';
import FBackButton from '../../Requests/fBackButton';
import { select2FocusInput } from '../../../static/common.js';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

//adres,postal code, ülke şehir seçimi

class RequestStep8Form extends Component {
  state = {
    country: '',
    isCountryValid: '',
    countryOptions: [],
    city: '',
    isCityValid: '',
    showCityOptions: false,
    cityOptions: [],
    charCount: 3,
    allCityOptions: []
  }
  onInputChange = (e, inputName, setFieldValue) => {
    let inputValue = e.target.value;
    if (inputName == "adress") {
      if (inputValue.length > 200) {
        inputValue = inputValue.substring(0, 200)
      }
    }
    if (inputName == "postCode") {
      if (inputValue.length > 6) {
        inputValue = inputValue.substring(0, 6)
      }
    }
    setFieldValue(inputName, inputValue, false)
  }
  handleCity = val => {
    this.setState({ ...this.state, city: val, isCityValid: '' });
  };
  handleCityWithSearchParams = (e) => {
    if (e.length > 2) {
      this.setState({ ...this.state, showCityOptions: true });
    }
    else if (e.length == 0) {
      return
    }
    else if (e.length <= 2) {
      this.setState({ ...this.state, charCount: (3 - e.length), showCityOptions: false });
    }

  };
  handleSearchOptions = () => {
    const { commonDictionary } = this.props.getState().siteSettings;
    if (this.state.showCityOptions) {
      return commonDictionary.noOptionsMessage
    }
    else {
      return this.state.charCount + " " + commonDictionary.charEnter
    }
  };


  handleCountry = val => {
    var element = document.querySelector(".css-1wa3eu0-placeholder")
    var element2 = document.querySelector(".css-1uccc91-singleValue")
    if (element) {
      element.style.display = "block"
    }
    if (element2) {
      element2.style.display = "block"
    }

    const updatedCityOptions = this.state.allCityOptions.filter((city) => val.value == city.country);
    this.setState({ ...this.state, country: val, city: '', cityOptions: updatedCityOptions, isCountryValid: '', isCityValid: '' });
  };

  async componentDidMount() {


    const store = this.props.getState();
    const _this = this;
    let city = ''
    let country = ''
    let cityOptions = []
    let allCityOptions = []
    let countryOptions = []
    let userCountry = ""
    let userCity = ""
    await axios.get(config.citiesJson)
      .then(function (res) {
        res.data.map(function (city) {
          allCityOptions.push({ value: city.CityId, label: city.CityName, country: city.CountryId });
          if (store.loginUser.isAuth) {
            if (city.CityId == store.loginUser.user.city) {
              userCity = { value: city.CityId, label: city.CityName, country: city.CountryId }
            }
          }
        })
        _this.setState({
          ..._this.state,
          allCityOptions: allCityOptions,
        });
      })
    // await axios.get(config.countriesJson)
    //   .then(function (res) {

    //     res.data.map(function (country) {
    //       countryOptions.push({ value: country.CountryId, label: country.CountryName });
    //       if (store.loginUser.isAuth) {
    //         if (country.CountryId == store.loginUser.user.country) {
    //           userCountry = { value: country.CountryId, label: country.CountryName }
    //         }
    //       }
    //     })
    //     _this.setState({
    //       ..._this.state,
    //       countryOptions: countryOptions,
    //     });
    //   })
    //daha önceden seçilmiş ülke veya şehir varsa
    userCountry = { value: 1, label: "Deutschland" }
    _this.setState({
      ..._this.state,
      countryOptions: countryOptions,
    });
    country = userCountry
    try {
      if (store.siteSettings.userRequestSteps.requestStep8FormData.city) {
        city = store.siteSettings.userRequestSteps.requestStep8FormData.city;
      }
      else {
        city = userCity
      }
    }
    catch (e) { }
    // try {
    //   if (store.siteSettings.userRequestSteps.requestStep8FormData.country) {
    //     country = store.siteSettings.userRequestSteps.requestStep8FormData.country
    //   }
    //   else {
    //     country = userCountry
    //   }
    // }
    // catch (e) { }

    if (country != '' && country != undefined) {
      cityOptions = this.state.allCityOptions.filter((city) => country.value == city.country);
    }
    else {
      city = ''
      //country = ''
    }
    this.setState({
      ...this.state,
      country: country,
      city: city,
      cityOptions: cityOptions,
    });
    select2FocusInput();

  }
  previousStep = (step) => {
    let beforeUserRequestSteps = null;
    if (localStorage.getItem('userRequestSteps') != null) {
      beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
    }
    //kullanıcının doldurduğu formlar bu objede tutuluyor 
    const userRequestSteps = {
      ...beforeUserRequestSteps,
      comeFrom: 'default',
      expireDate: new Date().getTime(),
      currentRequestStep: step
    }
    document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
    setTimeout(() => {
      document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
      this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
    }, config.waitToNextComponent);
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = store.siteSettings;
    let initialValuesAdress = '';
    let initialValuesPostCode = '';
    try {
      initialValuesAdress = store.siteSettings.userRequestSteps.requestStep8FormData.adress
    }
    catch (e) { }
    try {
      initialValuesPostCode = store.siteSettings.userRequestSteps.requestStep8FormData.postCode
    }
    catch (e) { }

    return (
      <CssTransion>
        <>
          <Formik
            initialValues={{
              adress: initialValuesAdress,
              postCode: initialValuesPostCode,
            }}
            validationSchema={Yup.object().shape({
              adress: Yup.string()
                .required(commonDictionary.requiredField),
              postCode: Yup.string()
                .required(commonDictionary.requiredField),
            })}
            onSubmit={values => {
              //şehir yada ülke boş bırakılmış ise validasyonda belirteceğiz
              const country = this.state.country;
              const city = this.state.city;
              if (country == '') {
                this.setState({ ...this.state, isCountryValid: 'error' })
                return;
              }
              if (city == '') {
                this.setState({ ...this.state, isCityValid: 'error' })
                return;
              }
              const requestStep8FormData = {
                adress: values.adress,
                postCode: values.postCode,
                country: country,
                city: city
              }

              //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
              const requestSteps = currentPage.requestSteps
              let nextStep = "requestStep8";
              for (let i = 0; i < requestSteps.length - 1; i++) {
                if (requestSteps[i].contentTypeAlias == "requestStep8") {
                  nextStep = requestSteps[i + 1].contentTypeAlias
                }
              }
              //kullanıcınun daha önce dolduruduğu form var ise önce onu elde ediyoruz
              let beforeUserRequestSteps = null;
              if (localStorage.getItem('userRequestSteps') != null) {
                beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
              }

              //kullanıcınun doldurduğu formlar bu objede tutuluyor 
              const userRequestSteps = {
                ...beforeUserRequestSteps,
                comeFrom: 'default',
                expireDate: new Date().getTime(),
                currentRequestStep: nextStep,
                requestStep8FormData
              }

              document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
              setTimeout(() => {
                document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                //localStorage'a kayıt edildi
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

                //redux'a kayıt edildi
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));
              }, config.waitToNextComponent);
            }}
          >
            {({ errors, touched, values, handleSubmit, setFieldValue,
              setFieldTouched }) => (
                <Form encType="multipart/form-data" className="requestStep8 f-answer">

                  <div className="grid-wrapper">
                    <div className="f-question-A pr-A translateY-animation">
                      {htmlToReactParser.parse(currentPage.requestStep8.question)}
                    </div>
                    <div className="f-input-group-A first translateY-animation">

                      <div className="f-answer-group-B address">
                        <InputText
                          type="text"
                          placeholder=""
                          name="adress"
                          id="f-adress"
                          value={values.adress}
                          onKeyUp={(e) => this.onInputChange(e, "adress", setFieldValue)}
                          className={
                            errors.adress && touched.adress
                              ? values.adress.trim().length > 0 ? "tb-A v2 ff-A true error" : "tb-A v2 ff-A error"
                              : values.adress.trim().length > 0 ? "tb-A v2 ff-A true" : "tb-A v2 ff-A"
                          }
                        />
                        <label htmlFor="f-adress" className="placeholder-A">
                          {commonDictionary.adress}
                        </label>
                        {errors.adress && touched.adress ? <div>{errors.adress}</div> : null}
                      </div>

                      <div className="f-answer-group-B postalCode">
                        <InputText
                          type="name"
                          placeholder=""
                          name="postCode"
                          id="f-postCode"
                          value={values.postCode}
                          onKeyUp={(e) => this.onInputChange(e, "postCode", setFieldValue)}
                          className={
                            errors.postCode && touched.postCode
                              ? values.postCode.trim().length > 0 ? "tb-A v2 ff-A true error" : "tb-A v2 ff-A error"
                              : values.postCode.trim().length > 0 ? "tb-A v2 ff-A true" : "tb-A v2 ff-A"
                          }
                        />
                        <label htmlFor="f-postCode" className="placeholder-A">
                          {commonDictionary.postCode}
                        </label>
                        {errors.postCode && touched.postCode ? <div>{errors.postCode}</div> : null}
                      </div>

                    </div>
                    <div className="f-select-group-A translateY-animation">
                      {/* <div className={"f-answer-group-A " + this.state.isCountryValid}>
                        <InputSelect2
                          name="country"
                          id="country"
                          value={this.state.country}
                          onChange={this.handleCountry}
                          placeholder={commonDictionary.country}
                          options={this.state.countryOptions}
                          isMulti={false}
                        />
                      </div> */}
                      <div className={"f-answer-group-A f-city-select " + this.state.isCityValid}>

                        <InputSelect2
                          name="city"
                          id="city"
                          value={this.state.city}
                          placeholder={commonDictionary.city}
                          onChange={this.handleCity}
                          options={this.state.showCityOptions ? this.state.cityOptions : []}
                          isMulti={false}
                          openMenuOnClick={false}
                          isSearchable={true}
                          onInputChange={(e) => this.handleCityWithSearchParams(e)}
                          noOptionsMessage={this.handleSearchOptions}
                        />
                      </div>

                    </div>
                    <FBackButton click={() => this.previousStep("requestStep7")} goBack={commonDictionary.goBack} />

                    <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />

                  </div>

                </Form>
              )}
          </Formik>

        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep8Form);