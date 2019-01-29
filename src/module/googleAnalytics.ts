import { hasNoTrackingCookies } from './noTracking';

declare global {
    let gtag: (...args: any[]) => void
}
interface GoogleAdsConfig {
    Id : string,
    convertor : {
        [name : string] : string,
    }
}

let _googleAdsConfig : GoogleAdsConfig | undefined = undefined;
export function setupGA(googleAnalyticsId: string, googleAdsConfig?: GoogleAdsConfig ) {
    if(hasNoTrackingCookies()) return;
    let script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
    document.getElementsByTagName('head')[0].appendChild(script);
 
    // 因为它需要定义全局变量，所以不能再 ts 里面写. 
    let script2 = document.createElement('script') as HTMLScriptElement;
    script2.type = 'text/javascript';
    script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());    
        gtag('config', '${ googleAnalyticsId }', {
            'custom_map': {
                'dimension1': 'scrolled'
            }
        });
        ${googleAdsConfig ? `gtag('config', '${googleAdsConfig.Id}');` : ''}
    `;
    document.getElementsByTagName('head')[0].appendChild(script2);

    setTimeout(()=>{
        gtag('event', 'scrolled_dimension', {
            'scrolled': 'true'
        });
    },15000);
  
    document.querySelectorAll<HTMLElement>('.googleAnalyticsTracking').forEach(elem => {
        const trackEventName = elem.dataset['googleAnalyticsEvent'];
        elem.addEventListener('click', () => {  
            setEvent(trackEventName);
        });
    });  
    if(googleAdsConfig){
        _googleAdsConfig = googleAdsConfig;
        document.querySelectorAll<HTMLElement>('.googleAdsTracking').forEach(elem => {
            const trackConversionName = elem.dataset['googleAdsConversion'];
            elem.addEventListener('click', () => {  
                setAdsConversion(trackConversionName);
            });
        }); 
    }
}

export function setEvent(eventName:string, eventCategory?:string, eventLabel?:string ){
    if(hasNoTrackingCookies()) return;
    eventCategory = eventCategory || eventName;
    eventLabel = eventLabel || eventName;
    gtag('event', `event_${eventName}`, {
        'event_category': `event_${eventCategory}`,
        'event_label': `event_${eventLabel}`,
        'value': 1
    });
}

export function setAdsConversion(conversionName:string){
    if(hasNoTrackingCookies()) return;
    gtag('event', 'conversion', { 'send_to': `${_googleAdsConfig.Id}/${_googleAdsConfig.convertor[conversionName]}` });
}

export function trySetAdsConversion(conversionName:string){
    if(_googleAdsConfig){
        setAdsConversion(conversionName);
    }
}


