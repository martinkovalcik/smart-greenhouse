import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import "firebase/database";
import {ActualData} from "../models/actual-data";
import {TransferDataService} from "../services/transfer-data.service";
import {DataTransfer} from "../models/data-transfer.model";
import {Wattering} from "../models/wattering.model";

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
  weatherData: any;
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
    this.getActualData();
    this.getWeatherData();
    this.getWatteringData()
    //let ahoj: DataTransfer = new DataTransfer();
    //ahoj.skuska = 5


  }


  getWeatherData() {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=49.00&lon=21.27&exclude=current&appid=ce9a38b3d31df31375946b72bd17f0b3')
      .then(response => response.json())
      .then(data => {
        this.setWeatherData(data);
        console.log(data);
      });
  }

  setWeatherData(data: any) {
    this.weatherData = data;
    this.actualWeather = new Array(this.weatherData.weather[0].main)
    let sunsetTime = new Date(this.weatherData.sys.sunset * 1000);
    let sunriseTime = new Date(this.weatherData.sys.sunrise * 1000);
    this.weatherData.sunset_time = sunsetTime.toLocaleTimeString();
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
    this.weatherData.sunrise_time = sunriseTime.toLocaleTimeString();
    let currentDate = new Date();
    this.weatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.temperatureWeather = (this.weatherData.main.temp - 273.15).toFixed(0);
    this.humidityWeather = this.weatherData.main.humidity
    this.weatherData.temp_min = (this.weatherData.main.temp_min - 273.15).toFixed(0);
    this.weatherData.temp_max = (this.weatherData.main.temp_max - 273.15).toFixed(0);
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
    let ahoj: DataTransfer = new DataTransfer();
    ahoj.moisture = this.moisture;
    this.transferData.changeDataMoisture(ahoj)
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

