import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../store';
import Head from 'next/head'
import { setSiteSettings } from '../../../store/actions/setSiteSettings';
import '../../../styles/Components/Types/Types.scss';
import Type02 from '../../../components/Types/Type02'
import Type03 from '../../../components/Types/Type03';
class index extends Component {

    static async  getInitialProps({ ctx, store }) {

        const cstore = await store.getState()
        const lang = cstore.siteSettings.currPageLangSettings.lang
        const currUrl = cstore.siteSettings.currPageLangSettings.url

        let currentPage = cstore.umbracoContent.TR.brandsPageContent.brandList.filter((page) => page.seo.url == currUrl)

        if (lang == "EN") {
            currentPage = cstore.umbracoContent.EN.brandsPageContent.brandList.filter((page) => page.seo.url == currUrl)
        }
        else if (lang == "DE") {
            currentPage = cstore.umbracoContent.DE.brandsPageContent.brandList.filter((page) => page.seo.url == currUrl)
        }
        await store.dispatch(setSiteSettings({ currentPage: currentPage[0] }));

        return {}
    }

    render() {
        const _this = this
        const store = this.props.getState();
        const { currentPage, commonDictionary, currPageLangSettings } = store.siteSettings;
        const requestPageUrl = (store.umbracoContent.siteMap.filter((link) => link.jsFile == "/request").filter((link) => link.lang == currPageLangSettings.lang))[0].url
    
       
        return (
            <>
                <Head>
                    <title>{}</title>
                </Head>
                <main id="brand" data-html-class="staticPages" data-body-class="staticPages">
                   <Type02 currentPage={currentPage} commonDictionary={commonDictionary} requestPageUrl={requestPageUrl}/>
                   <Type03 modelList={currentPage.modelList}/>
                </main>
            </>
        )
    }
}

export default connect(initsStore)(index);