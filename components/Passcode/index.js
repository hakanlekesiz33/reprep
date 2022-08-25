import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import { refreshToolTips } from '../../static/common';

class Passcode extends Component {
  state = {
    passcodeValues: []
  }
  addValue = (value) => {
    let passcodeValues = this.state.passcodeValues
    if(passcodeValues.length < 6){
      passcodeValues.push(value)
      this.setState({ ...this.state, passcodeValues: passcodeValues })
    }
    
    
  }
  removeValue = () => {
    let passcodeValues = this.state.passcodeValues
    if (passcodeValues.length > 0) {
      passcodeValues.pop() //delete last item from array
    }
    this.setState({ ...this.state, passcodeValues: passcodeValues })
  }
  submitValue = () => {
    this.props.dispatch(setSiteSettings({ passcode: this.state.passcodeValues }));
    this.props.clicked()
  }
  componentDidMount() {
    let passcodeValues = []
    try {
      if (this.props.getState().siteSettings.userRequestSteps.requestStep10FormData.passCode) {
        passcodeValues = this.props.getState().siteSettings.userRequestSteps.requestStep10FormData.passCode
      }
    }
    catch (e) {
      passcodeValues = []
    }

    this.setState({ ...this.state, passcodeValues: passcodeValues })
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = store.siteSettings;
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    return (
      <>
        <div className='passcode'>
          <div className='passcodeTitle pr-A'>
            {
              currentPage.requestStep10.question4
            }
          </div>
          <div className="passcodeValues">
            <ul className="ff-G">
              {this.state.passcodeValues.map((value, index) => {
                return <li key={"passcodeValues" + index}>*</li>
              })}
            </ul>
          </div>

          <div className="passcode-holder">

            <ul className="ff-G">
              {numbers.map((value, index) => {
                return <li onClick={() => this.addValue(value)} key={"passcode" + index}>{value}</li>
              })}
              <li key={"passcodelast"}>
                <img src='../../static/images/icons/icon-backspace.png' onClick={() => this.removeValue()}></img>
              </li>
            </ul>

          </div>

          <button className='passcodeButton ff-B' onClick={() => this.submitValue()}>
            {commonDictionary.savePasscode}
          </button>

        </div>
      </>
    )
  }
}

export default connect(initsStore)(Passcode);
