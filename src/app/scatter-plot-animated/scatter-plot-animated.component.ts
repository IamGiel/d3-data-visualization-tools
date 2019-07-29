import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot-animated',
  templateUrl: './scatter-plot-animated.component.html',
  styleUrls: ['./scatter-plot-animated.component.css']
})
export class ScatterPlotAnimatedComponent implements OnInit, AfterContentInit {
  // test = "I LOVE MY TEAM MATES!!!!"
  constructor() { }

  ngOnInit() {
  }
  ngAfterContentInit(){
    
    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
      .then(info => {
        const data:any = info;

          // const svg = d3.select('svg');

        const svg = d3.select("#scatterPlotAnimated").append("svg");

        //set graph height and width
        const margin = { top: 200, right: 200, bottom: 300, left: 200 };
        const graphWidth = 1200;
        const graphHeight = data.map((d) => d["Country"]);
        console.log(graphHeight.length)
        // build Graph height and width
        const graph = svg
          .style("font", "18px times")
          .attr('width', graphWidth + margin.right)
          .attr('height', graphHeight.length * 2)
          .append('g')
          .attr('transform', `translate( ${margin.left}, ${margin.right})`)

          const width = +svg.attr('width');
          const height = +svg.attr('height');

            const title = 'Cars: Horsepower vs. Weight';

            const xValue = d => parseInt(d["horsepower"]);
            const xAxisLabel = 'Horsepower';

            const yValue = d => parseInt(d["weight"]);
            const circleRadius = 10;
            const yAxisLabel = 'Weight';
            // const margin = { top: 60, right: 40, bottom: 88, left: 150 };
            const innerWidth = width - margin.left - margin.right;
            const innerHeight = height - margin.top - margin.bottom;

            const xScale = d3.scaleLinear()
              // .domain(d3.extent(data, xValue))
              .domain(d3.extent(data, xValue))
              .range([0, innerWidth])
              .nice();

        console.log(xScale.domain())

            const yScale = d3.scaleLinear()
              .domain(d3.extent(data, yValue))
              .range([innerHeight, 0])
              .nice();

            const g = svg.append('g')
              .attr('transform', `translate(${margin.left},${margin.top})`);

            const xAxis = d3.axisBottom(xScale)
              .tickSize(-innerHeight)
              .tickPadding(15);

            const yAxis = d3.axisLeft(yScale)
              .tickSize(-innerWidth)
              .tickPadding(10);

            const yAxisG = g.append('g').call(yAxis);
            yAxisG.selectAll('.domain').remove();

            yAxisG.append('text')
              .attr('class', 'axis-label')
              .attr('y', -93)
              .attr('x', -innerHeight / 2)
              .attr('fill', 'black')
              .attr('transform', `rotate(-90)`)
              .attr('text-anchor', 'middle')
              .text(yAxisLabel);

            const xAxisG = g.append('g').call(xAxis)
              .attr('transform', `translate(0,${innerHeight})`);

            xAxisG.select('.domain').remove();

            xAxisG.append('text')
              .attr('class', 'axis-label')
              .attr('y', 75)
              .attr('x', innerWidth / 2)
              .attr('fill', 'black')
              .text(xAxisLabel);

            g.selectAll('circle').data(data)
              .enter().append('circle')
              .attr('cy', data => yScale(yValue(data)))
              .attr('cx', data => xScale(xValue(data)))
              .attr('r', circleRadius);

            g.append('text')
              .attr('class', 'title')
              .attr('y', -10)
              .text(title);
          
      });

  }

}
