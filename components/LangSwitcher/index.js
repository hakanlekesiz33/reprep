import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import Router from 'next/router'

class LangSwitcher extends Component {

  setLang = (url, jsFile) => {
    const store = this.props.getState()
    const currLang = store.umbracoContent.siteMap.filter((page) => page.url == url)
    this.props.dispatch(setSiteSettings({ currPageLangSettings: currLang[0] }))

    Router.push(jsFile, url)
  };

  render() {
    const store = this.props.getState()
    return (
      <>
        {
          false &&
          <ul className="LangSwitcher">
            {
              <li key={"langSw0"}>
                {store.siteSettings.currPageLangSettings.lang}
              </li>
            }
            {
              store.siteSettings.currPageLangSettings.otherLanguages.map((item, index) => (
                <li key={"langSw" + index} onClick={() => this.setLang(item.url, item.jsFile)}>{item.lang}</li>
              ))
            }

          </ul>
        }
      </>
    )
  }
}

export default connect(initsStore)(LangSwitcher);

