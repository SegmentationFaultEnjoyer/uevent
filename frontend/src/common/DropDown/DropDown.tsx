import { FC, useState, createElement, ReactNode, Dispatch, SetStateAction } from "react";
import { Popover } from "@mui/material"
import { ReactProps } from "@/types";

interface Props extends ReactProps {
    trigger: ReactNode
    anchorEl: HTMLElement | null,
    setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>
}

const DropDown: FC<Props> = ({ trigger, anchorEl, setAnchorEl, children, ...rest }) => {
    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'drop-down' : undefined;

    return (
        <div>
            {trigger}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
            >
                {children}
            </Popover>
        </div>
    )
}

export default DropDown