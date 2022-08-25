import React, { Component } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import { connect } from 'react-redux';
import initsStore from '../../store';
import LangSwitcher from '../LangSwitcher';
import { hideModal, overlayclick } from '../../static/common.js';

class Layout extends Component {

  render() {
    const store = this.props.getState();

    return (
      <>
        <div id="page-wrapper">
          <div id="content-wrapper" className={store.siteSettings.withGrandiant}>
            <Header />

            {this.props.children}

            <Footer />

            <div id="modal-wrapper" href="#" onClick={() => hideModal(true)}>
              <div className="f-content">
                <div className="f-header">
                  <a href="#" onClick={() => hideModal(false)} className="f-close"></a>
                </div>
                <div className="f-body"></div>
                <div className="f-footer">
                  <a href="#" className="f-submit"></a>
                </div>
              </div>
            </div>
            <div id="overlay-wrapper" onClick={() => overlayclick()}></div>
          </div>
        </div>
        {
          store.siteSettings.showLayer &&
          <div className="f-layer">
          </div>
        }

      </>
    )
  }
}

export default connect(initsStore)(Layout);
