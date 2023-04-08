import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { getRandom } from "./assets/js/random.js";
const ARRAY_LENGTH = 20;

const appElement = document.querySelector('#app');
const app2 = document.querySelector('#app-2');

const margin = {
    top: 20,
    right: 0,
    bottom: 30,
    left: 40,
};
const appWidth = appElement.clientWidth;

const values = [];
console.log(await d3.json('./datas/data.json'));

for (let index = 0; index < ARRAY_LENGTH; index++) {
    values.push(getRandom(100));
}


const xScale = d3.scaleBand()
                    .domain(values)
                    .rangeRound([margin.left, appWidth - margin.right])
                    .padding(0.1);
const yScale = d3.scaleLinear()
                .domain([0, d3.max(values, d => d)])
                .range([500 -margin.bottom, margin.top]);

const svg = d3.create("svg")
.attr("viewBox", [0, 0, appWidth, 500]);

svg.append("g")
.attr("fill", "steelblue")
.selectAll("rect")
.data(values)
.join("rect")
.attr("x", d => xScale(d))
.attr("y", d => yScale(d))
.attr("height", d => yScale(0) - yScale(d))
.attr("width", xScale.bandwidth());

const yAxis = (g) => g
.attr("transform", `translate(${margin.left},0)`)
.call(d3.axisLeft(yScale))
.call(g => g.select(".domain").remove())

const xAxis =(g) => g
    .attr("transform", `translate(0,${500 - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))

svg.append("g")
    .call(xAxis);

svg.append("g")
    .call(yAxis);


appElement.appendChild(svg.node());
