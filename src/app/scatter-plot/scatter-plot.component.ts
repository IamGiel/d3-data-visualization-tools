import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.css']
})
export class ScatterPlotComponent implements OnInit, AfterContentInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit(){
     // ==========@@@@@@@@@@ service fetch another data for SCATTER PLOT MAP chart @@@@@@@@@@@@=============

     d3.csv("https://iamgiel.github.io/resume/assets/world3.csv").then((data2)=>{ 
      // console.log(data2)
      let data = data2;
      // d3.scaleOrdinal(d3.schemeCategory10)
      let colorful = d3.scaleOrdinal(d3.schemeCategory10);
      // console.log(colorful)

      
      let max = d3.max(data, function(d){
        return parseFloat(d["Population Total"])
      }); // maximum of x and y
        // console.log(max)

      let colorDomainMin = d3.min(data, function(d){
        let yearString = `${d["Year"]}`;
        let year = `${yearString.substring(5)}`;
        return year ? year : "2000";
      }); // maximum of x and y
        // console.log(colorDomainMin)

      let colorDomainMax = d3.max(data, function(d){
        return d["Year"].substring(5);
      }); // maximum of x and y
        // console.log(colorDomainMax)

      // dimensions and margins
      var margin = {top: 100, right: 40, bottom: 100, left: 150},
      width = 1200 - margin.left - margin.right,
      height = 1200 - margin.top - margin.bottom;

      // Pan and zoom
      var zoom = d3.zoom()
          .scaleExtent([0, 30])
          .extent([[0, 0], [width, height]])
          .on("zoom", zoomed);

      // append the svg object to the body of the page
      var svg = d3.select("#scatterPlot")
      .append("svg")
      // .attr("class", "scatterPlotDimension")
      .attr("width", width + margin.left + margin.right)
      .attr("height",900)
      .call(zoom)
      .append("g")
      .attr("transform",
            `translate(${margin.right + 10},${margin.top})`);

            // LEGEND
    // select the svg area
    // const legendSvg = d3.select("#legend")
    // Handmade legend
    // svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#4BA15E").attr("transform", "translate(200,-100)")
    svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#A7CDD9").attr("transform", "translate(0,-220)")
    svg.append("text").attr("x", 220).attr("y", 130).text("Male Life Expectency (Age) fm 2000 - 2012").style("font-size", "20px").attr("alignment-baseline","middle").attr("transform", "translate(200,-100)")
    svg.append("text").attr("x", -400).attr("y", 30).text("Population Total fm 2000 - 2012").style("font-size", "20px").attr("alignment-baseline","middle").attr("transform", "translate(-300,100)").attr("transform", "rotate(-90)")


      const spToolTip = d3.select("#scatterTooltip")
      .append("div")
      .style("opacity", 0)
      .style("position", "relative")
      // .attr("class", "tooltip")
      .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(d) {
          let yearString = `${d["Year"]}`;
          // let life = d["Country"] ? d["Life Expectancy Male"] : "n/a";
          let country = `${d["Country"] ? d["Country"] : "n/a"}`;
          let Co2Emmissions = `${d["CO2 Emissions"]}`;
          let population = `${d["Population Total"]}`;
          let year =  `${d["Year"] ? d["Year"] : "n/a"}`;
          // let x = `${d3.mouse(this)[0]}px`;
          // console.log(x)
          // console.log(`Country: ${country}<br> Population: ${population}`)
          spToolTip
          .style("opacity", 1)
          .style("position", "relative")
          // .attr("class", "tooltip")
          // .style("padding", "5px")
            .html(`Country: ${country} <br> Population:${population} rec: ${year}`)
            // .style("left", (d3.mouse(this)[0]-450) + "px")
            // .style("top", (d3.mouse(this)[1]+100) + "px")
            .style("left", (d3.mouse(this)[0]-350) + "px")
            .style("top", (d3.mouse(this)[1]+160) + "px")
            .style("color", "white")
          d3.select(this)
          .style("stroke", "red")
          .style("fill", "yellow")
          .style("opacity", 0.8)
          // .style("cursor", "pointer"); 
         
        }
        const mousemove = function(d) {
          
        }
        const mouseleave = function() {
          // console.log("mouseout")
          spToolTip
            .style("opacity", 0)
          d3.select(this)
          .transition().duration(1000)
          .style("fill", `${color}`)
          .style("opacity", 0.3)
          .style("pointer-events", "visibleFill")
        }

      // create scale objects
      var xScale = d3.scaleLinear()
        // .domain([0, d3.max(data, d => parseFloat(d["Life Expectancy Male"]))])
        .domain( d3.extent(data, d => parseFloat(d["Life Expectancy Male"])))
        .range([0, width]);
      var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => parseFloat(d["Population Total"])/100)])
        // .domain( d3.extent(data, d => parseFloat(d["Population Total"])))
        .range( [0, 1000])

        // console.log(yScale.domain())
      // create axis objects
      var xAxis = d3.axisTop(xScale)
        .ticks(20)
        .tickSize(-height)
      var yAxis = d3.axisLeft(yScale)
        .ticks(50)
        .tickFormat((d) => `${d}`)
        .tickSize(-width)
        
      // Draw Axis
      var gX = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(xAxis);
      var gY = svg.append('g')
      .attr("height", height)
        .attr("padding", 1.2)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(yAxis);

       // Add a clipPath: everything out of this area won't be drawn.
      var clip = svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

      // Color scale: give me a specie name, I return a color
      var color = d3.scaleOrdinal([`#383867`, `#584c77`, `#33431e`, `#a36629`, `#92462f`, `#b63e36`, `#b74a70`, `#946943`]);
      // Draw Datapoints
      var points_g = svg.append("g")
        .attr("clip-path", "url(#clip)")
        .attr("width", width)
        .attr("height", height)
        .style("stroke", "#181818")
        .style("fill", "#F0C207")
        .style("pointer-events", "none")
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .classed("points_g", true)
        .call(zoom)
     
      var points = points_g.selectAll("circle")
        .data(data);
        // console.log(data)
      points = points.enter().append("circle")
        .attr('cx', function(d) {return xScale(parseFloat(d["Life Expectancy Male"]) ? parseFloat(d["Life Expectancy Male"]) : 0)})
        .attr('cy', function(d) {return yScale(parseFloat(d["CO2 Emissions"]) ? parseFloat(d["CO2 Emissions"]) : 0)})
        .attr('r', 10)
        
        .style("fill", `${color}`)
        .style("opacity", 0.3)
        .style("stroke", `${color}`)
        .style("pointer-events", "fill")
        .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

      function zoomed() {
      // create new scale ojects based on event
          var new_xScale = d3.event.transform.rescaleX(xScale);
          var new_yScale = d3.event.transform.rescaleY(yScale);
      // update axes
          gX.call(xAxis.scale(new_xScale));
          gY.call(yAxis.scale(new_yScale));
          points.data(data)
          .attr('cx', function(d) {return new_xScale(parseFloat(d["Life Expectancy Male"]) ? parseFloat(d["Life Expectancy Male"]) : 0)})
          .attr('cy', function(d) {return new_yScale(parseFloat(d["CO2 Emissions"]) ? parseFloat(d["CO2 Emissions"]) : 0)})
      }
    })
  }

}
