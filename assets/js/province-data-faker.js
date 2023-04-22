/**
 * 
 * @param {Array} data
 * return Array 
 */
import { faker } from 'https://cdn.skypack.dev/@faker-js/faker';
const population = (Math.round((Math.random() * (10000000 - 100)) )+ 100);
export const provinceDataFaker = (data) => {
    const fakeDatas = [];
    for(const item of data) {
        const prop = item.properties;
        const zones = [];
        const zoneNumber = Math.round((Math.random() * (7 - 1)) + 1 );

        for (let index = 0; index < zoneNumber; index++) {
            zones.push({
                id: index + 1,
                name: faker.address.state(),
                provinceId: prop['ISO3166-2'],
                population: Math.round(Math.random() * (30) * population / 100),
                pregnancies: Math.round(Math.random() * (30) * population / 100),
                hospitals: Math.round(Math.random() * (5) * population / 100),
            })
            
        }
        fakeDatas.push({
            id: prop['ISO3166-2'],
            name: prop.name,
            population,
            pregnancies: Math.round(Math.random() * (40) * population / 100),
            malarias: Math.round(Math.random() * (40) * population / 100),
            zones,
        });
    }
    return fakeDatas;
}