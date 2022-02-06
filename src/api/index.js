import httpAxios from '@/httpAxios.js';
// import store from '@/store'

//asprak
export * from "./patient.js";

//auth
export function login(data){
    return httpAxios({
        url: '/auth/login',
        method: 'POST',
        data: data
    })
}
export function validateUser(){
    return httpAxios({
        url: '/auth/me',
        method: 'GET',
        // headers: {
        //     Authorization: 'Bearer ' + store.getters.getLoggedUser.token,
        // },
    })
}
export function register(data){
    return httpAxios({
        url: '/auth/register',
        method: 'POST',
        data: data
    })
}

// export function changePassword(data){
//     return httpAxios({
//         url: `/me/update-password`,
//         method: 'PUT',
//         data: data
//     })
// }

export function logout(){
    return httpAxios({
        url: `/auth/logout`,
        method: 'POST',
    })
}

export function resend(){
    return httpAxios({
        url: `/auth/email/resend`,
        method: 'GET',
    })
}

export function createRelation(data){
    return httpAxios({
        url: '/relation/create',
        method: 'POST',
        data: data
    })
}

export function showTest(test_id){
    return httpAxios.get(`/test/show/${test_id}`);
}