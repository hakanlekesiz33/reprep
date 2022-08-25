import React, { Component } from 'react';
import { connect } from 'react-redux';
import initsStore from '../../../../store'
import Head from 'next/head'

class index extends Component {

    static async  getInitialProps({ ctx, store }) {

        return {}
    }

    render() {
       
        return (
            <>
                <Head>
                    <title>{}</title>
                </Head>
                <main id="brands" data-html-class="staticPages" data-body-class="staticPages">
                   
                </main>
            </>
        )
    }
}

export default connect(initsStore)(index);