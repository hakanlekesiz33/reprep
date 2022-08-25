import React, { Component } from 'react';
import { Field } from 'formik';

class Input extends Component {

    render() {

        return (
            <Field
                type={this.props.type}
                placeholder={this.props.placeholder}
                name={this.props.name}
                disabled={this.props.disabled}
                id={this.props.id}
                value={this.props.value}
                onKeyUp={this.props.onKeyUp}
                onBlur={this.props.onBlur}
                className={this.props.className}
                autoComplete="new-password"
            />
        )
    }
}


export default Input;
