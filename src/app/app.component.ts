import { Component, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import * as d3 from 'd3';

import { FirebaseService } from './service/firebase.service';
import { MyTooltipComponentComponent } from './my-tooltip-component/my-tooltip-component.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  someDataHere;
    // importJSON = dataJson;
    // data = `../d3charts/sample-data.json`;
    CustomerData = [];
    HealthData: any[];
    tooltip;
    // data:any = 'https://unpkg.com/us-atlas@1.0.2/us/10m.json';
    @ViewChild('graphContainer') graphContainer: ElementRef;

    constructor(
      private mapService: FirebaseService
      ) {}

    ngOnInit() {}
    ngAfterContentInit() {

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
            const margin = { top: 100, right: 200, bottom: 100, left: 200 };
            const graphWidth = margin.right + d3.max(this.CustomerData, d => d["Life Expectancy Male"] * 88) + margin.left;
            const graphHeight = margin.bottom + d3.max(this.CustomerData, d => d["Country"].length * 250) + margin.top;
            console.log(graphHeight)
            // build Graph height and width
            const graph = svg
                
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .append('g')
                .attr('transform', `translate( ${margin.left}, ${margin.right})`)
            // set the axis labels
            const xAxisGroup = graph.append('g');
            const yAxisGroup = graph.append('g');
            // labels the y axis
            const y = d3.scaleBand()
              .domain(this.CustomerData.map(d => d["Country"]))
              .range([0, graphHeight])
              .paddingInner(0.2)
              .paddingOuter(0.5)

              console.log(this.CustomerData.map(d => d["Year"]))
              console.log(this.CustomerData.map(d => d["Life Expectancy Male"]))

            // label the x axis
            const x = d3.scaleLinear()
              .domain([0, d3.max(this.CustomerData, d => d["Life Expectancy Male"])])
              .range([0, d3.max(this.CustomerData, d => d["Life Expectancy Male"] * 10)]) // going up ascend
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
                    .attr('width', 0) // starting height of the bar
                    .attr('y', d3.max(this.CustomerData, d => d["Life Expectancy Male"]))
                    .attr('fill', 'orange')
                    .attr('y', d => y(d["Country"])) // fills the bar per group
                rect
                    .enter()
                    .append('rect')
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

        // ==========@@@@@@@@@@ service fetch another data for HORIZONTAL bar chart @@@@@@@@@@@@=============
        this.mapService.getCutomerStat().subscribe(data => {
            let xdata = data.map(e => {
                return { ...e.payload.doc.data() };
            });

            // console.log(xdata);
            this.HealthData = xdata;

            // select svg container
            const svg2 = d3.select('#graphContainer2');

            const margin = { top: 100, right: 100, bottom: 20, left: 100 };
            const graphWidth = 600 - margin.left - margin.right;
            const graphHeight = 600 - margin.top - margin.bottom;

            // these values will help us to not hard code min and max for domain and ranges
            const min = d3.min(this.HealthData, d=> d.age)
            const max = d3.max(this.HealthData, d=> d.age)
            const extent = d3.extent(this.HealthData, d => d.age )
            // console.log(min, max, extent)

            const graph2 = svg2
                .append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate( ${margin.left}, ${margin.top})`);
            // set the axis labels
            const xAxisGroup2 = graph2.append('g');
            const yAxisGroup2 = graph2.append('g');
            // labels the y axis
            const y = d3.scaleBand()
              .domain(this.HealthData.map(d => d.name))
              .range([0, 500])
              .paddingInner(0.2)
              .paddingOuter(10)

            // label the x axis 
            const x = d3.scaleLinear()
              .domain([0, max])
              .range([0, graphWidth])

            const yAxis = d3.axisLeft(y)
            const xAxis = d3.axisTop(x)
              .tickFormat((d) => 'age: ' + d)
            // console.log(xAxis, yAxis);

            // define transition
            const t = d3.transition().duration(500);

            // =========== update data ===========
            const update2ndGraph = purple => {
                purple = '#6B4CD8'
                // join data
                const rect = graph2.selectAll('rect').data(this.HealthData);
                // remove entries when data is updated
                rect.exit().remove();

                 // create a tooltip
                 const tooltip = d3.select("#my_dataviz")
                 .append("div")
                   .style("position", "relative")
                   .style("visibility", "visible")
                   // .text("show tooltip here")
                rect
                    .attr('height', y.bandwidth)
                    .attr('width', 0)
                    .attr('fill', `${purple}`)
                    .attr('y', (d) => y(d.name) )
                rect
                    .enter()
                    .append('rect')
                    .attr('height', y.bandwidth)
                    .attr('width', 0)
                    .attr('fill', `${purple}`)
                    .attr('y', (d) => y(d.name) )
                    .on('mouseover', function() {
                      d3.select(this).attr('opacity', 0.5)
                    }).on('mouseout', function() {
                      d3.select(this).attr('opacity', 1)
                    })
                    .on('mouseover', function(d, i, n) {
                      d3.select(this)
                      .attr('opacity', 0.5)
                      let event:any = window.event;
                      let showName = d.name;
                      let showAge = d.age;
                      // console.log(`${event.clientX}px!important and ${event.clientY}px!important`)
                      return tooltip
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("top", `${event.clientX}px!important`)
                        .style("left",`${event.clientY}px!important`)
                      .text(`${showName}, ${showAge}`);
                    })
                    .on("mousemove", function(event){
                      event = window.event || event; 
                      // console.log(` X: ${d3.mouse(this)[0]},Y: ${d3.mouse(this)[1]}`)
                      // console.log(`clientX: ${event.clientX}px, ClientY: ${event.clientY}px`)
                      return tooltip
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("left", (d3.mouse(this)[0]-200) + "px")
                        .style("top",(d3.mouse(this)[1]+690) + "px")
                    })
                    .on('mouseout', function() {
                      // console.log("tooltip mouse out")
                      d3.select(this).attr('opacity', 1).attr('class', '')
                      return tooltip.style("visibility", "hidden");
                    })
                    .transition(t)
                    .attr('width', d => x(d.age))
                    .attr('x', 0)

                // call set axes and tick labels
                xAxisGroup2.call(xAxis)
                yAxisGroup2.call(yAxis);

                xAxisGroup2
                    .selectAll('text')
                    .attr('transform', 'rotate(-35)')
                    .attr('text-anchor', 'start');
            };
           
            update2ndGraph(this.HealthData);
        });

        // ==========@@@@@@@@@@ service fetch another data for HEAT MAP chart @@@@@@@@@@@@=============
        // this.mapService.getCutomerStat().subscribe(data => {
          // let xdata = data.map(e => {
          //     return { ...e.payload.doc.data() };
          // });
          d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then((data)=>{
            console.log(data)
            this.CustomerData = data;
          // select svg container
          const svg2 = d3.select('#graphContainer2');

          const margin = { top: 100, right: 100, bottom: 20, left: 100 };
          const graphWidth = 600 - margin.left - margin.right;
          const graphHeight = 600 - margin.top - margin.bottom;

          // append the svg object to the body of the page
          const svg = d3.select("#heat-map")
          .append("svg")
            .attr("width", graphWidth + margin.left + margin.right)
            .attr("height", graphHeight + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

                const graph3 = svg2
                .append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate( ${margin.left}, ${margin.top})`);

                // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
                const xAxes = d3.map(this.CustomerData, function(d){return d.group;}).keys()
                const yAxes = d3.map(this.CustomerData, function(d){return d.variable;}).keys()

                // Build X scales and axis:
                const x = d3.scaleBand()
                  .range([ 0, graphWidth ])
                  .domain(xAxes)
                  .padding(0.05);
                svg.append("g")
                  .style("font-size", 15)
                  .attr("transform", "translate(0," + graphHeight + ")")
                  .call(d3.axisBottom(x).tickSize(0))
                  // .select(".domain").remove()

                // Build Y scales and axis:
                const y = d3.scaleBand()
                  .range([ graphHeight, 0 ])
                  .domain(yAxes)
                  .padding(0.05);
                svg.append("g")
                  .style("font-size", 15)
                  // .attr("transform", "translate(0," + graphHeight + ")")
                  .call(d3.axisLeft(y).tickSize(0))
                  // .select(".domain").remove()

                // Build color scale
                const myColor = d3.scaleLinear<string>()
                  // .domain([1, 40]) // specify the range of the scale typically align this close to the data sets
                  // .range(["#6A4DD8", "#EFEDFC"]);
                  .range(["white", "#69b3a2"])
                  .domain([1,100])

                // select tool tip div
                const hmToolTip = d3.select("#heatmap-tooltip")
                  // .append("div")
                  .style("opacity", 0)
                  .style("position", "relative")
                  .attr("class", "tooltip")
                  // .style("background-color", "white")
                  // .style("border", "solid")
                  // .style("border-width", "2px")
                  // .style("border-radius", "5px")
                  .style("padding", "5px")

                // Three function that change the tooltip when user hover / move / leave a cell
                const mouseover = function(d) {
                  hmToolTip
                    .style("opacity", 1)
                  d3.select(this)
                    .style("stroke", "yellow")
                    .style("opacity", 1)
                }
                const mousemove = function(d) {
                  hmToolTip
                    .html(`Company: ${d.group}, Risk Level: ${d.value} in Release: ${d.variable}`)
                    .style("left", (d3.mouse(this)[0]-200) + "px")
                    .style("top", (d3.mouse(this)[1]+40) + "px")
                    .style("color", "#6A4DD9")
                }
                const mouseleave = function(d) {
                  hmToolTip
                    .style("opacity", 0)
                  d3.select(this)
                    .style("stroke", "none")
                    .style("opacity", 0.8)
                }

                // add the squares
                svg.selectAll()
                .data(this.CustomerData, function(d) {return d.group+':'+d.variable;})
                .enter()
                .append("rect")
                  .attr("x", function(d) { return x(d.group) }) // allows to spread the square diagonally across the chart
                  .attr("y", function(d) { return y(d.variable) }) // allows to spread the square diagonally across the chart
                  .attr("rx", 4)
                  .attr("ry", 4)
                  .attr("width", x.bandwidth() )
                  .attr("height", y.bandwidth() )
                  .style("fill", function(d) { return myColor(d.value)} ) // scale color here defined above
                  .style("stroke-width", 4)
                  .style("stroke", "none")
                  .style("opacity", 0.8)
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
            
          })

        // }) 

    }

    handleMouseEventsOn = (d, i, n) => {
        console.log(n[i]);
        d3.select(n[i])
            .transition()
            .duration(300)
            .attr('fill', '#fff')
    };

    handleMouseEventsOut = (d, i, n) => {
        console.log(n[i]);
        d3.select(n[i])
            .transition()
            .duration(300)
            .attr('fill', 'red')
    };

    
}
