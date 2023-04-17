import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from '@/enums';

export default function AppRoutes() {
    const MainPage = lazy(() => import('@/pages/MainPage/MainPage'));
    const EventPage = lazy(() => import('@/pages/EventPage/EventPage'))
    const CompaniesPage = lazy(() => import('@/pages/CompaniesPage/CompaniesPage'));
    const CompanyPage = lazy(() => import('@/pages/CompanyPage/CompanyPage'));
    const CreateEventPage = lazy(() => import('@/pages/CreateEvent/CreateEvent'))
    const PromocodesPage = lazy(() => import('@/pages/PromocodesPage/PromocodesPage'))
    const TicketsPage = lazy(() => import('@/pages/TicketsPage/TicketsPage'))
    const ErrorPage = lazy(() => import('@/pages/ErrorPage/ErrorPage'));

    const location = useLocation();

    return (
        <Suspense fallback={<></>}>
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path={ROUTES.main} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0, }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <MainPage />
                        </motion.div>
                    } />
                    <Route path={ROUTES.companies} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <CompaniesPage />
                        </motion.div>
                    } />
                    <Route path={`${ROUTES.company}/:id`} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <CompanyPage />
                        </motion.div>
                    } />
                    <Route path={`${ROUTES.createEvent}/:company_id`} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <CreateEventPage />
                        </motion.div>
                    } />
                    <Route path={`${ROUTES.event}/:event_id`} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <EventPage />
                        </motion.div>
                    } />
                    <Route path={`${ROUTES.promocodes}/:company_id`} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <PromocodesPage />
                        </motion.div>
                    } />
                    <Route path={`${ROUTES.tickets}`} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <TicketsPage />
                        </motion.div>
                    } />
                    <Route path={ROUTES.any} element={
                        <motion.div
                            style={{ flex: 1, display: 'flex' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            <ErrorPage />
                        </motion.div>
                    } />
                </Routes>
            </AnimatePresence>
        </Suspense>
    )
}