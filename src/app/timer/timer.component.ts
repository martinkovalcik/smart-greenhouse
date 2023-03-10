import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { map, share } from "rxjs/operators";
import {Timer} from "../models/timer.model";
import {TransferDataService} from "../services/transfer-data.service";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  rxTime = new Date();
  intervalId: string | number | NodeJS.Timer | undefined;
  subscription: Subscription | undefined;

  constructor(private transferData: TransferDataService) {

  }

  ngOnInit() {
    this.subscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });

    let cas: Timer = new Timer();
    cas.time = this.rxTime;
    this.transferData.changeTimer(cas)

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
