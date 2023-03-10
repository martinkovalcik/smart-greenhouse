import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import "firebase/database";
import {Subscription} from "rxjs";
import {FirebaseService} from "./services/firebase.service";
import {TransferDataService} from "./services/transfer-data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [],
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'smartgreenhouse';
  subscription_data: Subscription=new Subscription();
  intervalId: string | number | NodeJS.Timer | undefined;
  subscription: Subscription | undefined;
  actualWeather:any;
  sunrise_hour:any;
  sunset_hour:any;
  time_hour:any;

  @Output() isLogout = new EventEmitter<void>()
  constructor(public firebaseService: FirebaseService,private transferData: TransferDataService) {
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
    this.subscription_data=this.transferData.modelTimerCurrent.subscribe(data=>{
      this.time_hour = data.time.getHours();
    })
    this.subscription_data=this.transferData.modelWeatherCurrent.subscribe(data=>{

      this.actualWeather = new Array(data.weather.weather[0].main)
      this.actualWeather=this.actualWeather.toString();

      let sunsetTime = new Date(data.weather.sys.sunset*1000);
      let sunriseTime = new Date(data.weather.sys.sunrise*1000);
      data.weather.sunset_time = sunsetTime.toLocaleTimeString();
      data.weather.sunrise_time = sunriseTime.toLocaleTimeString();

      this.sunrise_hour=sunriseTime.getHours();
      this.sunset_hour=sunsetTime.getHours();

    })
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

