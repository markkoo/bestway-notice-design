export function setupFacebookPage(facebookAppId : string) {
    let script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';  
    script.textContent =`
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1&appId=${facebookAppId}";
            js.async = !0;
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    `
    document.getElementsByTagName('body')[0].appendChild(script);
}





