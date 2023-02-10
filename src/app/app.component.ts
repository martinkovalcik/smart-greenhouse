import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import "firebase/database";
import {Subscription, timer} from "rxjs";
import {map, share} from "rxjs/operators";
import {FirebaseService} from "./services/firebase.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'smartgreenhouse';
  rxTime = new Date();
  intervalId: string | number | NodeJS.Timer | undefined;
  subscription: Subscription | undefined;
  weatherData:any;
  actualWeather:any;
  sunrise_hour:any;
  sunset_hour:any;
  time_hour:any;

  @Output() isLogout = new EventEmitter<void>()
  constructor(public firebaseService: FirebaseService) {
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
    this.actualWeather = new Array(this.weatherData.weather[0].main)
    this.actualWeather=this.actualWeather.toString();

    let sunsetTime = new Date(this.weatherData.sys.sunset*1000);
    let sunriseTime = new Date(this.weatherData.sys.sunrise*1000);
    this.weatherData.sunset_time = sunsetTime.toLocaleTimeString();
    this.weatherData.sunrise_time = sunriseTime.toLocaleTimeString();

    this.sunrise_hour=sunriseTime.getHours();
    this.sunset_hour=sunsetTime.getHours();
  }

  // @ts-ignore
  changeBackground():number{
    if (((this.sunrise_hour>=this.time_hour) || (this.sunset_hour<=this.time_hour)) && (this.actualWeather!='Rain')){
      return 0;
    }
    else {
      return 1;
    }
  }

  ngOnInit(){
    this.getWeatherData();
    // Using RxJS Timer
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        //let minuts = this.rxTime.getMinutes();
        //let seconds = this.rxTime.getSeconds();
        this.time_hour=this.rxTime.getHours();
        //let a = time.toLocaleString('en-US', { hour: 'numeric', hour12: false });
        //let NewTime = hour + ":" + minuts + ":" + seconds
        this.rxTime = time;
      });
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  logout(){
    this.firebaseService.logout()
    this.isLogout.emit()
  }

}

