import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';

class RequestStepStatusBar extends Component {
    state = {
        strokeDashoffset: 0,
        strokeDasharray: 0,
    }
    componentDidMount() {
        this.setState({ ...this.state, strokeDasharray: document.getElementById("svgPath").getTotalLength() })
    }
    render() {
        const store = this.props.getState();
        const { commonDictionary } = this.props.getState().siteSettings;

        const currentRequestStep = store.siteSettings.userRequestSteps.currentRequestStep;
        const stepsCount = store.umbracoContent.TR.requestPageContent.requestSteps.length;
        let currentRequestIndex = 0;
        const requestSteps = store.umbracoContent.TR.requestPageContent.requestSteps
        for (let i = 0; i < stepsCount; i++) {
            if (requestSteps[i].contentTypeAlias == currentRequestStep) {
                currentRequestIndex = i;
            }
        }
        let strokeDashoffset = this.state.strokeDasharray

        const percentage = parseInt((currentRequestIndex * 100) / stepsCount)
        //summary de yüzde 0 geliyor ayarlanacak
        strokeDashoffset = this.state.strokeDasharray - (parseInt((this.state.strokeDasharray * percentage) / 100))

        return (
            <>

                <div className="statusBar">
                    {
                         currentRequestStep != "requestStep1" &&
                        <div className="citem01 ff-M">
                            {
                                "%" + parseInt((currentRequestIndex * 100) / stepsCount)
                            }
                        </div>

                    }
                    {
                        currentRequestStep != "requestStep1" &&
                        <svg className="citem02">
                            <path d="M25.5,3 C13.0735931,3 3,13.0735931 3,25.5 C3,37.9264069 13.0735931,48 25.5,48 C37.9264069,48 48,37.9264069 48,25.5 C48,13.0735931 37.9264069,3 25.5,3 Z"
                                id="svgPath0" stroke="#e7e7e7" strokeWidth="3" fill="none"
                            />
                            <path d="M25.5,3 C13.0735931,3 3,13.0735931 3,25.5 C3,37.9264069 13.0735931,48 25.5,48 C37.9264069,48 48,37.9264069 48,25.5 C48,13.0735931 37.9264069,3 25.5,3 Z"
                                id="svgPath" stroke="#44d7b6" strokeWidth="3" fill="none"
                                style={{
                                    strokeDashoffset: this.state.strokeDasharray + (this.state.strokeDasharray - strokeDashoffset),
                                    strokeDasharray: this.state.strokeDasharray
                                }}
                            />

                        </svg>

                    }

                </div>

            </>
        )
    }
}

export default connect(initsStore)(RequestStepStatusBar);