import { createRoot } from 'react-dom/client'
import { App } from '@/App'

import { BrowserRouter } from 'react-router-dom';

const AppRoot = document.getElementById('app') as Element

createRoot(AppRoot).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)



