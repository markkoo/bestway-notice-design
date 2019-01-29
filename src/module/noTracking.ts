const COOKIES_KEY = 'noTracking';

export function setNoTrackingCookies() {
    document.cookie = `${COOKIES_KEY}expires=${new Date("2025-01-01").toString()}`;
    console.log('No Tracking Cookies Settle!')
}

export function hasNoTrackingCookies():boolean {
    return !!document.cookie.match(COOKIES_KEY);
}





