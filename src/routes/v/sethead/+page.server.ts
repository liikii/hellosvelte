import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ setHeaders }) => {
    setHeaders({
        // 告诉浏览器：把这个页面当成纯文本处理，不要解析 HTML
        'Content-Type': 'text/plain',
        // 顺便演示：设置一个自定义缓存头
        'Cache-Control': 'max-age=60'
    });

    return {
        message: "这条消息在浏览器里看起来就是纯文本"
    };
};
