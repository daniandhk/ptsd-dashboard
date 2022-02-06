import store from '@/store';
import * as api from '@/api';

export default [
    {
        path: '/login',
        name: 'login',
        component: () => import('../../views/pages/auth/login'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters.getLoggedUser) {
                    // Redirect to the home page instead
                    return api.validateUser().then(response => {
                        // console.log(response.data)
                        response.data.token = store.getters.getLoggedUser.token
                        store.commit('LOGGED_USER', response.data)

                        let role = store.getters.getRoleUser
                        if (!role) {
                            store.commit('ROLE_USER', response.data.roles[0].name)
                        }
                        next({ name: 'home' })
                    })
                    .catch(error => {
                        store.dispatch('logOut')
                        //console.log(error)
                        next({params: { tokenExpired: true }})
                    })
                    
                } else {
                    // Continue to the login page
                    next()
                }
            },
        },
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../../views/pages/auth/register'),
        meta: {
            beforeResolve(routeTo, routeFrom, next) {
                // If the user is already logged in
                if (store.getters.getLoggedUser) {
                    // Redirect to the home page instead
                    return api.validateUser().then(response => {
                        console.log(response.data)
                        response.data.token = store.getters.getLoggedUser.token
                        store.commit('LOGGED_USER', response.data)

                        let role = store.getters.getRoleUser
                        if (!role) {
                            store.commit('ROLE_USER', response.data.roles[0].name)
                        }
                        next({ name: 'home' })
                    })
                    .catch(error => {
                        store.dispatch('logOut')
                        //console.log(error)
                        next({params: { tokenExpired: true }})
                    })
                    
                } else {
                    // Continue to the register page
                    next()
                }
            },
        },
    },
    // {
    //     path: '/forgot-password',
    //     name: 'forgot-password',
    //     component: () => import('../../views/pages/auth/forgot-password'),
    //     meta: {
    //         //cek login
    //     },
    // },
    {
        path: '/logout',
        name: 'logout',
        meta: {
            authRequired: true,
            beforeResolve(routeTo, routeFrom, next) {
                let loggedUser = store.getters.getLoggedUser
                if(loggedUser){
                    api.logout().then(response => {
                        //
                    })
                    .catch(error => {
                        //
                    });
                }
                store.dispatch('logOut')
                const authRequiredOnPreviousRoute = routeFrom.matched.some(
                    (route) => route.push('/login')
                )
                // Navigate back to previous page, or home as a fallback
                next(authRequiredOnPreviousRoute ? { name: 'home' } : { ...routeFrom })
            },
        },
    },
    // {
    //     path: '/settings/change-password',      
    //     name: 'settings',
    //     meta: {
    //         authRequired: true,
    //     },
    //     component: () => import('../../views/pages/pengaturan/change-password')
    // },
]
