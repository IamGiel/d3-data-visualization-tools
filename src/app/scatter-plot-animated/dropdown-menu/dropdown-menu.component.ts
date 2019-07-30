import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms'
import * as d3 from 'd3';
import { dropdown } from  './dropdown';
import { select } from 'd3';
import { scatterPlot } from './scatter-plot';



@Component({
  selector: 'app-dropdown-menu',
  // templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  template: 
  `
      <div id="dropDown"></div>
       
          <h3>VS</h3>
      <div id="dropDown2"></div>

      <hr>

       <svg id="animateDots" width="960" height="450"></svg>

    
   
    
  `
})

export class DropdownMenuComponent implements OnInit, AfterContentInit {

  @Input() dataValues;
  @Output() onChange = new EventEmitter()

  xColumn;
  yColumn;
  
  constructor() {}

  ngOnInit() {

    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
      .then(data => {

      this.xColumn = data.columns[4];
      this.yColumn = data.columns[0];
      })
  
  
  }

  render(){


    const svg = select('#animateDots');
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    let data;

    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
      .then(loadedData => {
        data = loadedData;
        this.dataValues = loadedData;


        data.forEach(d => {
          d.mpg = +d.mpg;
          d.cylinders = +d.cylinders;
          d.displacement = +d.displacement;
          d.horsepower = +d.horsepower;
          d.weight = +d.weight;
          d.acceleration = +d.acceleration;
          d.year = +d.year;
        });
        

        select('#dropDown').call(dropdown, {
          options: this.dataValues.columns,
          onOptionsClicked: this.onXColumnClicked
        })

        select('#dropDown2').call(dropdown, {
          options: this.dataValues.columns,
          onOptionsClicked: this.onYColumnClicked
        })

        svg.call(scatterPlot, {
          xValue: d => d[this.xColumn],
          xAxisLabel: this.xColumn,
          yValue: d => d[this.yColumn],
          circleRadius: 10,
          yAxisLabel: this.yColumn,
          margin: { top: 10, right: 40, bottom: 88, left: 150 },
          width,
          height,
          data
        });



       
       

        
      })
  }

  onXColumnClicked = column => {
    console.log(column)
    this.xColumn = column;
    this.render();
  };

  onYColumnClicked = column => {
    console.log(column)
    this.yColumn = column;
    this.render();
  };

  ngAfterContentInit(){
    this.render()
  }



}
