import { setupExtension } from './extensions';
setupExtension();


export function bindingData(elementIdOrNode: string | ParentNode, data: any) {
    const elements: NodeListOf<HTMLElement> = (typeof(elementIdOrNode) === 'string') 
    ? document.querySelectorAll<HTMLElement>(`#${elementIdOrNode} [data-binding]`)
    : elementIdOrNode.querySelectorAll('[data-binding]');
    
    elements.forEach((elem)=>{

        if(elem.tagName === 'IMG'){
            const key = elem.dataset['binding'];
            const image = elem as HTMLImageElement;
            const path = elem.dataset['path'];
            if(data[key] === undefined) return;
            image.src = `${path}/${data[key]}`;
        }
        else if(elem.tagName === 'A'){
            const key = elem.dataset['binding'];
            const a = elem as HTMLLinkElement;
            const path = a.dataset['path'];
            if(data[key] === undefined) return;
            a.href = `${path}/${data[key]}`;
        }
        else if(elem.tagName === 'INPUT'){
            const input = elem as HTMLInputElement;
            const key = input.name;
            if(data[key] === undefined) return;
            if(['text','number','date'].indexOf(input.type) !== -1){
                input.value = data[key];
            }
            else if(input.type === 'checkbox'){
                input.checked = data[key];
            }
            else if(input.type === 'radio'){
                input.checked = input.value === data[key];
            }
        }   
        else if(elem.tagName === 'SELECT'){
            const select = elem as HTMLSelectElement;
            const key = select.name;
            if(data[key] === undefined) return;
            if(select.multiple){
                const options = select.options;
                for(var i = 0; i < options.length; i++) {
                    options[i].selected = (data[key] as any[]).map(v => String(v)).indexOf(options[i].value) !== -1;
                }
            }
            else{
                select.value = data[key];    
            }
        }
        else if(elem.tagName === 'TEXTAREA'){
            const textarea = elem as HTMLTextAreaElement;
            const key = textarea.name;
            if(data[key] === undefined) return;
            textarea.value = data[key];
        }
        else{
            const key = elem.dataset['binding'];
            if(data[key] === undefined) return;
            elem.innerHTML = String(data[key]).encodeHtml();
        }
    });
   
}