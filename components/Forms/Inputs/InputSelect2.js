import React, { Component } from 'react';
import Select from 'react-select';

class InputSelect2 extends Component {

    render() {
        return (
            <Select
            key={this.props.name}
            name={this.props.name}
            value={this.props.value}            
            placeholder={this.props.placeholder}
            onChange={this.props.onChange}
            options={this.props.options}
            isMulti={this.props.isMulti}
            isDisabled={this.props.isDisabled}
            openMenuOnClick={this.props.openMenuOnClick}
            isSearchable={this.props.isSearchable}
            onInputChange={this.props.onInputChange}
            noOptionsMessage={this.props.noOptionsMessage}
            maxMenuHeight={150}
          />
        )
    }
}

export default InputSelect2;
