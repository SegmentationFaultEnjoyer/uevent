import { createTheme } from "@mui/material"

const paletteOptions = {
	primary_light: {
		main: '#54566d',
		contrastText: '#ffffff'
	},
	primary_main: {
		main: '#2b2d42',
		contrastText: '#ffffff'
	},
	secondary_light: {
		light: '#bdcae0',
		main: '#8d99ae',
		dark: '#5f6b7f',
		contrastText: '#ffffff'
	},
	secondary_main: {
		light: '#8d99ae',
		main: '#5f6b7f',
		contrastText: '#ffffff'
	},
	tertiary_main: {
		main: '#EDF2F4',
		contrastText: '#212121'
	},
	error_main: {
		main: '#EF233C',
		contrastText: '#212121'
	},
	error_light: {
		main: '#ff6367',
		contrastText: '#212121'
	}
}

const theme = createTheme({
	palette: paletteOptions,
})

export default theme