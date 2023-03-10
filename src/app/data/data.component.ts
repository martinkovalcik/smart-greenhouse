import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import "firebase/database";
import {ActualData} from "../models/actual-data";
import {TransferDataService} from "../services/transfer-data.service";
import {DataTransfer} from "../models/data-transfer.model";
import {Wattering} from "../models/wattering.model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [],
})
export class DataComponent implements OnInit {
  title = 'smartgreenhouse';
  public _actualDataList: ActualData[] | undefined;
  public _watteringDataList: Wattering[] | undefined;
  subscription_data: Subscription=new Subscription();
  actualWeather: any;
  humidityWeather: any;
  temperatureWeather: any;
  sunrise: any;
  sunset: any;
  toggle: number | undefined;
  moisture: any;
  wattering: any;
  wattering_request: any;
  water_tank:any;
  userNotLogged:any;

  constructor(private db: AngularFireDatabase, private transferData: TransferDataService) {
  }

  ngOnInit() {
    if(!localStorage.getItem("email")){
      this.toggle = 1;
      this.userNotLogged=true;
    }else{
      this.toggle = 0;
      this.userNotLogged=false;
    }
    this.subscription_data=this.transferData.modelWeatherCurrent.subscribe(data=>{
      this.actualWeather = new Array(data.weather.weather[0].main)
      let sunsetTime = new Date(data.weather.sys.sunset * 1000);
      let sunriseTime = new Date(data.weather.sys.sunrise * 1000);
      data.weather.sunset_time = sunsetTime.toLocaleTimeString();
      if (sunriseTime.getMinutes() <= 9) {
        this.sunrise = sunriseTime.getHours() + ":0" + sunriseTime.getMinutes();
      } else {
        this.sunrise = sunriseTime.getHours() + ":" + sunriseTime.getMinutes();
      }

      if (sunsetTime.getMinutes() <= 9) {
        this.sunset = sunsetTime.getHours() + ":0" + sunsetTime.getMinutes();
      } else {
        this.sunset = sunsetTime.getHours() + ":" + sunsetTime.getMinutes();
      }
      data.weather.sunrise_time = sunriseTime.toLocaleTimeString();
      let currentDate = new Date();
      data.weather.isDay = (currentDate.getTime() < sunsetTime.getTime());
      this.temperatureWeather = (data.weather.main.temp - 273.15).toFixed(0);
      this.humidityWeather = data.weather.main.humidity
      data.weather.temp_min = (data.weather.main.temp_min - 273.15).toFixed(0);
      data.weather.temp_max = (data.weather.main.temp_max - 273.15).toFixed(0);
    });
    this.getActualData();
    this.getWatteringData();
  }

  async getActualData() {
    let data: ActualData[];
    await this.getActualDataFromDB().then(value => {
      data = value as ActualData[];

    });
    // @ts-ignore
    this._actualDataList = data;
    this.moisture = this._actualDataList[0].moisture
    this.moisture = (100 - ((this.moisture / 770) * 100))
    this.moisture = parseFloat(this.moisture.toFixed(0))
    this.water_tank = this._actualDataList[0].water_tank
    let vlhkost_pody: DataTransfer = new DataTransfer();
    vlhkost_pody.moisture = this.moisture;
    this.transferData.changeDataMoisture(vlhkost_pody)
  }

  async getWatteringData() {
    let data: Wattering[];
    await this.getWatteringFromDB().then(value => {
      data = value as Wattering[];
    });
    // @ts-ignore
    this._watteringDataList = data;
    this.wattering=this._watteringDataList[0].wattering
    this.wattering_request=this._watteringDataList[0].wattering_request
    let voda: Wattering = new Wattering();
    voda.wattering = this.wattering
    voda.wattering_request = this.wattering_request;
    this.transferData.changeDataWattering(voda)
  }

  getActualDataFromDB() {
    return new Promise((resolve) => {
      this.db.list("Lubotice/Actual").valueChanges().subscribe(value => {
        resolve(value);
      });
    });
  }



  getWatteringFromDB() {
    return new Promise((resolve) => {
      this.db.list("Lubotice/Config").valueChanges().subscribe(value => {
        resolve(value);
      });
    });
  }

}

