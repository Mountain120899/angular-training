import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';

import { User } from './user';

@Injectable()
export class UsersService {
  usersUrl = '../../assets/users.json';  

  constructor(
    private http: HttpClient,
  ) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.usersUrl)
  }

}
  