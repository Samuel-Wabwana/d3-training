import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";



const path = d3.geoPath();
const data = await d3.json('/datas/provinces.geojson');
const mappedData = data;

for (let index = 0; index < mappedData.features.length; index++) {
    const element = mappedData.features[index];
    const coordinates = element.geometry.coordinates;
    for (let index = 0; index < coordinates.length; index++) {
        const coord = coordinates[index];
        for (let index = 0; index < coord.length; index++) {
            const el = coord[index];
            for (let index = 0; index < el.length; index++) {
                const pt = el[index];
                pt[0] = (pt[0] - 12.5) * 733.57 / 19;
                console.log(pt[0])
                pt[1] = (pt[1] - 5,5 ) * 724  /(19.333333);
            }
        }
    }
    
}
console.log(mappedData.features)
const healthZone = await d3.csv('/datas/RDC_sante_zones_200709.csv');
const healthZoneDatas = [];//donnee random
for(const zone of healthZone) {
    const zoneRnd = {... zone};
    zoneRnd.patients = Math.random * ( 50000);
    zoneRnd.hospitals = Math.random * (20 - 3) + 3;
    zoneRnd.r = Math.random() * (10 - 3) + 3
    healthZoneDatas.push(zoneRnd);
}
const coordDrc = {
    lat: {
        start: 5.5,
        end: -13.833333,
    },
    long: {
        start: 12.25,
        end: 31.25,
    }
};

let transform;


const svg = d3.select("svg");
const g = svg.select('g');
const states = g.selectAll('.province-link');
const zoneDeSantes = g.selectAll('a.zonecircle')
            .data(healthZone)
            .enter()
            .append('a')
            .attr('xlink:title', (d) => d.name)
            .attr('xlink:data-bs-toggle', 'tooltip')
            .attr('xlink:data-bs-placement', 'top')
            .attr('class', 'zonecircle')
            .attr('id', (d) => d.full_id)
            .append('circle')
            .attr('cx', (d) => {
                return (d.X - coordDrc.long.start)* 733.57 / (Math.abs(coordDrc.long.start - coordDrc.long.end) )
            })
            .attr('cy', (d) => {
                return (d.Y - coordDrc.lat.start) * (-724) / (Math.abs(coordDrc.lat.start - coordDrc.lat.end) );
            })
            .attr('fill', '#1253ef')
const x = d3.scaleLinear([0, 1], [0, 600]);
const y = d3.scaleLinear([0, 1], [0, 592.17]);
const points = g.selectAll('circle')
                .data(healthZoneDatas)
                .attr('r', (d) => {
                    return d.r
                });

const zoom = d3.zoom().on("zoom", e => {
    g.attr("transform", (transform = e.transform));
    g.style("stroke-width", 3 / Math.sqrt(transform.k));
    const points = g.selectAll('circle')
                .data(healthZoneDatas)
                .attr('r', (d) => d.r / Math.sqrt(transform.k))
    //points.attr("r", 10  / Math.sqrt(transform.k));
    });
    const delaunay = d3.Delaunay.from(healthZoneDatas, d => x(d.X), d => y(d.Y));

const linkList = svg.selectAll('svg a.province-link')
                    .data(mappedData.features)
                    .select('path')
                    .attr('fill', '#ADB5BD')
                    .on('mouseenter', (e) => {
                        const path = svg.select(`path#${e.target.id}`);
                        path.attr('fill', '#225599')
                    })
                    .on('mouseout', (e) => {
                        const path = svg.select(`path#${e.target.id}`);
                        path.attr('fill', '#ADB5BD')
                    })
                    .on('click', (e, d) => {
                        const [[x0, y0], [x1, y1]] = path.bounds(d);
                        e.stopPropagation();
                        states.transition().style("fill", null);
                        d3.select(this).transition().style("fill", "red");
                        svg.transition().duration(750).call(
                        zoom.transform,
                        d3.zoomIdentity
                            .translate(733.57 / 2, 592.17 / 2)
                            .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / 733.57, (y1 - y0) / 724)))
                            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
                        d3.pointer(e, svg.node())
                        );
                    })



svg.call(zoom)
    .call(zoom.transform, d3.zoomIdentity)
    .on("pointermove", event => {
      const p = transform.invert(d3.pointer(event));
      const i = delaunay.find(...p);
      points.classed("highlighted", (_, j) => i === j);
      d3.select(points.nodes()[i]).raise();
    })

