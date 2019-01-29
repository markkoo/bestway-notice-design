
// demo : 
// export as a class = import * as Isotope from 'isotope-layout';  

// declare class Isotope {
//     constructor(selecter: string, options: {
//         itemSelector: string,
//         layoutMode: string
//     })
// }
// declare module Isotope {

// }
// declare module "isotope-layout" {
//     export = Isotope;
// }


declare namespace intlTelInput { 
}

declare function intlTelInput(input : HTMLInputElement, options : {
    preferredCountries : string[],
    customPlaceholder : (selectedCountryPlaceholder: string, selectedCountryData: {
        dialCode : string
    }) => string
}) : void;

declare module 'intl-tel-input' 
{      
    export default intlTelInput;
}

declare module '*.png';
declare module '*.jpg';





