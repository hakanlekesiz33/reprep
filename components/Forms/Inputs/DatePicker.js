import React from 'react';
import { Field } from 'formik';
import DatePicker, { registerLocale } from "react-datepicker";
import de from 'date-fns/locale/de';
registerLocale('de', de)
import  '../../../styles/react-datepicker.scss';

const DatePickerField = ({ id, name, value, selected, onFocus, onBlur, onChange, showMonthDropdown, showYearDropdown }) => {
    return (
        <DatePicker
            locale="de"
            maxDate={new Date()}
            selected={selected}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            id={id}
            showMonthDropdown={showMonthDropdown}
            showYearDropdown={showYearDropdown}
          
        />
    );
};

const datePicker = (props) => (
    <DatePickerField
        id={props.id}
        name={props.name}
        value={props.value}
        selected={props.selected}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        className={props.className}
        showMonthDropdown={props.showMonthDropdown}
        showYearDropdown={props.showYearDropdown}
    />
);



export default datePicker;