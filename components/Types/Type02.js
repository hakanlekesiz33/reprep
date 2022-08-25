
import React from 'react';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

const Type02 = (props) => (

    <section className="type02">
        <div className="showCaseImage"
            style={{
                backgroundImage: "url(" + props.currentPage.showcaseImage + ")"
            }}>
        </div>
        <div className="grid-wrapper">
            <div className="cbox01A">
                <div className="citem01">
                    <img src={props.currentPage.image} alt={props.currentPage.mainTitle} />
                </div>
                <h1 className="citem02 hdr-E">
                    {props.currentPage.mainTitle}
                </h1>

                <a className="citem03 ff-H" href={props.requestPageUrl}>
                    {props.commonDictionary.createRequestForm}
                </a>
            </div>
            <div className="cbox01B">
                <h2 className="citem01 hdr-F">
                    {props.currentPage.subTitle}
                </h2>
                <div className="citem02">
                    {htmlToReactParser.parse(props.currentPage.desc)}
                </div>
            </div>
        </div>
    </section>

);

export default Type02;