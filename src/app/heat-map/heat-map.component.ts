import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent implements OnInit, AfterContentInit {

  data = [];

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(){
    // ==========@@@@@@@@@@ service fetch another data for HEAT MAP chart @@@@@@@@@@@@=============
        // this.mapService.getCutomerStat().subscribe(data => {
          // let xdata = data.map(e => {
          //     return { ...e.payload.doc.data() };
          // });
          // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then((data)=>{
            d3.csv("https://iamgiel.github.io/resume/assets/world3.csv").then((data)=>{ 
              // console.log(data)
              this.data = data;
  
                  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
                  const yAxes = d3.map(this.data, function(d){return d["Country"];}).keys()
                  const xAxes = d3.map(this.data, function(d){return d["Year"]}).keys()
                  console.log(xAxes)
  
            const margin = { top: 180, right: 100, bottom: 20, left: 200 };
            const graphWidth = yAxes.length*100 + margin.left + margin.right;
            const graphHeight = xAxes.length*10000 - margin.top - margin.bottom;
  
            // append the svg object to the body of the page
            const graph = d3.select("#heat-map")
              .append("svg")
              .attr("width", graphWidth)
              .attr("height", graphHeight)
              // .attr("margin-top", 600)
              .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top  + ")");
  
            // LEGEND
            // select the svg area
            // const legendSvg = d3.select("#legend")
            // Handmade legend
            graph.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#4BA15E").attr("transform", "translate(0,-220)")
            graph.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#A7CDD9").attr("transform", "translate(0,-220)")
            graph.append("text").attr("x", 220).attr("y", 130).text("Towards 100: Longer Life Expectency").style("font-size", "15px").attr("alignment-baseline","middle").attr("transform", "translate(0,-220)")
            graph.append("text").attr("x", 220).attr("y", 160).text("N/A or Shorter Life Expectency").style("font-size", "15px").attr("alignment-baseline","middle").attr("transform", "translate(0,-220)")
  
            // Build X scales and axis:
            const x = d3.scaleBand()
              .range([ 0, 750 ])
              .domain(xAxes)
              .padding(0.05);
              
            graph.append("g")
              .style("font-size", 20)
              .attr("transform", "translate(0," + 0 + ")")
              .call(d3.axisTop(x).tickSize(12).tickFormat((d) => `${d}`))
  
            // Build Y scales and axis:
            const y = d3.scaleBand()
              .range([ 0, 3000 ])
              .domain(yAxes)
              .padding(0.05);
              
            graph.append("g")
              .style("font-size", 15)
              .attr("transform", "translate(0," + 0 + ")")
              .call(d3.axisLeft(y).tickSize(12))
  
            // Build color scale
  
            // let grey = () =>  {
            //   if()
            // }
            const myColor = d3.scaleLinear<any>()
            .range(["#A5CAD6", "green"])
            .domain([0, 60])
          
  
            // select tool tip div
            const hmToolTip = d3.select("#heatmap-tooltip")
              .style("opacity", 0)
              .style("position", "relative")
              // .attr("class", "tooltip")
              .style("padding", "5px")
  
            // Three function that change the tooltip when user hover / move / leave a cell
            const mouseover = function(d) {
              // let yearString = `${d["Year"]} or ${yearString.substring(5)}`;
              let population = `${d["Population Total"]}`
              let life = d["Life Expectancy Male"] ? d["Life Expectancy Male"] : "n/a";
              // console.log(yearString.substring(5))
              hmToolTip
              .style("opacity", 1)
                .html(`Life Expectancy <br> Male: ${life} <br> Population : ${population}`)
                .style("left", (d3.mouse(this)[0]-400) + "px")
                .style("top", (d3.mouse(this)[1]+120) + "px")
                .style("color", "white")
              d3.select(this)
                .style("stroke", "yellow")
                .style("opacity", 1)
            }
            const mousemove = function(d) {
              
            }
            const mouseleave = function(d) {
              hmToolTip
                .style("opacity", 0)
              d3.select(this)
                .style("stroke", "none")
                .style("opacity", 0.8)
            }
  
            // add the squares
            graph.selectAll()
            .data(this.data, function(d) {return d["Country"]+':'+d["Year"];})
            .enter()
            .append("rect")
              .attr("x", function(d) { return x(d["Year"] ) }) // allows to spread the square diagonally across the chart
              .attr("y", function(d) { return y(d["Country"])}) // allows to spread the square diagonally across the chart
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("width", x.bandwidth() )
              .attr("height", y.bandwidth() )
              .style("fill", function(d) { return myColor(d["Life Expectancy Male"])} ) // scale color here defined above
              .style("stroke-width", 4)
              .style("stroke", "none")
              .style("opacity", 0.8)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
              
            })
  }

}
