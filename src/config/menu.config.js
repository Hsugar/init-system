// import {HOST_WWWW, HOST_BLOG} from '@/constant/index.js';

let menu = [
    {
        text: '乐学官网',
        url: '/index.html',
    },
    /*{
        text: 'TEXT_MALL',
        url: '/mall.html',
    },*/
    {
        text: '新闻',
        url: '/news.html',
    },
    {
        text: '关于我们',
        url: '/software.html',
    },
    {
        text: '帮助',
        url: '/help.html',
    },
   
];


menu.map((item)=>{
    if(item.url && item.url.indexOf('http') == -1){
        // item.url = HOST_WWWW + item.url;
    }
});

export default menu