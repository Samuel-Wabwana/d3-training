import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


const data = await d3.json('/datas/provinces.geojson');

const linkList = document.querySelectorAll('.map svg a');

for(const a of linkList) {
    a.addEventListener('mouseenter', (e) => {
        const path = a.querySelector('path');
        const province = data.features.find(x => x.properties['ISO3166-2'] === path.id);
        if (province) {
            const latitude = document.querySelector('#lat');
            const longitude = document.querySelector('#long');
            const name = document.querySelector('#name');
            const timeZone = document.querySelector('#timezone');
            latitude.innerHTML = province.properties.lat;
            longitude.innerHTML = province.properties.lon;
            name.innerHTML = province.properties.name;
            timeZone.innerHTML = province.properties.timezone;
        }
    });
}