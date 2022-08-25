import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../store';
import Head from 'next/head'
import { setSiteSettings } from '../../store/actions/setSiteSettings';
import Type01 from '../../components/Types/Type01';
import '../../styles/Components/Types/Types.scss';

class index extends Component {

    static async  getInitialProps({ ctx, store }) {

        const cstore = await store.getState()
        const lang = cstore.siteSettings.currPageLangSettings.lang
        let currentPage = cstore.umbracoContent.TR.brandsPageContent

        if (lang == "EN") {
            currentPage = cstore.umbracoContent.EN.brandsPageContent
        }
        else if (lang == "DE") {
            currentPage = cstore.umbracoContent.DE.brandsPageContent
        }
        await store.dispatch(setSiteSettings({ currentPage: currentPage }));

        return {}
    }

    render() {
    const { currentPage, commonDictionary } = this.props.getState().siteSettings;
       
        return (
            <>
                <Head>
                    <title>{}</title>
                </Head>
                <main id="brands" data-html-class="staticPages" data-body-class="staticPages">
                    <Type01 currentPage={currentPage}/>
                </main>
            </>
        )
    }
}

export default connect(initsStore)(index);