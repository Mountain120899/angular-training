import { Injectable } from '@angular/core';

import { User } from '../user/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  active = false;
  constructor() { }

  checkActive(username:string, password: string, users: User[]){
    let currentUser = users.find(user => {
      return user.email === username && user.password === password;
    });
    currentUser ? this.active = true : this.active = false; 
  }
}
