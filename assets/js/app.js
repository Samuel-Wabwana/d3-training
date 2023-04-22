import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { provinceDataFaker } from "./province-data-faker.js";
import { showProvinceDatas } from "./utilities/show-province-datas.js";

const map = document.querySelector('.country-svg');
const width = map.clientWidth;
const height = map.clientHeight;
let isZoomed = false;
let zoomedPath;

const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
const path = d3.geoPath();

const provinceDatas = await d3.json('/datas/provinces.geojson');
const provincesMetaData = provinceDataFaker(provinceDatas.features);

// for (let index = 0; index < provinceDatas.features.length; index++) {
//   const element = provinceDatas.features[index];
//   const coordinates = element.geometry.coordinates;
//   for (let index = 0; index < coordinates.length; index++) {
//       const coord = coordinates[index];
//       for (let index = 0; index < coord.length; index++) {
//           const el = coord[index];
//           for (let index = 0; index < el.length; index++) {
//               const pt = el[index];
//               pt[0] = (pt[0] - 12.2) * 733.57 / 19;
//               pt[1] = (pt[1] - 5 ) * 724  /(18.45);
//           }
//       }
//   }
  
// }

const svg = d3.select('svg.country-svg');
svg.on('click', reset);
const g = svg.select('g.cont');
const provinces = svg.select('g.cont')
                    .select('g')
                    .attr("cursor", "pointer")
                    .selectAll('path')
                    .data(provinceDatas.features.sort((a, b) => {
                        const nameA = a.properties.name.toUpperCase(); // ignore upper and lowercase
                        const nameB = b.properties.name.toUpperCase(); // ignore upper and lowercase
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }

                        // names must be equal
                        return 0;
                    }))
                    .join('path')
                    .on('click', clicked)
                    .on('mousemove', hovered)
                    .on('mouseout', unhovered);
provinces.append("title")
        .text(d => d.properties.name);


svg.call(zoom);
function reset() {
    provinces.transition().style("fill", null);
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
    );
    document.querySelector('.table-data')?.remove();
  }

function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }
  function clicked(event, d) {
    if(isZoomed) {
      reset();
      isZoomed = false;
      zoomedPath = undefined;
      return;
    }

    let [[x0, y0], [x1, y1]] = path.bounds(d);
    x0 = 600 / 100 * Math.abs(x0 - 12.2) / 0.154333;
    x1 = 600 / 100 * Math.abs(x1 - 12.2) / 0.154333;
    y0 = height / 100 * Math.abs(y0 - 5) / 0.1845;
    y1 = height / 100 * Math.abs(y1 - 5) / 0.1845;
    event.stopPropagation();
    provinces.transition().style("fill", null);
    d3.select(this).transition().style("fill", "#3b729f");
    svg.transition().duration(800).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node())
    );
    svg.append('g.circles')
        .append('circle')
        .attr('cx', '200')
        .attr('cy', '200')
        .attr('r', '50')
    
    isZoomed = true;
    zoomedPath = event.target;
    showProvinceDatas(zoomedPath.id, provincesMetaData);
  }

  function hovered(event) {
    const provincePath = event.target;
    provincePath.style.fill = '#3b729f';
    let tool = document.querySelector('.tooldiv');
    if (!tool) {
      tool = document.createElement('div');
    } 
    const tooltip = tool;
    tooltip.className = "position-absolute bg-white py-4 px-2 rounded tooldiv";
    document.body.appendChild(tooltip);
    tooltip.style.left = `${( event.clientX - 100)}px`;
    tooltip.style.top = `${(event.clientY - 150)}px`;
    tooltip.style.zIndex = 3;
    tooltip.style.opacity = 1
    tooltip.style.width = '12rem';
    const id = provincePath.id.trim();// we get the id of the path
    const data = provincesMetaData.find(x => x.id === id);// we get the current province
    const provinceObject = provinceDatas.features.find(x => x.properties['ISO3166-2'] === id);
    tooltip.innerHTML = `<h5 class="text-center">${provinceObject.properties.name}</h5>
        <div class="d-flex justify-content-between">
          <div class="mr-3">Population</div>
          <div class="ml-5">:${data.population}</div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="mr-3">Grossesses</div>
          <div class="ml-5">:${data.pregnancies}</div>
        </div>
    `;
  }
  function unhovered(event) {
    const targetedPath = event.target;
    if (isZoomed) {
      if (targetedPath.id !== zoomedPath.id) {
        targetedPath.style.fill = '';
      }
    }else {
      targetedPath.style.fill = '';
    }
    document.querySelector('.tooldiv')?.remove();
  }