import { Component, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { FirebaseService } from './service/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  someDataHere;
    // importJSON = dataJson;
    // data = `../d3charts/sample-data.json`;
    data = [];
    data2: any[];
    // data:any = 'https://unpkg.com/us-atlas@1.0.2/us/10m.json';
    @ViewChild('graphContainer') graphContainer: ElementRef;

    constructor(private mapService: FirebaseService) {}

    ngOnInit() {}
    ngAfterContentInit() {

        this.mapService.getCutomerOrder().subscribe(data => {
            let xdata = data.map(e => {
                return { ...e.payload.doc.data() };
            });

            console.log(xdata);
            this.data = xdata;

            // select svg container
            const svg = d3.select('#graphContainer');

            const margin = { top: 20, right: 20, bottom: 100, left: 100 };
            const graphWidth = 600 - margin.left - margin.right;
            const graphHeight = 600 - margin.top - margin.bottom;

            const graph = svg
                .append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate( ${margin.left}, ${margin.right})`);

            const xAxisGroup = graph.append('g').attr('transform', `translate(0, ${graphHeight})`);
            const yAxisGroup = graph.append('g');

            // scale the y axis
            const y = d3.scaleLinear().range([graphHeight, 0]);

            // scale the x axis
            const x = d3
                .scaleBand()
                .range([0, 500])
                .paddingInner(0.2)
                .paddingOuter(0.4);

            const xAxis = d3.axisBottom(x);
            const yAxis = d3
                .axisLeft(y)
                .ticks(10)
                .tickFormat(d => d + ' orders');
            console.log(xAxis, yAxis);

            // define transition
            const t = d3.transition().duration(500);

            // =========== update data ===========
            const update1stGraph = orange => {
                orange = 'orange'
                // update scales
                y.domain([0, d3.max(this.data, d => d.orders)]);
                x.domain(this.data.map(item => item.name));

                // join data
                const rect = graph.selectAll('rect').data(this.data);
                // remove entries when data is updated
                rect.exit().remove();

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
                    .transition(t)
                    .attr('height', d => graphHeight - y(d.orders))
                    .attr('y', d => y(d.orders));

                // call axes
                xAxisGroup.call(xAxis);
                yAxisGroup.call(yAxis);

                xAxisGroup
                    .selectAll('text')
                    .attr('transform', 'rotate(-35)')
                    .attr('text-anchor', 'end');
                    
                // this.update(orange)
                rect.on("mouseover", function(){
                    d3.select(this)
                        .attr("opacity", .5)
                        .attr('fill', 'red')
                }).on("mouseout", function(){
                    d3.select(this)
                        .attr("opacity", 1)
                        .attr('fill', orange)
                });
            };
           
            update1stGraph(this.data);
        });

        // ========== service fetch another data =============
        this.mapService.getCutomerStat().subscribe(data => {
            let xdata = data.map(e => {
                return { ...e.payload.doc.data() };
            });

            console.log(xdata);
            this.data2 = xdata;

            // select svg container
            const svg2 = d3.select('#graphContainer2');

            const margin = { top: 20, right: 20, bottom: 100, left: 100 };
            const graphWidth = 600 - margin.left - margin.right;
            const graphHeight = 600 - margin.top - margin.bottom;

            const graph2 = svg2
                .append('g')
                .attr('width', graphWidth)
                .attr('height', graphHeight)
                .attr('transform', `translate( ${margin.left}, ${margin.right})`);

            const xAxisGroup2 = graph2.append('g');
            const yAxisGroup2 = graph2.append('g').attr('transform', `translate(0, ${graphWidth})`);

            // scale the y axis
            // const y = d3.scaleLinear().range([graphHeight, 0]);
            const y = d3.scaleBand()
            .range([0, 200])
            .paddingInner(0.2)
            .paddingOuter(0.4);

            // scale the x axis
            const x = d3.scaleLinear().range([0, graphWidth]);

            const xAxis = d3.axisBottom(y).tickFormat(d => d + ' health');
            const yAxis = d3
                .axisLeft(x)
                .ticks(10)
                .tickFormat(d => d + ' age');
            console.log(xAxis, yAxis);

            // define transition
            const t = d3.transition().duration(500);

            // =========== update data ===========
            const update2ndGraph = blue => {
                blue = 'lightblue'
                // update scales
                y.domain([0, d3.max(this.data2, d => d.age)]);
                x.domain(this.data2.map(item => item.name));

                // join data
                const rect = graph2.selectAll('rect').data(this.data2);
                // remove entries when data is updated
                rect.exit().remove();

                rect
                    // .attr('width', x.bandwidth)
                    // .attr('fill', 'lightblue')
                    // .attr('x', d => x(d.name))
                    // .attr('height', 0)
                    // .attr('y', graphHeight)
                    .attr('width', 0)
                    .attr('height', y.bandwidth)
                    .attr('fill', 'lightblue')
                    .attr('x', graphHeight)
                    .attr('y', d => y(d.name))

                rect
                    .enter()
                    .append('rect')
                    .attr('width', 0)
                    .attr('height', y.bandwidth)
                    .attr('y', d => y(d.name))
                    .attr('fill', 'lightblue')
                    .attr('x', graphHeight)
                    // .merge(rect)
                    .transition(t)
                    .attr('width', d => graphHeight - x(d.age))
                    .attr('x', d => x(d.age));

                // call set axes and tick labels
                xAxisGroup2.call(xAxis);
                yAxisGroup2.call(yAxis);

                xAxisGroup2
                    .selectAll('text')
                    .attr('transform', 'rotate(-35)')
                    .attr('text-anchor', 'end');
                // this.update(blue);
                rect.on("mouseover", function(){
                    graph2
                        .attr("opacity", .5)
                        .attr('fill', 'lightpurple')
                }).on("mouseout", function(){
                    graph2
                        .attr("opacity", 1)
                        .attr('fill', blue)
                });
            };
           
            update2ndGraph(this.data2);
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

    update(orignalColor){

        d3.selectAll("rect").on("mouseover", function(){
            d3.select(this)
                .attr("opacity", .5)
                .attr('fill', 'lightpurple')
        }).on("mouseout", function(){
            d3.select(this)
                .attr("opacity", 1)
                .attr('fill', orignalColor)
        });
    }
}
