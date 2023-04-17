import { TextField, TextFieldPropsColorOverrides, BadgePropsVariantOverrides } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker, DateTimePickerTabs, DateTimePickerTabsProps } from '@mui/x-date-pickers/DateTimePicker';

import { Dispatch, FC, SetStateAction } from 'react'
import dayjs from "dayjs";

interface Props {
    label: string
    value: dayjs.Dayjs
    color?: keyof TextFieldPropsColorOverrides,
    variant?: 'filled' | 'outlined',
    setValue: Dispatch<SetStateAction<dayjs.Dayjs>>
    minDateTime: dayjs.Dayjs
}

const CustomTabs = (props: DateTimePickerTabsProps) => {
    return <DateTimePickerTabs {...props} />
}

const BasicDateTimePicker: FC<Props> = ({ label, value, setValue, minDateTime, color = 'secondary_main', variant = 'filled' }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
                renderInput={(props) => <TextField variant={variant} color={color} {...props} />}
                label={label}
                value={value}
                onChange={(newValue) => {
                    if (newValue) setValue(newValue);
                }}
                minDateTime={minDateTime}
                components={{ Tabs: CustomTabs }}
                views={['day', 'hours']}
            />
        </LocalizationProvider>
    );
}

export default BasicDateTimePicker