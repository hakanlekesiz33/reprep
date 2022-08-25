import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import { fetchModels } from '../../../store/actions/requestPageActions';
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as config from '../../../config';
import RadioButtonsGroup from '../Inputs/RadioButtonsGroup'
import InputSelect2 from '../Inputs/InputSelect2'
import axios from 'axios'
import FSubmitButton from '../../Requests/fSubmitButton';
import CssTransion from '../../UI/CssTransition';
import { getElementsOffsetHeight } from '../../../static/common.js';
import FBackButton from '../../Requests/fBackButton';
import { select2FocusInput } from '../../../static/common.js';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();
//marka seçimi

class RequestStep3Form extends Component {
  state = {
    brandId: '',
    brandName: '',
    brandImgSrc: '',
    modelId: '',
    isModelValid: '',
    modelIdOptions: [],
    brandOptions: [],
    goSummary: false
  };
  handleModelValue = modelId => {
    var element = document.querySelector(".css-1wa3eu0-placeholder")
    var element2 = document.querySelector(".css-1uccc91-singleValue")
    if (element) {
      element.style.display = "block"
    }
    if (element2) {
      element2.style.display = "block"
    }
    this.setState({ ...this.state, modelId: modelId, isModelValid: '' });
  };
  previousStep = (stayCurrentStep, step) => {
    const store = this.props.getState();
    if (stayCurrentStep) {
      let step3PageStatus = {
        ...store.siteSettings.step3PageStatus,
        insideOfStep: true,
        class: "move-down",
        translateYValue1: 0,
      }
      this.props.dispatch(setSiteSettings({ withGrandiant: "", step3PageStatus: step3PageStatus }));
    }
    else {
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
        let step3PageStatus = {
          class: "",
          insideOfStep: false,
          translateYValue1: 0,
        }
        localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
        this.props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step3PageStatus: step3PageStatus }));
      }, config.waitToNextComponent);
    }

  }
  async componentDidMount() {
    await this.props.dispatch(fetchModels()) //sayfa hazır olduktan sonra tüm markaların modelleri getiriyoruz
    const store = await this.props.getState();
    let brandId = ''
    let brandName = ''
    let brandImgSrc = ''
    let modelId = ''
    let brandOptions = []
    //radiobuttongrup ta kullanmak için markaları bir array altında topluyoruz
    // store.requestPageItems.modelList.filter(function (model) {
    //   return (
    //     //garantili ise sadece id'si 7 olanı seçecek değilse tüm markalar eklenecek
    //     store.siteSettings.userRequestSteps.requestStep2FormData.isGuarantee == "exist" ?
    //       model.ID === 7 : true
    //   )
    // })
    store.requestPageItems.modelList.map(function (m) {
      //radio button özellikler
      if (m.ID != 61) {
        brandOptions.push({
          name: 'brand',
          id: m.ID,
          label: m.BrandName,
          imgSrc: 'http://www.tfmlager.com/Files/BrandLogos/' + m.BrandLogo
        })
      }
    })


    //daha önceden seçilmiş model yada marka varsa forma ekliyoruz
    try {
      brandId = store.siteSettings.userRequestSteps.requestStep3FormData.brand.id;
      brandName = store.siteSettings.userRequestSteps.requestStep3FormData.brand.name;
      brandImgSrc = store.siteSettings.userRequestSteps.requestStep3FormData.brand.imgSrc;
    }
    catch (e) { }
    try {
      modelId = store.siteSettings.userRequestSteps.requestStep3FormData.model;
    }
    catch (e) { }

    //model seçeneklerini ekliyoruz
    const modelOptions = []
    store.requestPageItems.modelList.map(function (brand) {
      if (brand.ID == brandId) {
        brand.ModelList.map(function (m) {
          if (brand.ID == 8) {
            const x = m.ModelName.substring(0, 8)
            const y = x.includes("iPhone")
            const z = y ? m.ModelName.substring(7, 8) : ""
            if (z == "5" || z == "6" || z == "7" || z == "8") {
              modelOptions.push({
                value: m.ID,
                label: m.ModelName,
                deviceType: m.DeviceType,
                imgSrc: 'http://www.tfmlager.com/Files/ModelPictures/' + m._imageFile
              })
            }
          }
          else {
            modelOptions.push({
              value: m.ID,
              label: m.ModelName,
              deviceType: m.DeviceType,
              imgSrc: 'http://www.tfmlager.com/Files/ModelPictures/' + m._imageFile
            })
          }

        })
      }
    })

    this.setState({
      ...this.state,
      brandId: brandId,
      brandName: brandName,
      brandImgSrc: brandImgSrc,
      modelId: modelId,
      modelIdOptions: modelOptions,
      brandOptions: brandOptions
    });
    select2FocusInput();

  }

  goSummaryStep = (submitForm) => {
    this.setState({ ...this.state, goSummary: true })
    submitForm()
  }

  render() {
    const { brandId, brandName, brandImgSrc, modelId, modelIdOptions, brandOptions } = this.state;
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
    const modelOptions = []

    let initialValuesBrandId = '';
    try {
      initialValuesBrandId = store.siteSettings.userRequestSteps.requestStep3FormData.brand.id;
    }
    catch (e) { }


    return (
      <CssTransion>
        <>
          <div className="clickGrandiant" onClick={() => this.previousStep(true, "move-down")}></div>
          <div className={"citem-01 " + store.siteSettings.step3PageStatus.class}>

            <Formik
              initialValues={{
                brand: initialValuesBrandId
              }}
              validationSchema={Yup.object().shape({
                brand: Yup.string().required(commonDictionary.requiredField)
              })}
              onSubmit={values => {
                //marka seçildikten sonra modelleri cascade ediyoruz

                store.requestPageItems.modelList.map(function (brand) {
                  if (brand.ID == values.brand) {
                    brand.ModelList.map(function (m) {
                      if (brand.ID == 8) {
                        const x = m.ModelName.substring(0, 8)
                        const y = x.includes("iPhone")
                        const z = y ? m.ModelName.substring(7, 8) : ""
                        if (z == "5" || z == "6" || z == "7" || z == "8") {
                          modelOptions.push({
                            value: m.ID,
                            label: m.ModelName,
                            deviceType: m.DeviceType,
                            imgSrc: 'http://www.tfmlager.com/Files/ModelPictures/' + m._imageFile
                          })
                        }
                      }
                      else {

                        modelOptions.push({
                          value: m.ID,
                          label: m.ModelName,
                          deviceType: m.DeviceType,
                          imgSrc: 'http://www.tfmlager.com/Files/ModelPictures/' + m._imageFile
                        })
                      }
                    })
                  }
                })
                //sağ colonda marka görsel ve adını göstermek için gerekli değerleri topluyoruz
                let newBrandName = '';
                let newBrandImgSrc = '';
                brandOptions.map(function (m) {
                  if (m.id == values.brand) {
                    newBrandName = m.label;
                    newBrandImgSrc = m.imgSrc;
                  }
                })

                //marka seçildiği için model e active classı ekliyoruz
                let translateYValue1 = getElementsOffsetHeight("citem-01", "translateY-animation")
                translateYValue1 = -(translateYValue1 + config.translateYTopValue) - 1
                let step3PageStatus = {
                  class: "active move-up",
                  insideOfStep: true,
                  translateYValue1: translateYValue1
                }

                this.props.dispatch(setSiteSettings({ withGrandiant: "withGrandiant", step3PageStatus: step3PageStatus }));

                this.setState({
                  ...this.state,
                  modelIdOptions: modelOptions,
                  brandId: values.brand,
                  brandName: newBrandName,
                  brandImgSrc: newBrandImgSrc
                });

                //kullanıcınun daha önce dolduruduğu form var ise onu elimize alıyoruz
                let beforeUserRequestSteps = null;
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }
                //seçilen marka bir önceki marka ile aynı değilse seçilmiş modeli de siliyoruz
                let beforeBrand = ''

                try {
                  beforeBrand = beforeUserRequestSteps.requestStep3FormData.brand.id;
                }
                catch (e) { }

                if (beforeBrand != values.brand) {
                  this.handleModelValue('')
                }

                const beforeStep3Data = beforeUserRequestSteps != null && beforeBrand == values.brand ? beforeUserRequestSteps.requestStep3FormData : null

                const requestStep3FormData = {
                  ...beforeStep3Data,
                  brand: { id: values.brand, name: newBrandName, imgSrc: newBrandImgSrc }
                }
                let userRequestSteps = {}
                if (beforeBrand == values.brand) {
                  userRequestSteps = {
                    ...beforeUserRequestSteps,
                    comeFrom: store.siteSettings.userRequestSteps.comeFrom,
                    expireDate: new Date().getTime(),
                    requestStep3FormData
                  }
                }
                else {
                  userRequestSteps = {
                    ...beforeUserRequestSteps,
                    expireDate: new Date().getTime(),
                    comeFrom: store.siteSettings.userRequestSteps.comeFrom,
                    requestStep3FormData,
                    requestStep4FormData: null, //symptoms bilgileri varsa temizleniyor
                    requestStep11FormData: null //additional info bilgileri varsa temizleniyor
                  }
                }


                //localStorage'a kayıt edildi
                localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));

                //redux'a kayıt edildi
                this.props.dispatch(setSiteSettings({ userRequestSteps: userRequestSteps }));

              }}

            >
              {({ errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched }) => (
                  <Form encType="multipart/form-data" className="requestStep3 f-answer">

                    <div className="grid-wrapper">

                      <div className="f-question-A pr-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step3PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        {
                          // (store.siteSettings.userRequestSteps.requestStep2FormData.isGuarantee == "exist" ?
                          //   currentPage.requestStep3.question1 : currentPage.requestStep3.question2)
                          htmlToReactParser.parse(currentPage.requestStep3.question2)
                        }
                      </div>
                      <div className="f-answer-group-A translateY-animation"
                        style={{
                          transform: "translateY(" + store.siteSettings.step3PageStatus.translateYValue1 + "px)"
                        }}
                      >
                        <RadioButtonsGroup
                          id="brand"
                          label=""
                          value={values.brand}
                          error={errors.brand}
                          touched={touched.brand}
                          radioButtons={brandOptions}
                          className={
                            errors.brand && touched.brand
                              ? "rb-A ff-A error"
                              : "rb-A ff-A"
                          }
                        />
                      </div>
                      {

                        values.brand == 8 &&
                        <div className="">
                          <div className="f-info-area pr-B">
                            {commonDictionary.appleInfo}

                          </div>
                        </div>

                      }

                      <FBackButton click={() => this.previousStep(false, "requestStep1")} goBack={commonDictionary.goBack} />

                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />

                    </div>
                  </Form>
                )}
            </Formik>

          </div>
          <div className={"citem-02 " + store.siteSettings.step3PageStatus.class}>
            <Formik
              initialValues={null}
              validationSchema={null}
              onSubmit={values => {
                const { goSummary } = this.state
                if (modelId == "") {
                  this.setState({ ...this.state, isModelValid: 'error' })
                  return;
                }
                //şuanki formun objesi
                const requestStep3FormData = {
                  brand: { id: brandId, name: brandName, imgSrc: brandImgSrc },
                  model: modelId
                }

                //umbracodaki sıralamaya göre kendinden sonraki stepi buluyor
                const requestSteps = currentPage.requestSteps
                let nextStep = "requestStep3";
                for (let i = 0; i < requestSteps.length - 1; i++) {
                  if (requestSteps[i].contentTypeAlias == "requestStep3") {
                    nextStep = requestSteps[i + 1].contentTypeAlias
                  }
                }
              nextStep = goSummary ? "requestSummaryStep" : nextStep
              let beforeUserRequestSteps = null;
                //kullanıcınun doldurduğu formlar bu objede tutuluyor 
                if (localStorage.getItem('userRequestSteps') != null) {
                  beforeUserRequestSteps = JSON.parse(localStorage.getItem('userRequestSteps'));
                }
                const _props = this.props

                axios.get(config.getModelPrices + '?modelId=1889')
                  .then(function (res) {
                    const userRequestSteps = {
                      ...beforeUserRequestSteps,
                      expireDate: new Date().getTime(),
                      comeFrom: 'default',
                      currentRequestStep: nextStep,
                      requestStep3FormData,
                      modelPrices: (res.data.modelPrices != "" ? JSON.parse(res.data.modelPrices) : ""),
                      requestStep4FormData: null, //symptoms bilgileri varsa temizleniyor
                      requestStep11FormData: null //additional info bilgileri varsa temizleniyor
                    }
                    if (document.getElementsByClassName("componentAnimation").length > 0) {
                      document.getElementsByClassName("componentAnimation")[0].classList.add("component-exit")
                    }
                    setTimeout(() => {
                      if (document.getElementsByClassName("componentAnimation").length > 0) {
                        document.getElementsByClassName("componentAnimation")[0].classList.remove("component-exit")
                      }
                      let step3PageStatus = {
                        class: "",
                        insideOfStep: false,
                        translateYValue1: 0
                      }

                      localStorage.setItem('userRequestSteps', JSON.stringify(userRequestSteps));
                      _props.dispatch(setSiteSettings({ withGrandiant: "", userRequestSteps: userRequestSteps, step3PageStatus: step3PageStatus }));
                    }, config.waitToNextComponent);


                  })

              }}
            >
               {(formikProps) => {
              const { errors, touched, values, handleSubmit, setFieldValue,
                setFieldTouched } = formikProps;
              return (
                  <Form encType="multipart/form-data" className="requestStep3 f-answer">

                    <div className="grid-wrapper">

                      <div className="f-question-A pr-A translateY-animation">
                        {
                          htmlToReactParser.parse(currentPage.requestStep3.question3)
                        }
                      </div>
                      <div className={"f-answer-group-A translateY-animation " + this.state.isModelValid}>
                        <InputSelect2
                          name="modelId"
                          value={modelId}
                          onChange={this.handleModelValue}
                          placeholder={commonDictionary.selectModel}
                          options={modelIdOptions}
                          isMulti={false}
                          isDisabled={false}
                          noOptionsMessage={() => commonDictionary.noOptionsMessage}
                        />
                      </div>
                      <FBackButton click={() => this.previousStep(true, "requestStep3")} goBack={commonDictionary.goBack} />

                      <FSubmitButton pressEnter={commonDictionary.pressEnter} goOn={commonDictionary.goOn} />
                      {
                      store.siteSettings.userRequestSteps.comeFrom == "summary" &&
                      <FBackButton click={() => this.goSummaryStep(formikProps.submitForm)}
                        goBack={commonDictionary.complete} classes="summary" />

                    }
                    </div>
                  </Form>
                )
              }}
            </Formik>

          </div>
        </>
      </CssTransion>
    )
  }
}

export default connect(initsStore)(RequestStep3Form);