import { FC } from "react"
import { Button } from "@mui/material"
import { ButtonProps } from "@mui/material"
import { ReactProps } from "@/types"

interface ButtonPropsType extends ReactProps {
    color?: ButtonProps["color"]
    disabled?: boolean
    variant?: "text" | "outlined" | "contained"
}

const AppButton: FC<ButtonPropsType> = ({
    variant,
    color,
    disabled,
    children
}) => {
    return (
        <Button variant={variant} disabled={disabled} color={color}> {children}</Button>
    )
}

export default AppButton