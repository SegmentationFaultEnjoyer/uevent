import '@styles/app.scss'

import AppRoutes from '@/routes';

import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import GlobalMUIStyles from '@/theme'
import { ToastContainer } from '@/common'
import { NavBar, SideBar } from '@/components'

import { store } from '@/store'

export function App() {
    return (
        <Provider store={store}>
            <ThemeProvider theme={GlobalMUIStyles}>
                <NavBar />
                <SideBar />
                <div className='app-container'>
                    <AppRoutes />
                </div>
            </ThemeProvider>
            <ToastContainer theme='dark' />
        </Provider>
    )
}

