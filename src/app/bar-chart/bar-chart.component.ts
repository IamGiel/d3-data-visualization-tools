import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit, AfterContentInit {

  CustomerData;

  constructor() { }

  ngOnInit() {
  }
  ngAfterContentInit(){
    // ==========@@@@@@@@@@ service fetch another data for HORIZONTAL bar chart @@@@@@@@@@@@=============
        // this.mapService.getCutomerOrder().subscribe(data => {
        //     let xdata = data.map(e => {
        //         return { ...e.payload.doc.data() };
        //     });

        // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then((data)=>{
          d3.csv("https://iamgiel.github.io/resume/assets/world3.csv").then((data)=>{ 
            this.CustomerData = data;
            console.log(this.CustomerData)

            // select svg container
            // const svg = d3.select('#graphContainer');
            const svg = d3.select("#LPUgraph").append("svg");
            //set graph height and width
            const margin = { top: 200, right: 200, bottom: 300, left: 200 };
            const graphWidth = 1200;
            const graphHeight = margin.bottom + d3.max(this.CustomerData, d => d["Country"].length * 1000) + margin.top;
            console.log(graphHeight)
            // build Graph height and width
            const graph = svg
                .style("font", "18px times")
                .attr('width', graphWidth + margin.right)
                .attr('height', graphHeight)
                .append('g')
                .attr('transform', `translate( ${margin.left}, ${margin.right})`)
            // set the axis labels
            const xAxisGroup = graph.append('g');
            const yAxisGroup = graph.append('g');
            // labels the y axis
            const y = d3.scaleBand()
              .domain(this.CustomerData.map(d => d["Country"]))
              .range([0, 10000])
              .paddingInner(0.2)
              .paddingOuter(0.5)

              // console.log(this.CustomerData.map(d => d["Year"]))
              // console.log(this.CustomerData.map(d => d["Life Expectancy Male"]))

            // label the x axis
            const x = d3.scaleLinear()
              .domain([0, 100])
              // .range([0, d3.max(this.CustomerData, d => d["Life Expectancy Male"] * 10)]) // going up ascend
              .range([0,graphWidth - 400]) // going up ascend

              console.log(d3.max(this.CustomerData, d => d["Life Expectancy Male"]))
            const xAxis =  d3.axisTop(x).ticks(20).tickFormat((d) => `${d}yrs Life expectancy`)
            const yAxis = d3
              .axisLeft(y) // tick labels on y 

            // define transition
            const t = d3.transition().duration(500);

            // =========== update data ===========
            const update1stGraph = orange => {
                orange = 'orange'
                // update scales
                // x.domain([0, d3.max(this.CustomerData, d => d["Life Expectancy Male"])]);
                // y.domain(this.CustomerData.map(item => item.Country)); // values you want to vertically be projected by each graph
                // join data
                const rect = graph.selectAll('rect').data(this.CustomerData)
                
                 // remove un-needed entries when data is updated
                 rect.exit().remove();

                  // create a tooltip
                const tooltip = d3.select("#my_dataviz")
                .append("div")
                  .style("position", "relative")
                  .style("visibility", "visible")
                  // .text("show tooltip here")
                 
                rect
                    .attr('height', y.bandwidth)
                   .style("font", "18px times")
                    .attr('width', 0) // starting height of the bar
                    .attr('y', d3.max(this.CustomerData, d => d["Life Expectancy Male"]))
                    .attr('fill', 'orange')
                    .attr('y', d => y(d["Country"])) // fills the bar per group
                rect
                    .enter()
                    .append('rect')
                   .style("font", "18px times")
                    .attr('height', y.bandwidth)
                    .attr('width', 0) // starting height of the bar
                    .attr('y', d3.max(this.CustomerData, d => d["Life Expectancy Male"]))
                    .attr('fill', 'orange')
                    .attr('y', d => y(d["Country"]))
                    // .merge(rect)
                    .on('mouseover', function(d, i, n) {
                      d3.select(this)
                      .attr('fill', "#E9C5A6")
                      let event:any = window.event; // to get the x and y axis of our cursor
                      let showValue = d["Life Expectancy Male"];
                      let showGroup = d["Country"];
                      console.log(`${showValue} at ${showGroup} in year ${d["Year"]}`)
                      return tooltip
                        // .attr("transform", `translate(${d["Country"] + 5},0)` )
                        .style("pointer-events", "none")
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("top", `${event.clientX}px!important`)
                        .style("left",`${event.clientY}px!important`)
                        .html(`Country: ${showGroup}<br> Males Life Expectancy:  ${showValue}<br> in the year:  ${d["Year"]}`);
                    })
                    .on("mousemove", function(event){
                      event = window.event || event;
                      return tooltip
                        // .attr("transform", `translate(${1000},0)` )
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("left", (d3.mouse(this)[0]-200) + "px")
                        .style("top",(d3.mouse(this)[1]+200) + "px")
                    })
                    .on('mouseout', function() {
                      d3.select(this)
                      .attr('fill', "orange")
                      return tooltip.style("visibility", "hidden");
                      
                    })
                    // cant call mouseover events after the .transtion - so move it here:
                    .transition(t)
                    .attr('width', d => x(d["Life Expectancy Male"]))
                    // .attr('x', 0)
                    
                // call axes
                xAxisGroup.call(xAxis);
                yAxisGroup.call(yAxis);

                xAxisGroup
                    .selectAll('text')
                    .style("margin-top", 100)
                    .attr('transform', 'rotate(-45)')
                    .attr('text-anchor', 'start');
            };
           
            update1stGraph(this.CustomerData);
        });
  }

}
