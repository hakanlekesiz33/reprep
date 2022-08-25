import React from 'react';

const FBackButton = (props) => (
    <div className={"f-submit-group-B " + props.classes}>
        <a href="#" onClick={props.click} className="btn-submit btn-01 ff-F">{props.goBack}
            {
                props.classes == "fromSummary" &&
                <div className="backIcon"> </div>
            }
        </a>
    </div>
);

export default FBackButton;