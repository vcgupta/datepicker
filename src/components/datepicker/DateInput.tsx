import { useCallback, useEffect, useId } from "react";
import { formatDateToDisplayString } from "../../common/utility";

import './DateInput.css';

export interface IDateInput {
    date: Date | null;
    label: string;
    onClick(): void
}


function DateInput(props: IDateInput) {
    const uniqueId = useId();

    const calendarInputOnClick = useCallback(() => {
        props.onClick();
    }, [props.onClick])

    return (<label htmlFor={uniqueId} className="date-input">
        <div>{props.label}</div>
        <input name={uniqueId} type="text" readOnly onClick={calendarInputOnClick} value={props.date ? formatDateToDisplayString(props.date) : ""} />
    </label>);
}

export default DateInput;