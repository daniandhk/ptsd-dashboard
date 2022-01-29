import httpAxios from '@/httpAxios.js';

export function inputTest(data){
    return httpAxios({
        url: '/test',
        method: 'POST',
        data: data
    })
}