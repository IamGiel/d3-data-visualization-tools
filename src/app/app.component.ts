import { Component, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import * as d3 from 'd3';

import { FirebaseService } from './service/firebase.service';
import { MyTooltipComponentComponent } from './my-tooltip-component/my-tooltip-component.component';
import { max } from 'd3';

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
            const margin = { top: 200, right: 200, bottom: 300, left: 200 };
            // const graphWidth = margin.right + d3.max(this.CustomerData, d => d["Life Expectancy Male"]) + margin.left;
            const graphHeight = margin.bottom + d3.max(this.CustomerData, d => d["Country"].length * 1000) + margin.top;
            console.log(graphHeight)
            // build Graph height and width
            const graph = svg
                .style("font", "18px times")
                .attr('width', 1200)
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

        // ==========@@@@@@@@@@ service fetch another data for HEAT MAP chart @@@@@@@@@@@@=============
        // this.mapService.getCutomerStat().subscribe(data => {
          // let xdata = data.map(e => {
          //     return { ...e.payload.doc.data() };
          // });
          // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then((data)=>{
          d3.csv("https://iamgiel.github.io/resume/assets/world3.csv").then((data)=>{ 
            // console.log(data)
            this.CustomerData = data;

                // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
                const yAxes = d3.map(this.CustomerData, function(d){return d["Country"];}).keys()
                const xAxes = d3.map(this.CustomerData, function(d){return d["Year"]}).keys()
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
          .data(this.CustomerData, function(d) {return d["Country"]+':'+d["Year"];})
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

          // ==========@@@@@@@@@@ service fetch another data for SCATTER PLOT MAP chart @@@@@@@@@@@@=============

          d3.csv("https://iamgiel.github.io/resume/assets/world3.csv").then((data2)=>{ 
          // d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv").then((data2) => {
            console.log(data2)
            let data = data2;

            
            let max = d3.max(data, function(d){
              return parseFloat(d["Population Total"])
            }); // maximum of x and y
              console.log(max)

            let colorDomainMin = d3.min(data, function(d){
              let yearString = `${d["Year"]}`;
              let year = `${yearString.substring(5)}`;
              return year ? year : "2000";
            }); // maximum of x and y
              console.log(colorDomainMin)

            let colorDomainMax = d3.max(data, function(d){
              return d["Year"].substring(5);
            }); // maximum of x and y
              console.log(colorDomainMax)

            // dimensions and margins
            var margin = {top: 100, right: 40, bottom: 100, left: 150},
            width = 1200 - margin.left - margin.right,
            height = 1200 - margin.top - margin.bottom;

            // Pan and zoom
            var zoom = d3.zoom()
                .scaleExtent([.1, 50])
                .extent([[0, 0], [width, height]])
                .on("zoom", zoomed);

            // append the svg object to the body of the page
            var svg = d3.select("#scatterPlot")
            .append("svg")
            .attr("class", "scatterPlotDimension")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(zoom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

                  // LEGEND
          // select the svg area
          // const legendSvg = d3.select("#legend")
          // Handmade legend
          // svg.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#4BA15E").attr("transform", "translate(200,-100)")
          svg.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#A7CDD9").attr("transform", "translate(0,-220)")
          svg.append("text").attr("x", 220).attr("y", 130).text("Male Life Expectency (Age)").style("font-size", "20px").attr("alignment-baseline","middle").attr("transform", "translate(200,-100)")
          svg.append("text").attr("x", -400).attr("y", 30).text("CO2 Emmissions").style("font-size", "20px").attr("alignment-baseline","middle").attr("transform", "translate(-300,100)").attr("transform", "rotate(-90)")


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
                let population = `${d["Population Total"]}`;
                let year =  `${d["Year"] ? d["Year"] : "n/a"}`;
                let x = `${d3.mouse(this)[0]}px`;
                console.log(x)
                console.log(`Country: ${country}<br> Population: ${population}`)
                d3.select(this)
                .style("stroke", "red")
                .style("fill", "white")
                .style("opacity", 0.8)
                .style("cursor", "pointer"); 
                spToolTip
                .style("opacity", 1)
                .style("position", "relative")
                // .attr("class", "tooltip")
                .style("padding", "5px")
                  .html(`Country: ${country} <br> Recorded Year: ${year}`)
                  // .style("left", (d3.mouse(this)[0]-450) + "px")
                  // .style("top", (d3.mouse(this)[1]+100) + "px")
                  .style("left", (d3.mouse(this)[0]-350) + "px")
                  .style("top", (d3.mouse(this)[1]+160) + "px")
                  .style("color", "white")
              }
              const mousemove = function(d) {
              
              }
              const mouseleave = function() {
                console.log("mouseout")
                spToolTip
                  .style("opacity", 0)
                d3.select(this)
                  .style("stroke", "white")
                  .style("opacity", 0.8)
                  .style("fill", "#A694E8")
                  .style("cursor", "default"); 
              }

            // create scale objects
            var xScale = d3.scaleLinear()
              .domain([0, 100])
              .range([0, width]);
            var yScale = d3.scaleLinear()
              .domain([0, 1000])
              .range([height, 0]);
            // create axis objects
            var xAxis = d3.axisTop(xScale)
              .ticks(20, "s");
            var yAxis = d3.axisLeft(yScale)
              .ticks(20, "s");
            // Draw Axis
            var gX = svg.append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
              .call(xAxis);
            var gY = svg.append('g')
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
            var color = d3.scaleOrdinal()
            .domain(["10", "100"])
            .range([ "white", "pink", "brown", "red", "orange", "purple", "blue", "green", "lightgreen", "lightred", "lightorange", "black"])

            // Draw Datapoints
            var points_g = svg.append("g")
              .attr("clip-path", "url(#clip)")
              .attr("width", width)
              .attr("height", height)
              .style("fill", `${color}`)
              .style("pointer-events", "visibleFill")
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
              
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
              .attr("clip-path", "url(#clip)")
              .classed("points_g", true)
              .call(zoom)
           
            var points = points_g.selectAll("circle")
              .data(data);
              console.log(data)
            points = points.enter().append("circle")
              .attr('cx', function(d) {return xScale(parseFloat(d["Life Expectancy Male"]) ? parseFloat(d["Life Expectancy Male"]) : 0)})
              .attr('cy', function(d) {return yScale(parseInt(d["CO2 Emissions"]) ? parseInt(d["CO2 Emissions"]) : 0)})
              .attr('r', 10)
              
              .style("fill", `${color}`)
              .style("opacity", 0.3)
              .style("stroke", `${color}`)
              .style("pointer-events", "visibleFill")
              .on("mouseover", mouseover)
              .on("mousemove", mousemove)
              .on("mouseleave", mouseleave)

            function zoomed() {
            // create new scale ojects based on event
                var new_xScale = d3.event.transform.rescaleX(xScale);
                var new_yScale = d3.event.transform.rescaleY(yScale);
            // update axes
                gX.call(xAxis.scale(new_xScale));
                gY.call(yAxis.scale(new_yScale));
                points.data(data)
                .attr('cx', function(d) {return new_xScale(parseInt(d["Life Expectancy Male"]) ? parseInt(d["Life Expectancy Male"]) : 0)})
                .attr('cy', function(d) {return new_yScale(parseInt(d["CO2 Emissions"]) ? parseInt(d["CO2 Emissions"]) : 0)})
            }
          })
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



//  // ==========@@@@@@@@@@ service fetch another data for HEAT MAP chart @@@@@@@@@@@@=============
//         // this.mapService.getCutomerStat().subscribe(data => {
//           // let xdata = data.map(e => {
//           //     return { ...e.payload.doc.data() };
//           // });
//           // d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv").then((data)=>{
//             d3.csv("https://iamgiel.github.io/resume/assets/world3.csv").then((data)=>{ 
//               // console.log(data)
//               this.CustomerData = data;
  
//                   // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
//                   const yAxes = d3.map(this.CustomerData, function(d){return d["Country"];}).keys()
//                   const xAxes = d3.map(this.CustomerData, function(d){return d["Year"]}).keys()
//                   console.log(xAxes)
  
//             const margin = { top: 180, right: 100, bottom: 20, left: 200 };
//             const graphWidth = yAxes.length*100 + margin.left + margin.right;
//             const graphHeight = xAxes.length*10000 - margin.top - margin.bottom;
  
//             // append the svg object to the body of the page
//             const graph = d3.select("#heat-map")
//               .append("svg")
//               .attr("width", graphWidth)
//               .attr("height", graphHeight)
//               // .attr("margin-top", 600)
//               .append("g")
//               .attr("transform",
//                     "translate(" + margin.left + "," + margin.top  + ")");
  
//             // LEGEND
//             // select the svg area
//             // const legendSvg = d3.select("#legend")
//             // Handmade legend
//             graph.append("circle").attr("cx",200).attr("cy",130).attr("r", 6).style("fill", "#4BA15E").attr("transform", "translate(0,-220)")
//             graph.append("circle").attr("cx",200).attr("cy",160).attr("r", 6).style("fill", "#A7CDD9").attr("transform", "translate(0,-220)")
//             graph.append("text").attr("x", 220).attr("y", 130).text("Towards 100: Longer Life Expectency").style("font-size", "15px").attr("alignment-baseline","middle").attr("transform", "translate(0,-220)")
//             graph.append("text").attr("x", 220).attr("y", 160).text("N/A or Shorter Life Expectency").style("font-size", "15px").attr("alignment-baseline","middle").attr("transform", "translate(0,-220)")
  
//             // Build X scales and axis:
//             const x = d3.scaleBand()
//               .range([ 0, 750 ])
//               .domain(xAxes)
//               .padding(0.05);
              
//             graph.append("g")
//               .style("font-size", 20)
//               .attr("transform", "translate(0," + 0 + ")")
//               .call(d3.axisTop(x).tickSize(12).tickFormat((d) => `${d}`))
  
//             // Build Y scales and axis:
//             const y = d3.scaleBand()
//               .range([ 0, 3000 ])
//               .domain(yAxes)
//               .padding(0.05);
              
//             graph.append("g")
//               .style("font-size", 15)
//               .attr("transform", "translate(0," + 0 + ")")
//               .call(d3.axisLeft(y).tickSize(12))
  
//             // Build color scale
  
//             // let grey = () =>  {
//             //   if()
//             // }
//             const myColor = d3.scaleLinear<any>()
//             .range(["#A5CAD6", "green"])
//             .domain([0, 100])
          
  
//             // select tool tip div
//             const hmToolTip = d3.select("#heatmap-tooltip")
//               .style("opacity", 0)
//               .style("position", "relative")
//               // .attr("class", "tooltip")
//               .style("padding", "5px")
  
//             // Three function that change the tooltip when user hover / move / leave a cell
//             const mouseover = function(d) {
//               // let yearString = `${d["Year"]} or ${yearString.substring(5)}`;
//               let population = `${d["Population Total"]}`
//               let life = d["Life Expectancy Male"] ? d["Life Expectancy Male"] : "n/a";
//               // console.log(yearString.substring(5))
//               hmToolTip
//               .style("opacity", 1)
//                 .html(`Life Expectancy <br> Male: ${life} <br> Population : ${population}`)
//                 .style("left", (d3.mouse(this)[0]-400) + "px")
//                 .style("top", (d3.mouse(this)[1]+120) + "px")
//                 .style("color", "white")
//               d3.select(this)
//                 .style("stroke", "yellow")
//                 .style("opacity", 1)
//             }
//             const mousemove = function(d) {
              
//             }
//             const mouseleave = function(d) {
//               hmToolTip
//                 .style("opacity", 0)
//               d3.select(this)
//                 .style("stroke", "none")
//                 .style("opacity", 0.8)
//             }
  
//             // add the squares
//             graph.selectAll()
//             .data(this.CustomerData, function(d) {return d["Country"]+':'+d["Year"];})
//             .enter()
//             .append("rect")
//               .attr("x", function(d) { return x(d["Year"] ) }) // allows to spread the square diagonally across the chart
//               .attr("y", function(d) { return y(d["Country"])}) // allows to spread the square diagonally across the chart
//               .attr("rx", 4)
//               .attr("ry", 4)
//               .attr("width", x.bandwidth() )
//               .attr("height", y.bandwidth() )
//               .style("fill", function(d) { return myColor(d["Life Expectancy Male"])} ) // scale color here defined above
//               .style("stroke-width", 4)
//               .style("stroke", "none")
//               .style("opacity", 0.8)
//             .on("mouseover", mouseover)
//             .on("mousemove", mousemove)
//             .on("mouseleave", mouseleave)
              
//             })