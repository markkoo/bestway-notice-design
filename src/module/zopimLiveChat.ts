import { setEvent, trySetAdsConversion } from './googleAnalytics';


declare global {
    interface Window {
        $zopim: any
    }
}

export function setupLiveChat(zopimLiveChatId : string) {
    let script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';    
    script.textContent = `
        window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
        d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
        _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute("charset","utf-8");
        $.src="https://v2.zopim.com/?${zopimLiveChatId}";z.t=+new Date;$.
        type="text/javascript";e.parentNode.insertBefore($,e)})(document,"script");
    `;
    document.getElementsByTagName('body')[0].appendChild(script);
    window.$zopim(function () {
        window.$zopim.livechat.setOnChatStart(()=> {
            setEvent('liveChat');
            trySetAdsConversion('liveChat');
        })
    });
}




