import type { PageLoad } from './$types';

export const load: PageLoad = async ({fetch}) => {
    // 从 URL 获取页码，默认为 1
    // const page = url.searchParams.get('page') || '1';

    try
    {
        const res = await fetch(`/api/captcha?t=${Date.now()}`);
        const data = await res.json();
        return {
            captcha_img: data.base64_img,
            capt_code: data.capt_code,
        };
    }
    catch(e)
    {
        console.log("captcha get error:", e);
        return {
            captcha_img: "",
            capt_code: "",
        };
    }
};
