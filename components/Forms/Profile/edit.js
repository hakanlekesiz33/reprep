import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { fetchUserInfo } from '../../../store/actions/loginUser';
import axios from 'axios'
import * as config from '../../../config';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import InputText from '../Inputs/InputText'
import DatePicker from '../Inputs/DatePicker'
import InputTextArea from '../Inputs/InputTextArea'
import InputSelect2 from '../Inputs/InputSelect2'

class Edit extends Component {
    state = {
        birthDate: new Date(),
        gender: '',
        genderOptions: [],
        country: '',
        countryOptions: [],
        city: '',
        showCityOptions: false,
        cityOptions: [],
        charCount: 3,
        allCityOptions: [],
        isProfileImgChanged: false,
        profileImage: "../../../static/images/default-avatar.jpg"

    };

    onPhoneChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value
        inputValue = inputValue.replace(/[^0-9]/g, '');//rakam hariç diğer karakterleri replace ediyor

        setFieldValue(inputName, inputValue)
        // this.setState({ ...this.state, imei: inputValue })
    }
    onInputChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value;
        setFieldValue(inputName, inputValue, false)
    }
    onNameChange = (e, inputName, setFieldValue) => {
        let inputValue = e.target.value
        inputValue = inputValue.replace(/[0-9/()@%+^'=!&}æß{½$#£"]/g, '');//bu karakterler var ise inputtan çıkarıyoruz
        inputValue = inputValue.replace(/[-_*?.:;,~|<>]/g, '');//bu karakterler var ise inputtan çıkarıyoruz

        setFieldValue(inputName, inputValue)
    }
    handleChangeBirthDate = date => {
        this.setState({
            ...this.state,
            birthDate: date,
        });
    };
    handleCountry = val => {
        const updatedCityOptions = this.state.allCityOptions.filter((city) => val.value == city.country);
        this.setState({ ...this.state, country: val, city: '', cityOptions: updatedCityOptions });
    };
    handleCity = val => {
        this.setState({ ...this.state, city: val });
    };
    handleGender = val => {
        this.setState({ ...this.state, gender: val });
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
    readURL = (image,text) => {
        var reader = new FileReader();
        const _this = this
        reader.onload = function (e) {
            if (e.total < 1024000) {
                _this.setState({ ...this.state, profileImage: e.target.result, isProfileImgChanged: true })
            }
            else {
                alert(text)
            }
        };

        reader.readAsDataURL(image);
    }
    async componentDidMount() {
        const store = this.props.getState();
        const { commonDictionary } = store.siteSettings;

        const _this = this;
        let cityOptions = []
        let allCityOptions = []
        let countryOptions = []
        axios.get(config.citiesJson)
            .then(function (res) {
                let _city = ''
                res.data.map(function (city) {
                    allCityOptions.push({ value: city.CityId, label: city.CityName, country: city.CountryId });
                    if (store.loginUser.user.city == city.CityId) {//kullanıcı şehir seçmedi ise 0 geliyor
                        _city = { value: city.CityId, label: city.CityName, country: city.CountryId }
                    }
                })
                _this.setState({
                    ..._this.state,
                    allCityOptions: allCityOptions,
                    city: _city,
                });

                let _country = {
                    label: "Deutschland",
                    value: 1
                }
                cityOptions = _this.state.allCityOptions.filter((city) => _country.value == city.country);

                _this.setState({
                    ..._this.state,
                    countryOptions: countryOptions,
                    cityOptions: cityOptions,
                    country: _country,
                    genderOptions: [
                        { value: commonDictionary.man, label: commonDictionary.man },
                        { value: commonDictionary.woman, label: commonDictionary.woman }
                    ]

                });

                // axios.get(config.countriesJson)
                //     .then(function (res) {
                //         let _country = ''
                //         res.data.map(function (country) {
                //             countryOptions.push({ value: country.CountryId, label: country.CountryName });
                //             if (store.loginUser.user.country == country.CountryId) {//kullanıcı şehir seçmedi ise 0 geliyor
                //                 _country = { value: country.CountryId, label: country.CountryName }
                //                 cityOptions = _this.state.allCityOptions.filter((city) => country.value == city.country);
                //             }
                //         })
                //         _this.setState({
                //             ..._this.state,
                //             countryOptions: countryOptions,
                //             cityOptions: cityOptions,
                //             country: _country,
                //             genderOptions: [
                //                 { value: commonDictionary.man, label: commonDictionary.man },
                //                 { value: commonDictionary.woman, label: commonDictionary.woman }
                //             ]

                //         });
                //     })
            })



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


        const gender = store.loginUser.user.gender == null ? '' : store.loginUser.user.gender
        this.setState({
            ...this.state,
            gender: gender == "" ? "" : { value: gender, label: gender },
            birthDate: new Date(store.loginUser.user.birthDate),
            profileImage: store.loginUser.user.profileImage == "" ? this.state.profileImage : store.loginUser.user.profileImage,
        });

    }

    render() {
        const store = this.props.getState()
        const _this = this
        const { currentPage, commonDictionary, sharedContent, currPageLangSettings } = this.props.getState().siteSettings;

        return (
            <>
                <Formik
                    initialValues={{
                        Name: store.loginUser.user.name == null ? "" : store.loginUser.user.name,
                        Email: store.loginUser.user.email == null ? "" : store.loginUser.user.email,
                        LastName: store.loginUser.user.lastName == null ? "" : store.loginUser.user.lastName,
                        Title: store.loginUser.user.title == null ? "" : store.loginUser.user.title,
                        Profession: store.loginUser.user.profession == null ? "" : store.loginUser.user.profession,
                        Phone: store.loginUser.user.phone == null ? "" : store.loginUser.user.phone,
                        Adress: store.loginUser.user.adress == null ? "" : store.loginUser.user.adress,
                        PostalCode: store.loginUser.user.postalCode == null ? "" : store.loginUser.user.postalCode
                    }}
                    validationSchema={Yup.object().shape({

                        Name: Yup.string()
                            .required(commonDictionary.requiredField),
                        Email: Yup.string()
                            .email(commonDictionary.invalidEmail)
                            .required(commonDictionary.requiredField),

                    })}

                    onSubmit={values => {
                        //şehir yada ülke boş bırakılmış ise validasyonda belirteceğiz
                        const country = this.state.country == '' ? 0 : this.state.country.value
                        const city = this.state.city == '' ? 0 : this.state.city.value
                        const gender = this.state.gender == '' ? null : this.state.gender.value
                        const birthDate = this.state.birthDate
                        const profileImage = this.state.isProfileImgChanged ? this.state.profileImage : ""
                        const updatedUser = {
                            Name: values.Name,
                            Email: values.Email,
                            LastName: values.LastName,
                            Title: values.Title,
                            Profession: values.Profession,
                            Phone: values.Phone,
                            Gender: gender,
                            BirthDate: birthDate,
                            Address: values.Adress,
                            City: city,
                            Country: country,
                            PostalCode: values.PostalCode,
                            ProfilImageUrl: profileImage

                        }
                        var bodyFormData = new FormData();
                        bodyFormData.append('updatedUser', JSON.stringify(updatedUser));
                        const headers = {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': 'bearer ' + JSON.parse(sessionStorage.getItem('userLogin')).token
                        }

                        axios.post(config.updateUser, bodyFormData, {
                            headers: headers
                        })
                            .then(function (response) {
                                const userLogin = {
                                    ...response.data,
                                    expireDate: new Date().getTime()
                                }
                                if (JSON.parse(sessionStorage.getItem('userLogin')).rememberMe) {
                                    localStorage.setItem('userLogin', JSON.stringify(userLogin))
                                }

                                sessionStorage.setItem('userLogin', JSON.stringify(userLogin))
                                _this.props.dispatch(fetchUserInfo(userLogin))
                                if (values.Email != store.loginUser.user.email) {


                                    alert(updatedProfileSuccessWithEmail)
                                    location.reload()
                                }
                                else {
                                    alert(commonDictionary.updatedProfileSuccess)
                                }
                            });
                    }}
                >
                    {({ errors, touched, values, handleSubmit, setFieldValue,
                        setFieldTouched }) => (
                            <div className="col-12">
                                
                                <Form encType="multipart/form-data" id="profileEdit">
                                    <div className="col-12">
                                        <a className="rui-profile-img f-profile-img" href="#">
                                            <img src={this.state.profileImage} alt="" />
                                        </a>
                                        {
                                            !store.loginUser.user.alternativeLogin &&
                                            <label htmlFor='avatarImage' className='labelforImage'>
                                                <img src='../../../static/images/edit.png'></img>
                                                <input name='avatarImage' id='avatarImage' type="file" onChange={(e) => this.readURL(e.target.files[0],commonDictionary.lessThan10Mb)} accept="image/gif, image/jpeg, image/png" />
                                            </label>
                                        }

                                    </div>
                                    <div className="col-12">
                                        <label>{commonDictionary.ePosta}</label>
                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="Email"
                                            value={values.Email}
                                            onKeyUp={(e) => this.onInputChange(e, "Email", setFieldValue)}
                                            className={
                                                errors.Email && touched.Email
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                           {errors.Email && touched.Email ?
                                            <div className={errors.Email.length > 40 ? "ff-C v2" : "ff-C"}>
                                                {errors.Email}
                                            </div> : null}
                                    </div>
                                    <div className="col-12">
                                        <label>{commonDictionary.yourName}</label>

                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="Name"
                                            value={values.Name}
                                            onKeyUp={(e) => this.onNameChange(e, "Name", setFieldValue)}
                                            className={
                                                errors.Name && touched.Name
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                         {errors.Name && touched.Name ?
                                            <div className={errors.Name.length > 40 ? "ff-C v2" : "ff-C"}>
                                                {errors.Name}
                                            </div> : null}
                                    </div>
                                    <div className="col-12">
                                        <label>{commonDictionary.yourLastName}</label>
                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="LastName"
                                            value={values.LastName}
                                            onKeyUp={(e) => this.onNameChange(e, "LastName", setFieldValue)}
                                            className={
                                                errors.LastName && touched.LastName
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label>{commonDictionary.title}</label>
                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="Title"
                                            value={values.Title}
                                            onKeyUp={(e) => this.onInputChange(e, "Title", setFieldValue)}
                                            className={
                                                errors.Title && touched.Title
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label>{commonDictionary.yourJob}</label>
                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="Profession"
                                            value={values.Profession}
                                            onKeyUp={(e) => this.onInputChange(e, "Profession", setFieldValue)}
                                            className={
                                                errors.Profession && touched.Profession
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                    </div>
                                    <div className="col-12 profile-edit">
                                        <label> {commonDictionary.birthdate + " : "}  </label>
                                        <DatePicker
                                            name="birthDate"
                                            value={this.state.birthDate}
                                            selected={this.state.birthDate ? this.state.birthDate : new Date()}
                                            onChange={this.handleChangeBirthDate}
                                            showMonthDropdown={true}
                                            showYearDropdown={true}
                                            className={
                                                errors.birthDate && touched.birthDate
                                                    ? "dp-a purchaseDate error"
                                                    : "dp-a purchaseDate"
                                            }

                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="select2Label"> {commonDictionary.gender} </label>
                                        <InputSelect2
                                            name="gender"
                                            id="gender"
                                            value={this.state.gender}
                                            onChange={this.handleGender}
                                            placeholder={commonDictionary.selectGender}
                                            options={this.state.genderOptions}
                                            isMulti={false}
                                            isSearchable={false}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label> {commonDictionary.phone} </label>
                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="Phone"
                                            id="Phone"
                                            value={values.Phone}
                                            onKeyUp={(e) => this.onPhoneChange(e, "Phone", setFieldValue)}
                                            className={
                                                errors.Phone && touched.Phone
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />


                                    </div>
                                    <div className="col-12">

                                        <label>{commonDictionary.adress}</label>

                                        <InputTextArea
                                            id="Adress"
                                            name="Adress"
                                            rows="2"
                                            placeholder=""
                                            className={
                                                errors.Adress && touched.Adress
                                                    ? "form-control text-area-resize-none error"
                                                    : "form-control text-area-resize-none"
                                            }
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label>{commonDictionary.postCode}</label>

                                        <InputText
                                            type="text"
                                            placeholder=""
                                            name="PostalCode"
                                            value={values.PostalCode}
                                            onKeyUp={(e) => this.onInputChange(e, "PostalCode", setFieldValue)}
                                            className={
                                                errors.PostalCode && touched.PostalCode
                                                    ? "form-control error"
                                                    : "form-control"
                                            }
                                        />
                                    </div>
                                    {/* <div className="col-12">
                                        <label className="select2Label">{commonDictionary.country}</label>
                                        <InputSelect2
                                            name="country"
                                            id="country"
                                            value={this.state.country}
                                            onChange={this.handleCountry}
                                            placeholder={""}
                                            options={this.state.countryOptions}
                                            isMulti={false}
                                        />
                                    </div> */}
                                    <div className="col-12">
                                        <label className="select2Label">{commonDictionary.city}</label>
                                        <InputSelect2
                                            name="Town"
                                            id="Town"
                                            value={this.state.city}
                                            placeholder={commonDictionary.selectCityAndEnter3Char}
                                            onChange={this.handleCity}
                                            options={this.state.showCityOptions ? this.state.cityOptions : []}
                                            isMulti={false}
                                            openMenuOnClick={false}
                                            isSearchable={true}
                                            onInputChange={(e) => this.handleCityWithSearchParams(e)}
                                            noOptionsMessage={() => this.state.charCount + " " + commonDictionary.enterChar}
                                        />
                                    </div>
                                    <div className="col-auto submitContainer">
                                        <button className="btn btn-brand" type="submit">{commonDictionary.save}</button>
                                    </div>
                                </Form>
                             
                            </div>

                        )}
                </Formik>
            </>
        )


    }
}

export default connect(initsStore)(Edit);