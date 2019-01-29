
// note : 不支持 input file 哦
export function localStorageForm(config: {
    elementId: string,
    localStorageKey: string,
    redirectUrl: string
}): void {
    const { elementId, localStorageKey, redirectUrl } = config;
    const form = document.getElementById(elementId);
    form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const formElement = e.target as HTMLFormElement;
        const formData = new FormData(formElement)
        let store: any = {};
        formData.forEach((value, key) => {
            store[key] = value;
        });
        localStorage.setItem(localStorageKey, JSON.stringify(store));
        location.href = redirectUrl;
    });
}

export function formDataToObject(formElement: HTMLFormElement): any {
    const formData = new FormData(formElement);
    let result: any = {};
    formData.forEach((value, key) => {
        result[key] = value;
    });
    return result;
}


export function ajaxForm(config: {
    elementId: string
    beforeSend: () => void
    success: (responseText: string) => void
    error: (responseText: string) => void
    finally: () => void
    processing?: (percent: number) => void
    combineToFormData?: { [propName : string] : any }[]
}): void {
    config.processing = config.processing || function () { };
    config.combineToFormData = config.combineToFormData || [];
    const { elementId, error, beforeSend, success, processing, combineToFormData } = config;
    const form = document.getElementById(elementId);
    form.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        const formElement = e.target as HTMLFormElement;
        beforeSend();
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    success(xhr.responseText);
                }
                else {
                    console.error({
                        status: xhr.status,
                        responseText: xhr.responseText
                    });
                    error(xhr.responseText);
                }
                config.finally();
            }
        });
        xhr.onprogress = function (event) {
            processing(+Math.round(event.loaded / event.total * 100).toFixed(0));
        };
        xhr.open("POST", formElement.action, true);
        let formData = new FormData(formElement);
        if (combineToFormData.length > 0) {
            console.log(combineToFormData)
            combineToFormData.forEach(obj => {
                Object.keys(obj).forEach(key => {
                    formData.append(key, obj[key]);
                });
            });
        }
        formData.forEach((value, key) => {
            console.log(key, value);
        });
        xhr.send(formData);
    });
}
