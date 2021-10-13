import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from './user/user';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [],
})
export class AppComponent implements OnInit, OnDestroy {
  users: User[] = [];
  title = 'home-work';
  date: string = '';
  arrObservables: Subscription[] = [];
  private readonly subscriptions = new Subscription();

  constructor() {}

  ngOnInit(): void {
    const source = interval(1000);
    /* this.arrObservables['timer'] = source.subscribe()...; */
    /* ngOndetroy() {
      loop array > unsubscribe()
    } */
    /* Subject > complete() */
    this.subscriptions.add (source.subscribe(() => {
      this.date = moment().format("dddd, Do MMMM YYYY, h:mm:ss a");
    }));
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
