import * as createPalette from "@mui/material/styles/createPalette"

declare module "@mui/material/styles/createPalette" {
    interface PaletteOptions {
        primary_light?: PaletteColorOptions
        primary_main?: PaletteColorOptions
        secondary_light?: PaletteColorOptions
        secondary_main?: PaletteColorOptions
        tertiary_main?: PaletteColorOptions
        error_main?: PaletteColorOptions
        error_light?: PaletteColorOptions
    }

    interface Palette {
        primary_light: PaletteColor
        primary_main: PaletteColor
        secondary_light: PaletteColor
        secondary_main: PaletteColor
        tertiary_main: PaletteColor
        error_main: PaletteColor
        error_light: PaletteColor

    }
}

declare module "@mui/material" {
    interface ButtonPropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }

    interface TextFieldPropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }

    interface InputBasePropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }

    interface FormLabelPropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }

    interface SvgIconPropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }

    interface IconButtonPropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }

    interface CheckboxPropsColorOverrides {
        primary_light: true
        primary_main: true
        secondary_light: true
        secondary_main: true
        tertiary_main: true
        error_main: true
        error_light: true
    }
}