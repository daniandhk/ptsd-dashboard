export default [
    {
        path: '/test/:test_type',      
        name: 'test-landing',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if(routeFrom.name != "home"){
                    next({ name: 'home' })
                }
                else{
                    next()
                }
            },
        },
        component: () => import('../../views/pages/patient/test/landing-page')
    },
    {
        path: '/test/:test_type/start',      
        name: 'test-start',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if(routeFrom.name != "test-landing"){
                    next({ name: 'test-landing', params: { test_type: this.$route.params.test_type } })
                }
                else{
                    next()
                }
            },
        },
        component: () => import('../../views/pages/patient/test/index')
    },
    {
        path: '/test/:test_type/finished',      
        name: 'test-finished',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                if(routeFrom.name != "test-start"){
                    next({ name: 'test-landing' })
                }
                else{
                    next()
                }
            },
        },
        component: () => import('../../views/pages/patient/test/finished-page')
    },
    {
        path: '/test/:test_type/review/:test_id/:patient_id',      
        name: 'test-review',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/patient/test/index')
    },
    {
        path: '/journal',      
        name: 'journal',
        meta: {
            authRequired: true,
        },
        component: () => import('../../views/pages/patient/journal-page')
    },
]