import { TextField, Autocomplete } from "@mui/material";
import { Dispatch, FC, SetStateAction, useState, useEffect } from 'react'

interface Props {
    options: string[]
    label: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

const AutocompleteInput: FC<Props> = ({ options, label, value, setValue }) => {
    const [inputValue, setInputValue] = useState('')

    useEffect(() => {
        setValue(inputValue)
    }, [inputValue])

    return (
        <Autocomplete
            freeSolo
            value={value}
            onChange={(_, newValue) => {
                setValue(newValue ?? '')
            }}
            inputValue={inputValue}
            onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={options}
            renderInput={(params) => <TextField {...params} color="primary_main" required variant="filled" label={label} />}
        />
    )
}

export default AutocompleteInput