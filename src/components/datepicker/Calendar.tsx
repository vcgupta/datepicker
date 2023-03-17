import { useCallback, useEffect, useRef, useState } from "react";
import { DateFieldSelected } from "./DatePicker";
import './Calendar.css';
import { datePicker, setFromDate, setToDate } from '../../redux/datePickerSlice';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaClock, FaCalendar } from 'react-icons/fa';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { getMonthText, getCalendarDays } from '../../common/utility';

export interface ICalendarProps {
    type: DateFieldSelected;
    onHide? : () => void
}

export interface IDisplayDate {
    date?: number;
    isCurrentDate?: boolean;
    isHighlighted?: boolean;
    isHovered?: boolean;
    disabled?: boolean;
    actualDate?: Date;
}


export default function Calendar(props: ICalendarProps) {
    const { fromDate, toDate } = useSelector(datePicker);
    const [currentDate, setCurrentDate] = useState(props.type == "From" ? fromDate : toDate);
    const [currentMonth, setCurrentMonth] = useState<number>(currentDate?.getMonth() || new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate?.getFullYear() || new Date().getFullYear());
    const [currentHour, setCurrentHour] = useState<number>(currentDate?.getHours() || new Date().getHours());
    const [currentMinutes, setCurrentMinutes] = useState<number>(currentDate?.getMinutes() || new Date().getMinutes());
    const [mouseOverDate, setMouseOverDate] = useState<IDisplayDate | undefined>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        setCurrentDate(value => (props.type == "From" ? fromDate : toDate))
    }, [props.type])

    useEffect(()=>{
        if(!currentDate) return;
        //Save hours async to avoid quicks update
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentHour, currentMinutes);
        props.type == "From" ? dispatch(setFromDate(newDate)) : dispatch(setToDate(newDate));
 
    }, [currentHour, currentMinutes, props.type, currentDate, dispatch])

    const incrementCurrentMonth = useCallback(() => {
        if (currentMonth < 11) {
            setCurrentMonth(currentMonth + 1);
        } else {
            setCurrentMonth(0);
            setCurrentYear(year => year + 1);
        }
    }, [currentMonth])

    const decrementCurrentMonth = useCallback(() => {
        if (currentMonth > 0) {
            setCurrentMonth(currentMonth - 1);
        } else {
            setCurrentMonth(11);
            setCurrentYear(year => year - 1);
        }
    }, [currentMonth])

    const [calDays, setCalDays] = useState<IDisplayDate[][]>([]);

    useEffect(() => {
        // Fill the calendar into grid for displaying
        const result = getCalendarDays(currentMonth, currentYear)
        setCalDays(result);
    }, [currentYear, currentMonth]);

    useEffect(() => {
        if (!fromDate) return;
        // If from date is in current grid, set its color
        const fromDateMonth = fromDate.getMonth();
        const fromDateYear = fromDate.getFullYear();
        const fdate = fromDate.getDate();
        const tdate = fromDate.getDate();
        const fromDateWithoutTime = new Date(fromDateYear, fromDateMonth, fdate);
        const toDateWithoutTime = toDate ? new Date(toDate?.getFullYear(), toDate?.getMonth(), toDate?.getDate()) : null;
        const mouseOverDateWithoutTime = mouseOverDate && mouseOverDate.actualDate ? new Date(mouseOverDate.actualDate.getFullYear(), mouseOverDate.actualDate.getMonth(), mouseOverDate.actualDate.getDate()) : null;
        console.log(fromDateWithoutTime, toDateWithoutTime, mouseOverDateWithoutTime);
        setCalDays(calDays => calDays.map(week => {
            return week.map(day => {
                day.isHighlighted = false;
                day.isCurrentDate = false;
                day.isHovered = false;
                if (!day.disabled && day.actualDate && (!(day.actualDate < fromDateWithoutTime) && !(day.actualDate > fromDateWithoutTime))) {
                    day.isCurrentDate = true;
                    day.isHighlighted = true;
                }
                if (!day.disabled && day.actualDate && toDateWithoutTime && day.actualDate >= fromDateWithoutTime && day.actualDate <= toDateWithoutTime) {
                    day.isCurrentDate = true;
                    day.isHighlighted = true;
                }
                if (!day.disabled && day.actualDate && mouseOverDateWithoutTime && day.actualDate >= fromDateWithoutTime && day.actualDate <= mouseOverDateWithoutTime) {
                    day.isHovered = true;
                }
                return { ...day }
            });
        }))

    }, [fromDate, toDate, mouseOverDate, currentYear, currentMonth]);

    const onClickDateSelection = useCallback((date: IDisplayDate) => {
        if (!date.actualDate) return;
        const selectedDate = new Date(date.actualDate.getFullYear(), date.actualDate.getMonth(), date.actualDate.getDate(), currentHour, currentMinutes);
        props.type == "From" ? dispatch(setFromDate(selectedDate)) : dispatch(setToDate(selectedDate));

    }, [props.type, dispatch])

    // Close calendar if clicking outside
    const rootRef = useRef<HTMLDivElement>(null);
    
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as any)) {
        props.onHide&& props.onHide();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [ props.type, dispatch, props.onHide ]);

    return (
        <div className="calendar-root" ref={rootRef}>
            <div className="box">
                <div className="row month">
                    <span className="left"></span>
                    <div className="center">
                        <span className="clickable" onClick={() => setCurrentYear(val => val - 1)}><FaAngleDoubleLeft /></span>
                        <span className="clickable" onClick={decrementCurrentMonth}><FaAngleLeft /></span>
                        <span>{getMonthText(currentMonth)}&nbsp;{currentYear}</span>
                        <span className="clickable" onClick={incrementCurrentMonth}><FaAngleRight /></span>
                        <span className="clickable" onClick={() => setCurrentYear(val => val + 1)}><FaAngleDoubleRight /></span>
                    </div>
                    <span className="right"><FaCalendar /></span>
                </div>
                <div className="row week-names">
                    <div className="cell">Su</div>
                    <div className="cell">Mo</div>
                    <div className="cell">Tu</div>
                    <div className="cell">We</div>
                    <div className="cell">Th</div>
                    <div className="cell">Fr</div>
                    <div className="cell">Sa</div>
                </div>
                {calDays?.map((weekArray, weekIndex) => {
                    return (<div className="row week-days"
                        onMouseLeave={() => setMouseOverDate(undefined)}>
                        {
                            weekArray.map((weekDay, dayIndex) => {
                                return <div key={`weekday_${weekIndex}_${dayIndex}`}
                                    onClick={() => onClickDateSelection(weekDay)}
                                    onMouseOver={() => setMouseOverDate(weekDay)}
                                    className={"cell " + (weekDay.isCurrentDate ? "current-date " : "") +
                                        (weekDay.isHighlighted ? "highlighted " : "") +
                                        (weekDay.isHovered ? "hovered " : "") +
                                        (weekDay.disabled ? "disabled  " : "")}>
                                    {weekDay.date || ""}
                                </div>
                            })
                        }
                    </div>)
                })}

                <div className="row hours">
                    <div className="fields">
                        <span><FaClock /></span>
                        <input type="number" min="0" max="23" name="hour" placeholder="hh" onChange={(e) => setCurrentHour(Number(e.target.value))} value={currentHour} />
                        <input type="number" min="0" max="59" name="minutes" placeholder="mm" onChange={(e) => setCurrentMinutes(Number(e.target.value))} value={currentMinutes} />
                    </div>
                </div>
            </div>
        </div>
    )

}