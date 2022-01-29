export default [
    {
        path: '/pds5',      
        name: 'pds5-landing',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/patient/pds5/landing-page')
    },
    {
        path: '/pds5/test',      
        name: 'pds5-test',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if(routeFrom.name != "pds5-landing"){
                    next({ name: 'pds5-landing' })
                }
                else{
                    next()
                }
            },
        },
        component: () => import('../../views/pages/patient/pds5/tests-page')
    },
    {
        path: '/pds5/finished',      
        name: 'pds5-finished',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if(routeFrom.name != "pds5-test"){
                    next({ name: 'pds5-landing' })
                }
                else{
                    next()
                }
            },
        },
        component: () => import('../../views/pages/patient/pds5/finished-page')
    },
]