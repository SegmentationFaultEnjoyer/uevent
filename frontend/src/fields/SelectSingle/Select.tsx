import { Select, InputLabel, MenuItem, FormControl, SelectChangeEvent } from '@mui/material'
import { Dispatch, FC, SetStateAction } from 'react'
import { ReactProps } from '@/types'

interface Props extends ReactProps {
    value: string
    setValue: Dispatch<SetStateAction<string>>
    label: string
    size?: 'small' | 'medium'
    variant?: "outlined" | "filled" | "standard"
    choices: Array<string>
}

const SelectSingle: FC<Props> = ({ value, setValue, label, choices, size = 'small', variant = 'outlined' }) => {
    const handleChange = (e: SelectChangeEvent) => {
        setValue(e.target.value)
    }

    return (
        <FormControl sx={{ m: 1, width: '90%' }} size={size}>
            <InputLabel
                id="select-small"
                color="primary_light">
                {label}
            </InputLabel>
            <Select
                color="primary_light"
                labelId="select-small"
                id="select-small"
                value={value}
                label="Age"
                variant={variant}
                required
                fullWidth
                onChange={handleChange}
            >
                {choices.map(choice =>
                    <MenuItem
                        value={choice}
                        key={choice}> {choice}</MenuItem>)}
            </Select>
        </FormControl>
    )
}

export default SelectSingle