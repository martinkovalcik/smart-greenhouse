import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import { Moon } from "lunarphase-js";
import {TransferDataService} from "../services/transfer-data.service";
import {Weather} from "../models/weather.model";

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy{
  subscription_data: Subscription=new Subscription();
  intervalId: string | number | NodeJS.Timer | undefined;
  subscription: Subscription | undefined;
  weather: number | undefined;
  hours: number | undefined;
  weatherData:any;
  actualWeather:any;
  time_hour:any;
  sunrise_hour:any;
  sunset_hour:any;



  constructor(private transferData: TransferDataService) {
  }

  getWeatherData(){
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=49.00&lon=21.27&exclude=current&appid=ce9a38b3d31df31375946b72bd17f0b3')
      .then(response=>response.json())
      .then(data=>{
        this.setWeatherData(data);
      });
  }
  setWeatherData(data: any){
    this.weatherData = data;

    let pocasie: Weather = new Weather();
    pocasie.weather = this.weatherData;
    this.transferData.changeWeather(pocasie)

    this.actualWeather = new Array(this.weatherData.weather[0].main)
    this.actualWeather=this.actualWeather.toString();

    let sunsetTime = new Date(this.weatherData.sys.sunset*1000);
    let sunriseTime = new Date(this.weatherData.sys.sunrise*1000);
    this.weatherData.sunset_time = sunsetTime.toLocaleTimeString();
    this.weatherData.sunrise_time = sunriseTime.toLocaleTimeString();

    this.sunrise_hour=sunriseTime.getHours();
    this.sunset_hour=sunsetTime.getHours();

  }

  MoonMethod():number | any{
    let moon=Moon.lunarPhase();
    if(moon=="New"){
      return 0;
    }
    else if(moon=="Waxing Crescent" || moon=="First Quarter" || moon=="Waxing Gibbous" ){
      return 1;
    }
    else if(moon=="Full"){
      return 2;
    }
    else {
      return 3;
    }
  }
  WeatherMethod():number{
    if((this.sunrise_hour<=this.time_hour) && (this.sunset_hour>=this.time_hour)){
      return 0;
    }
    else{
      return 1;
    }
  }

  ngOnInit() {

    this.subscription_data=this.transferData.modelTimerCurrent.subscribe(data=>{
      this.time_hour = data.time.getHours();
      this.weather=data.time.getDate();
    })
    this.getWeatherData();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
