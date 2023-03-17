import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
// import type { RootState } from ''

// Define a type for the slice state
interface DatePickerState {
  fromDate: Date | null;
  toDate: Date | null;
}

// Define the initial state using that type
const initialState: DatePickerState = {
    fromDate: null,
    toDate: null
}

export const datepickerSlice = createSlice({
  name: 'datepicker',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFromDate: (state,  action: PayloadAction<Date>) => {
      state.fromDate = action.payload;
    },
    setToDate: (state,  action: PayloadAction<Date>) => {
      state.toDate  = action.payload;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    presetDate: (state, action: PayloadAction<number>) => {
        const currentTime = Date.now();
        state.fromDate = new Date(currentTime - action.payload);
        state.toDate = new Date(currentTime);
    },
    resetDate: (state)=>{
        state.fromDate = null;
        state.toDate = null;
    }
  },
})

export const { setFromDate, setToDate, presetDate, resetDate } = datepickerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const datePicker = (state: RootState) => state.datePicker;

export default datepickerSlice.reducer