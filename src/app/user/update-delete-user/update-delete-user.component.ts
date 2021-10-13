import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { Subject } from 'rxjs';


import { User } from '../user';

@Component({
  selector: 'app-update-delete-user',
  templateUrl: './update-delete-user.component.html',
  styleUrls: ['./update-delete-user.component.css']
})
export class UpdateDeleteUserComponent implements OnInit {
  description = 'Update User';
  currentUser!: User;
  userForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    birthday: new FormControl(''),
    gender: new FormControl(''),
    average: new FormControl(''),
  });
  subjectKeyUp = new Subject<number>();

  constructor(private dialogRef: MatDialogRef<UpdateDeleteUserComponent>, @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {
      this.currentUser = this.data.users.filter((user:User) => user._id == this.data.id)[0];
      this.userForm.patchValue({
        id: this.data.id,
        name: this.currentUser.name,
        address: this.currentUser.address,
        phone: this.currentUser.phone,
        birthday: this.currentUser.birthday,
        gender: this.currentUser.gender,
        average: this.currentUser.average
      });
  }
  update() {
    this.dialogRef.close(this.userForm.value);
  }
  close() {
    this.dialogRef.close({id : -1});
  }
}
