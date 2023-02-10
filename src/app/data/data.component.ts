import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import "firebase/database";
import {ActualData} from "../models/actual-data";
import {HistoricalData} from "../models/historical-data";
import {TransferDataService} from "../services/transfer-data.service";
import {DataTransfer} from "../models/data-transfer.model";

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss'],
  providers: [],
})
export class DataComponent implements OnInit {
  title = 'smartgreenhouse';
  public _actualDataList: ActualData[] | undefined;
  public _historicalDataList: HistoricalData[] | undefined;
  weatherData: any;
  actualWeather: any;
  humidityWeather: any;
  temperatureWeather: any;
  sunrise: any;
  sunset: any;
  toggle: number | undefined;
  moisture: any;

  constructor(private db: AngularFireDatabase, private transferData: TransferDataService) {

    //this.db.object("users/1").set({id: 1, name: "martinko", phone: "0905789456"});
  }

  ngOnInit() {
    this.toggle = 0;
    this.getActualData();
    this.getHistoricalData();
    this.getWeatherData();
    let ahoj: DataTransfer = new DataTransfer();
    ahoj.skuska = 5
    this.transferData.changeData(ahoj)

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
  }

  async getHistoricalData() {
    let data: HistoricalData[];
    await this.getHistoricalDataFromDB().then(value => {
      data = value as HistoricalData[];
    });
    // @ts-ignore
    this._historicalDataList = data;
  }

  getActualDataFromDB() {
    return new Promise((resolve) => {
      this.db.list("Lubotice/Actual").valueChanges().subscribe(value => {
        resolve(value);
      });
    });
  }

  getHistoricalDataFromDB() {
    return new Promise((resolve) => {
      this.db.list("Lubotice/Historical").valueChanges().subscribe(value => {
        resolve(value);
      });
    });
  }

}
