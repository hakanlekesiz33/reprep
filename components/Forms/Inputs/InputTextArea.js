import React from 'react';
import { Field } from 'formik';

const InputTextArea = (props) => (
    <Field
        key={props.id}
        component="textarea"
        name={props.name}
        id={props.id}
        className={props.className}
        rows={props.rows}
        onKeyUp={props.onKeyUp}
        placeholder={props.placeholder}
    >
    </Field>
);

export default InputTextArea;