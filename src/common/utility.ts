import { IDisplayDate } from "../components/datepicker/Calendar";

export  function formatDateToDisplayString(date: Date){
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} | ${date.getHours()}:${date.getMinutes()}`;
}

export function getMonthText(month: number) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    if (month >= 0 && month < 12)
        return months[month];
    throw new Error('invalid month');
}

export function getCalendarDays(month: number, year: number): IDisplayDate[][] {

    const emptyDaysToDisplay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    function* dayGenerator(): IterableIterator<IDisplayDate> {
        for (var i = 0; i < emptyDaysToDisplay; i++) {
            yield {
                disabled: true
            };
        }

        var date = 1;
        while (date <= lastDate) {
            yield {
                date: date,
                actualDate: new Date(year, month, date)
            }
            date++;
        }
    }
    const iterator = dayGenerator();
    var weekIndex = 0;
    var dayIndex = 0;
    var result: IDisplayDate[][] = [];
    while (true) {
        const newDay = iterator.next();
        if (newDay.done) break;

        if (dayIndex == 7) {
            result.push([]);
            weekIndex++;
            dayIndex = 0;
        }
        if (dayIndex == 0) {
            result[weekIndex] = new Array();
        }
        result[weekIndex].push(newDay.value);
        dayIndex++;
    }

    while (dayIndex < 7) {
        result[weekIndex].push({ disabled: true });
        dayIndex++;
    }
    return result;
}