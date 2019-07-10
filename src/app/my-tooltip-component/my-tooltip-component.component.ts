import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-my-tooltip-component',
  templateUrl: './my-tooltip-component.component.html',
  styleUrls: ['./my-tooltip-component.component.css']
})
export class MyTooltipComponentComponent implements OnInit {
  // IMyDatum)
  @Input() myDatum;
 
  // Outputs work as well!
  @Output() update: EventEmitter;
  
  constructor() { }

  ngOnInit() {

  }

}
