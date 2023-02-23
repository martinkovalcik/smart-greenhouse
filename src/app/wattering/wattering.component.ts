import { Component, OnInit } from '@angular/core';
import {TransferDataService} from "../services/transfer-data.service";
import {Subscription} from "rxjs";
import {DataTransfer} from "../models/data-transfer.model";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Component({
  selector: 'app-wattering',
  templateUrl: './wattering.component.html',
  styleUrls: ['./wattering.component.scss']
})
export class WatteringComponent implements OnInit {

  subscription_data: Subscription=new Subscription();
  water:boolean | undefined;
  water_tank:boolean=false;

  constructor(private transferData: TransferDataService,private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.subscription_data=this.transferData.modelDataWatteringCurrent.subscribe(data=>{
      this.water=data.wattering;
      let ahoj: DataTransfer = new DataTransfer();
      ahoj.wattering = this.water;

    })
  }

  wattering(){
    this.water=!this.water;
    this.db.object("Lubotice/Config/wattering").set({wattering:this.water})
    window.location.reload();
  }

}
