import { Component, OnInit } from '@angular/core';
import {TransferDataService} from "../services/transfer-data.service";
import {Subscription} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Wattering} from "../models/wattering.model";

@Component({
  selector: 'app-wattering',
  templateUrl: './wattering.component.html',
  styleUrls: ['./wattering.component.scss']
})
export class WatteringComponent implements OnInit {

  subscription_data: Subscription=new Subscription();
  water:boolean | undefined;
  userNotLogged:any;

  constructor(private transferData: TransferDataService,private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.userNotLogged = !localStorage.getItem("email");

    this.subscription_data=this.transferData.modelDataWatteringCurrent.subscribe(data=>{
      this.water=data.wattering;
      let voda: Wattering = new Wattering();
      voda.wattering = this.water;

    })
  }

  wattering(){
    this.water=!this.water;
    this.db.object("Lubotice/Config/wattering").set({wattering:this.water,wattering_request:this.water})
    window.location.reload();
  }

}
