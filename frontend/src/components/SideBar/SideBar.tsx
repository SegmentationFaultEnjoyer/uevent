import './SideBar.scss'

import { FC, useMemo } from "react"
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/enums';

const SideBar: FC = () => {
    const location = useLocation()

    return (
        <aside className="side-bar">
            <Link
                className={`side-bar__link ${location.pathname === ROUTES.main ? 'side-bar__link--active' : ''}`}
                to={ROUTES.main}>
                Home
            </Link>
            <Link
                className={`side-bar__link ${location.pathname === ROUTES.companies ? 'side-bar__link--active' : ''}`}
                to={ROUTES.companies}>
                Companies
            </Link>
            <Link
                className={`side-bar__link ${location.pathname === ROUTES.tickets ? 'side-bar__link--active' : ''}`}
                to={ROUTES.tickets}>
                Tickets
            </Link>
        </aside>
    )
}

export default SideBar;