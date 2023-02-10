import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  rxTime = new Date();
  intervalId: string | number | NodeJS.Timer | undefined;
  subscription: Subscription | undefined;

  constructor() {

  }

  ngOnInit() {
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        //let hour = this.rxTime.getHours();
        //let minuts = this.rxTime.getMinutes();
        //let seconds = this.rxTime.getSeconds();
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
}
