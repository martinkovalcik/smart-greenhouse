import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wattering',
  templateUrl: './wattering.component.html',
  styleUrls: ['./wattering.component.scss']
})
export class WatteringComponent implements OnInit {

  water:boolean=false;
  water_tank:boolean=false;

  constructor() { }

  ngOnInit(): void {
  }

}
