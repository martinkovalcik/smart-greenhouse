import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DataTransfer} from "../models/data-transfer.model";
import {Wattering} from "../models/wattering.model";
import {Timer} from "../models/timer.model";
import {Weather} from "../models/weather.model";

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  constructor() { }

  private modelData = new Subject<DataTransfer>()
  modelDataCurrent = this.modelData.asObservable();

  private modelDataWater = new Subject<Wattering>()
  modelDataWatteringCurrent = this.modelDataWater.asObservable();

  private modelTimer = new Subject<Timer>()
  modelTimerCurrent = this.modelTimer.asObservable();

  private modelWeather = new Subject<Weather>()
  modelWeatherCurrent = this.modelWeather.asObservable();

  changeDataMoisture(model:DataTransfer){
    this.modelData.next(model);
  }

  changeDataWattering(model:Wattering){
    this.modelDataWater.next(model);
  }

  changeTimer(model:Timer){
    this.modelTimer.next(model);
  }
  changeWeather(model:Weather){
    this.modelWeather.next(model);
  }
}
