import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    let cStore = await ctx.store.getState();
    return { ...initialProps, ctx };
  }


  render() {
    return (

      <html lang="en">
        <Head>
          <script dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-5K4QCS4');`,
          }}>
          </script>
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="mq-values">
            <div id="mq-xs1"></div>
            <div id="mq-xs2"></div>
            <div id="mq-sm1"></div>
            <div id="mq-sm2"></div>
            <div id="mq-md"></div>
            <div id="mq-lg"></div>
          </div>
        </body>
      </html>
    );
  }
}
