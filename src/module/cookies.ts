export function setCookie(key: string, value: string, day: number) : void {
    let date = new Date();
    date.setTime(date.getTime() + (day * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

export function getCookie(key : string) : string | undefined {
    var name = key + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return undefined;
}

export function removeCookies(key: string) : void {
    setCookie(key, '', -1);
}


