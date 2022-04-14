import httpAxios from '@/httpAxios.js';

export function inputProfilePsychologist(data){
    return httpAxios({
        url: '/psychologist/create',
        method: 'POST',
        data: data
    })
}