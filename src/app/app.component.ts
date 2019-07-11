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

    ngOnInit() {
    }
    
    
    ngAfterContentInit() {

        this.mapService.getCutomerOrder().subscribe(data => {
            let xdata = data.map(e => {
                return { ...e.payload.doc.data() };
            });

            console.log(xdata);
            this.CustomerData = xdata;

            // select svg container
            const svg = d3.select('#graphContainer');

            // these values will help us to not hard code min and max for domain and ranges
            const min = d3.min(this.CustomerData, d=> d.orders)
            const max = d3.max(this.CustomerData, d=> d.orders)
            const extent = d3.extent(this.CustomerData, d => d.orders )
            console.log(min, max, extent)

            const margin = { top: 20, right: 20, bottom: 100, left: 100 };
            const graphWidth = 600 - margin.left - margin.right;
            const graphHeight = 600 - margin.top - margin.bottom;

            const graph = svg
                .append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate( ${margin.left}, ${margin.right})`)

            const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`);
            const yAxisGroup = graph.append('g');

            // scale the y axis
            // const y = d3.scaleLinear().range([graphHeight, 0]);
            const y = d3.scaleLinear().range([graphHeight, 0]);

            // scale the x axis
            const x = d3
                .scaleBand()
                .range([0, 500]) // how thick the bar is
                .paddingInner(0.2)
                .paddingOuter(0.4);

            const xAxis = d3.axisBottom(x);
            const yAxis = d3
                .axisLeft(y) // tick labels on y 
                .ticks(10)
                .tickFormat(d => d + ' orders');
            console.log(xAxis, yAxis);

            // define transition
            const t = d3.transition().duration(500);

            // =========== update data ===========
            const update1stGraph = orange => {
                orange = 'orange'
                // update scales
                y.domain([0, d3.max(this.CustomerData, d => d.orders)]);
                x.domain(this.CustomerData.map(item => item.name));

                console.log(y.domain([0, d3.max(this.CustomerData, d => d.orders)]))

                // join data
                const rect = graph.selectAll('rect').data(this.CustomerData)
                
                 // remove entries when data is updated
                 rect.exit().remove();

                  // create a tooltip
                const tooltip = d3.select("#my_dataviz")
                .append("div")
                  .style("position", "relative")
                  .style("visibility", "visible")
                  // .text("show tooltip here")
                 
                rect
                    .attr('width', x.bandwidth)
                    .attr('height', 0)
                    .attr('y', graphHeight)
                    .attr('fill', 'orange')
                    .attr('x', d => x(d.name))
                rect
                    .enter()
                    .append('rect')
                    .attr('width', x.bandwidth)
                    .attr('height', 0)
                    .attr('y', graphHeight)
                    .attr('fill', 'orange')
                    .attr('x', d => x(d.name))
                    // .merge(rect)
                    .on('mouseover', function(d, i, n) {
                      d3.select(this)
                      .attr('opacity', 0.5)
                      let event:any = window.event;
                      let showName = d.name;
                      let showAge = d.orders;
                      console.log(`${event.clientX}px!important and ${event.clientY}px!important`)
                      return tooltip
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("top", `${event.clientX}px!important`)
                        .style("left",`${event.clientY}px!important`)
                      .text(`${showName}, Orders: ${showAge}`);
                    })
                    .on("mousemove", function(event){
                      event = window.event || event; 
                      console.log(` X: ${d3.mouse(this)[0]},Y: ${d3.mouse(this)[1]}`)
                      console.log(`clientX: ${event.clientX}px, ClientY: ${event.clientY}px`)
                      return tooltip
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("left", (d3.mouse(this)[0]-200) + "px")
                        .style("top",(d3.mouse(this)[1]-20) + "px")
                    })
                    .on('mouseout', function() {
                      // console.log("tooltip mouse out")
                      d3.select(this).attr('opacity', 1).attr('class', '')
                      return tooltip.style("visibility", "hidden");
                      
                    })
                    // cant call mouseover events after the .transtion
                    .transition(t)
                    .attr('height', d => graphHeight - y(d.orders))
                    .attr('y', d => y(d.orders))
                    
                // call axes
                xAxisGroup.call(xAxis);
                yAxisGroup.call(yAxis);

                xAxisGroup
                    .selectAll('text')
                    .attr('transform', 'rotate(-35)')
                    .attr('text-anchor', 'end');
            };
           
            update1stGraph(this.CustomerData);
        });

        // ========== service fetch another data for HORIZONTAL bar chart =============
        this.mapService.getCutomerStat().subscribe(data => {
            let xdata = data.map(e => {
                return { ...e.payload.doc.data() };
            });

            console.log(xdata);
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
            console.log(min, max, extent)

            const graph2 = svg2
                .append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate( ${margin.left}, ${margin.top})`);

            const xAxisGroup2 = graph2.append('g');
            const yAxisGroup2 = graph2.append('g');

            const y = d3.scaleBand()
              .domain(this.HealthData.map(d => d.name))
              .range([0, 500])
              .paddingInner(0.2)
              .paddingOuter(10)

             
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
                // update scales
                // x.domain(this.HealthData.map(item => item.age))
                // y.domain(this.HealthData.map(item => item.age));

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
                      console.log(`${event.clientX}px!important and ${event.clientY}px!important`)
                      return tooltip
                        .style("visibility", "visible")
                        .style("position", "absolute!important")
                        .style("top", `${event.clientX}px!important`)
                        .style("left",`${event.clientY}px!important`)
                      .text(`${showName}, ${showAge}`);
                    })
                    .on("mousemove", function(event){
                      event = window.event || event; 
                      console.log(` X: ${d3.mouse(this)[0]},Y: ${d3.mouse(this)[1]}`)
                      console.log(`clientX: ${event.clientX}px, ClientY: ${event.clientY}px`)
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
