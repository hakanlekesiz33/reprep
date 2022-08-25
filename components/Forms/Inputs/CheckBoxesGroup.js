import React from 'react';
import { Field } from 'formik';
var HtmlToReactParser = require('html-to-react').Parser;
var htmlToReactParser = new HtmlToReactParser();

// Checkbox input
const Checkbox = ({
    field: { name, value, onChange, onBlur },
    form: { errors, touched, setFieldValue },
    id,
    label,
    className,
    ...props
}) => {
    return (
        <div className="checkBoxContainer">
            <input
                name={name}
                id={id}
                type="checkbox"
                value={value}
                checked={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            <label htmlFor={id} className={className}>{htmlToReactParser.parse(label)}</label>
            {touched[name] && <InputFeedback error={errors[name]} />}
        </div>
    );
};

const InputFeedback = ({ error }) =>
    error ? <div >{error}</div> : null;


class CheckboxGroup extends React.Component {
    constructor(props) {
        super(props);
    }

    handleChange = event => {
        const target = event.currentTarget;
        let valueArray = [...this.props.value] || [];

        if (valueArray.includes(target.id)) {
            target.checked = false;
        }
        if (target.checked) {
            valueArray.push(target.id);
        } else {
            valueArray.splice(valueArray.indexOf(target.id), 1);
        }

        this.props.onChange(this.props.id, valueArray);
    };

    handleBlur = () => {
        // take care of touched
        this.props.onBlur(this.props.id, true);
    };

    render() {
        const { value, error, touched, children, className } = this.props;
        return (
            <div className={className}>
                {React.Children.map(children, child => {
                    return React.cloneElement(child, {
                        field: {
                            value: value.includes[child.props.id],
                            onChange: this.handleChange,
                            onBlur: this.handleBlur
                        }
                    });
                })}
                {touched && <InputFeedback error={error} />}
            </div>

        );
    }
}




const CheckBoxesGroup = (props) => (
    <CheckboxGroup
    id={props.id}
    label={props.label}
    value={props.value}
    error={props.error}
    touched={props.touched}
    onChange={props.onChange}
    onBlur={props.onBlur}
    className={props.className}
    >
        {props.checkBoxes.map(chk => (
           
            <Field
            key={chk.id}
                component={Checkbox}
                name={chk.name}
                id={chk.id}
                label={chk.label}
                className={(props.value.includes(chk.id) ? "active ff-D" : "")}
            />
        ))}


    </CheckboxGroup>

);

export default CheckBoxesGroup;
