import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('');
  confirmPassword = new FormControl('');
  hidePassword = true;
  hideConfirmPassword = true;
  invalid = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  signUp() {
    let author = true;
    if(this.email.hasError('required')) {
      author = false;
    }
    if(this.confirmPassword.value !== this.password.value){
      this.invalid = true;
      author = false;
    }
    if(author) {
      this.router.navigate(['/users', { email: this.email.value }]);
    }
  }
}
