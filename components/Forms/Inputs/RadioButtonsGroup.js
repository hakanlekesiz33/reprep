import React from 'react';
import { Field } from 'formik';

const InputFeedback = ({ error }) =>
    error ? <div >{error}</div> : null;

// Radio input
const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    onSelect,
    ...props
}) => {
    return (
        <div className="radioContainer">
            <input
                name={name}
                id={id}
                type="radio"
                value={id} // could be something else for output?
                checked={id === value}
                onChange={onChange}
                onBlur={onBlur}
                onClick={onSelect}
                {...props}
            />
            <label htmlFor={id} className={className}>{label}</label>
        </div>
    );
};

// Radio group
const RadioButtonGroup = ({
    value,
    error,
    touched,
    id,
    label,
    children,
    className
}) => {


    return (
        <div className={className}>
            {children}
            {touched && <InputFeedback error={error} />}
        </div>
    );
};



const RadioButtonsGroup = (props) => (
    <RadioButtonGroup
        id={props.id}
        label={props.label}
        value={props.value}
        error={props.error}
        className={props.className}
        onChange={props.onChange}

    >
        {props.radioButtons.map(radioButton => (
            <Field
                key={radioButton.id}
                component={RadioButton}
                name={radioButton.name}
                id={radioButton.id}
                label={radioButton.label} 
                onSelect={radioButton.onSelect}
                className={(radioButton.id == props.value ? "active ff-D" : "")}
            />
        ))}


    </RadioButtonGroup>

);

export default RadioButtonsGroup;