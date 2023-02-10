import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DataTransfer} from "../models/data-transfer.model";

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  constructor() { }

  private modelData = new Subject<DataTransfer>()
  modelDataCurrent = this.modelData.asObservable();

  changeData(model:DataTransfer){
    this.modelData.next(model);
  }
}
