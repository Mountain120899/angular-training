import { Component, OnDestroy, OnInit } from '@angular/core';

import { User } from './user/user';
import { interval, Subscription } from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  users: User[] = [];
  title = 'home-work';
  date: string = '';
  arrObservables: Subscription[] = [];
  private readonly subscriptions = new Subscription();

  constructor() {}

  ngOnInit() {
    const source = interval(1000);
    this.subscriptions.add (source.subscribe(() => {
      this.date = moment().format("dddd, Do MMMM YYYY, h:mm:ss a");
    }));
    console.log('cc');
  }

  ngOnDestroy(){
    this.subscriptions.unsubscribe();
  }
}
