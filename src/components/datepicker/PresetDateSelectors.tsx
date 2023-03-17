import { useCallback } from "react";
import { presetDate } from "../../redux/datePickerSlice";
import { useAppDispatch } from "../../redux/hooks";

interface IPresetDateSelectorsProps {
    timeGap: TimeGap
}

export enum TimeGap {
    "6h", "24h", "3d", "1w"
}

function buttonText(value: TimeGap) {
    switch (value) {
        case TimeGap["1w"]:
            return "1w";

        case TimeGap["24h"]:
            return "24h";
        case TimeGap["3d"]:
            return "3d";
        case TimeGap["6h"]:
            return "6h";
    }
}

function PresetDateSelectors(props: IPresetDateSelectorsProps) {

    const dispatch = useAppDispatch();

    const onClick = useCallback(() => {
        let presetDateDifference = 0;
        switch (props.timeGap) {
            case TimeGap["1w"]:
                presetDateDifference = 1 * 7 * 24 * 60 * 60 * 1000; // 1 week
                break;
            case TimeGap["24h"]:
                presetDateDifference = 24 * 60 * 60 * 1000; // 24 hour
                break;
            case TimeGap["3d"]:
                presetDateDifference = 3 * 24 * 60 * 60 * 1000; // 3 days
                break;
            case TimeGap["6h"]:
                presetDateDifference = 6 * 60 * 60 * 1000; // 6 hours
                break;
        }
        dispatch(presetDate(presetDateDifference));

    }, [props.timeGap, dispatch]);


    return (<button onClick={onClick}>
        {buttonText(props.timeGap)}
    </button>);
}

export default PresetDateSelectors;