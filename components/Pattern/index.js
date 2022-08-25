import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import PatternLock from 'patternlock';
import { setSiteSettings } from '../../store/actions/setSiteSettings';

class Pattern extends Component {
  state = {
    path: []
  };
  componentDidMount() {
    const _props=this.props;
    var lock = new PatternLock('#patternHolder', {
      onDraw: function (val) {
        let pattern = val.toString()
        _props.dispatch(setSiteSettings({ pattern}));
      }
    });
  }
  render() {
    const store = this.props.getState();
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
    return (
      <>
        <div className='pattern'>
          <div className='patternTitle pr-A'>
            {
              currentPage.requestStep10.question3
            }
          </div>
          <div id="patternHolder" className="pattern-holder"></div>

          <button className='patternButton ff-B' onClick={this.props.clicked}>
            {commonDictionary.savePattern}
          </button>

        </div>

      </>
    )
  }
}

export default connect(initsStore)(Pattern);
