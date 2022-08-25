import React from 'react';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

const Type01 = (props) => (

    <section className="type01">
        <div className="grid-wrapper">
            <h3 className="title">{props.currentPage.mainTitle}</h3>
            <h4 className="sub-title">{props.currentPage.subTitle}</h4>
            <div className="desc">
                {htmlToReactParser.parse(props.currentPage.desc)}
            </div>
            <div className="listContainer">
                {
                    props.currentPage.brandList.map((item, index) => (
                        <a className="item" href={item.seo.url} key={"brandlist"+index}>
                            <img src={item.image} alt={item.mainTitle}></img>
                            <span className="item-name">{item.mainTitle}</span>
                            <span className="item-desc">{item.subTitle}</span>
                        </a>
                    ))
                }


            </div>
        </div>
    </section>

);

export default Type01;
