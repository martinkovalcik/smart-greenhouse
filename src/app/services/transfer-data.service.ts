import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DataTransfer} from "../models/data-transfer.model";
import {Wattering} from "../models/wattering.model";

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  constructor() { }

  private modelData = new Subject<DataTransfer>()
  modelDataCurrent = this.modelData.asObservable();

  private modelDataWater = new Subject<Wattering>()
  modelDataWatteringCurrent = this.modelDataWater.asObservable();

  changeDataMoisture(model:DataTransfer){
    this.modelData.next(model);
  }

  changeDataWattering(model:Wattering){
    this.modelDataWater.next(model);
  }
}
