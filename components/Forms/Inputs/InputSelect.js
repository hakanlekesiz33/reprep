import React from 'react';
import { Field } from 'formik';

const InputSelect = (props) => (
    <Field
        component="select"
        name={props.name}
    >
        {props.options.map(option => (
            <option
                key={option.value}
                value={option.value}
            >
                {option.name}
            </option>
        ))}
    </Field>
);

export default InputSelect;