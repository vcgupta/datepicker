
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { datePicker, setFromDate, setToDate } from '../../redux/datePickerSlice';
import { useAppDispatch } from '../../redux/hooks';
import DateInput from './DateInput';
import PresetDateSelectors, { TimeGap } from './PresetDateSelectors';

import './DatePicker.css'
import Calendar from './Calendar';

export interface IDatePicker{
    fromDate?: Date;
    toDate?: Date;
}

export type DateFieldSelected = "From" | "To";
 

export default function DatePicker(props: IDatePicker){

    const {fromDate, toDate} = useSelector(datePicker);
    const dispatch = useAppDispatch();

    // const [fromDate, setFromDate] = useState<Date | null>(null);
    // const [toDate, setToDate] = useState<Date | null>(null);
    const [dateTypeSelected, setDateTypeSelected] = useState<DateFieldSelected | null>(null);

    //update states if props changes
    useEffect(()=>{
        props.fromDate && dispatch(setFromDate(props.fromDate));
    }, [props.fromDate, dispatch])

    useEffect(()=>{
        props.toDate && dispatch(setToDate(props.toDate));
    }, [props.toDate, dispatch])

    const onFromDateInputClicked = useCallback(()=>{
        setDateTypeSelected("From");
    },[])
    const onToDateInputClicked = useCallback(()=>{
        setDateTypeSelected("To");
    },[])
    const hideCalendar = useCallback(()=>{
        setDateTypeSelected(null);
    },[])


    return <div className='date-picker'>
        Datepicker by Vishnu
        <div className='row'>
           <div className='col'>
                <DateInput onClick={onFromDateInputClicked} label="From" date={fromDate} />
           </div>
           <div className='col'>
                <DateInput onClick={onToDateInputClicked}  label="To" date={toDate} />
           </div>
        </div>
        {dateTypeSelected && <div className={'row calendar' + (dateTypeSelected=="To"? " to":"")}>
            <Calendar type={dateTypeSelected} onHide={hideCalendar} />
        </div>}
        <div className='row preset-date'>
            <label>Show last</label>
            <PresetDateSelectors timeGap={TimeGap['6h']} />
            <PresetDateSelectors timeGap={TimeGap["24h"]} />
            <PresetDateSelectors timeGap={TimeGap["3d"]} />
            <PresetDateSelectors timeGap={TimeGap["1w"]} />
        </div>
    </div>

}