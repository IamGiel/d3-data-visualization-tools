import { Component, OnInit, Input, Output, EventEmitter, AfterContentInit } from '@angular/core';
import {FormGroup, FormControl, Validators } from '@angular/forms'
import * as d3 from 'd3';
import { dropdown } from  './dropdown';
import { select } from 'd3';




@Component({
  selector: 'app-dropdown-menu',
  // templateUrl: './dropdown-menu.component.html',
  styleUrls: ['./dropdown-menu.component.css'],
  template: 
  `
  <div id="dropDown"></div>
    <br>
      <h3>VS</h3>
    <br>
  <div id="dropDown2"></div>
  `
})

export class DropdownMenuComponent implements OnInit, AfterContentInit {

  @Input() dataValues;
  @Output() onChange = new EventEmitter()
  constructor() {}

  ngOnInit() { 

    let data;
    let xColumn;
    let yColumn;

    const onXColumnClicked = column => {
      xColumn = column;
      // render();
    };

    const onYColumnClicked = column => {
      yColumn = column;
      // render();
    };

    this.render()
   
  }

  render(){
    d3.csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
      .then(info => {
        this.dataValues = info;

        select('#dropDown').call(dropdown, {
          options: this.dataValues.columns,
          onOptionsClicked: column => {
            console.log(column)
          }
        })

        select('#dropDown2').call(dropdown, {
          options: this.dataValues.columns,
          onOptionsClicked: column => {
            console.log(column)
          }
        })
      })
  }

  ngAfterContentInit(){}



}
