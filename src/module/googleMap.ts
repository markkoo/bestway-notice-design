import * as mapIcon from '../images/contactDropPoint.png';

declare global {
    interface Window {
        initMap: () => void
    }
    let google : any
}

export function setupGoogleMap(config: {
    apiKey: string,
    languageIsoCode : string,
    locations : {
        position: {
            lat: number,
            lng: number
        },
        url: string
    }[],
    zoom:number,
    center : {
        lat: number,
        lng: number
    },
    styles : any[]
}) {
    let script = document.createElement('script') as HTMLScriptElement;
    script.type = 'text/javascript';  
    script.async = true;
    script.defer = true;  
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&callback=initMap&language=${config.languageIsoCode}`;
    document.getElementsByTagName('body')[0].appendChild(script);

    window.initMap = () => {
        document.querySelectorAll('#googleMap.googleMap').forEach(elem => {
            let map = new google.maps.Map(elem, {
                zoom: config.zoom,
                center: config.center,
                scrollwheel: false,
                styles: config.styles
            });

            for (let location of config.locations) {
                let marker = new google.maps.Marker({
                    position: location.position,
                    map: map,
                    icon: mapIcon,
                    url: location.url
                });

                marker.addListener('click', function () {
                    window.open(this.url, '_blank');
                });
            }
        });
    }
}