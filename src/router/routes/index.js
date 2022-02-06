import store from '@/store';
import * as api from '@/api';

import etcRoutes from "./etc.js";
import authRoutes from "./auth.js";
import patientRoutes from "./patient.js";

const baseRoutes = [
    {
        path: '/',
        name: 'home',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/dashboard')
    },
]

const routes = baseRoutes.concat(etcRoutes, authRoutes, patientRoutes);
export default routes;