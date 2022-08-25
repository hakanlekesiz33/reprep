import React from 'react';



const spinner = (props) => (

    props.show ?
        <img src={props.type == "grey" ? "../../../static/images/icons/circles-grey.svg" :
            props.type == "light" ? "../../../static/images/icons/circles-light.svg" :
                "../../../static/images/icons/circles-dark.svg"}
            alt="spinner" className="f-spinner" /> : null
);

export default spinner;