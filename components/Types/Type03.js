import React from 'react';

const Type03 = (props) => (

    <section className="type03">
        <div className="grid-wrapper">
            <div className="listContainer">
                {
                    props.modelList.map((item,index) => (
                        <a className="item" href={item.seo.url} key={"modelList"+index} >
                            <img src={item.image} alt={item.mainTitle} />
                            <span className="item-name">{item.mainTitle}</span>
                            <span className="item-desc">{item.subTitle}</span>
                        </a>
                    ))
                }

            </div>
        </div>
    </section>

);

export default Type03;
