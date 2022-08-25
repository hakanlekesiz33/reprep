import React from 'react';

const FSubmitButton = (props) => (
    <div className={"f-submit-group-A "+props.classes}>
        <button type="submit" className="btn-submit btn-01 ff-B">
            {props.goOn}
        </button>
        {/* <span className="enterText ff-C">
            {props.pressEnter}
        </span> */}
    </div>
);

export default FSubmitButton;