import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef} from "@angular/material/dialog";


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  description = 'Create New User';
  userForm = new FormGroup({
    name: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    birthday: new FormControl(''),
    gender: new FormControl(''),
    average: new FormControl(''),
  });
  constructor(
    private dialogRef: MatDialogRef<CreateUserComponent>
  ){}

  ngOnInit(): void {
  }

  save() {
    this.dialogRef.close(this.userForm.value);
  }
  close() {
    this.dialogRef.close();
  }

}
