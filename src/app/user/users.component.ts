import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime, switchMap} from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';

import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { UserOptions } from 'jspdf-autotable';

import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateDeleteUserComponent } from './update-delete-user/update-delete-user.component';
import { UsersService } from './users.service';
import { User } from './user';


interface jsPDFWithPlugin extends jspdf.jsPDF {
  autoTable : (options: UserOptions) => jspdf.jsPDF;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UsersService],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  fieldSearch = true;
  keySearch = new FormControl('');
  numberUserChecked = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedFilter = 'gender';
  allComplete = false;
  selectedGender = 'male';
  cityList:string[] = [];
  currentUser: string = '';
  options = new FormGroup({
    gender: new FormControl(),
    city: new FormControl()
  });
  objectChecked = {};
  checkedFormGroup!: FormGroup;
  searchTerm$: Subject<string> = new Subject();
  hide = true;
  formHideColumn:FormGroup = new FormGroup({
    check: new FormControl(false),
    id: new FormControl(false),
    name: new FormControl(false),
    address: new FormControl(false),
    phone: new FormControl(false),
    birthday: new FormControl(false),
    gender: new FormControl(false),
    average: new FormControl(false),
    more: new FormControl(false)
  });

  formSettingMenu:FormGroup = new FormGroup({
    export: new FormControl(false),
    create: new FormControl(false),
    filter: new FormControl(false),
  });

  dataSource!: MatTableDataSource<User>;
  displayedColumnsArray: string[] = ['check', 'id' ,'name', 'address', 'phone', 'birthday', 'gender', 'average', 'more'];

  constructor(private dialog: MatDialog, private usersService: UsersService, private route: ActivatedRoute, fb: FormBuilder) {
    this.checkedFormGroup = fb.group({});
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getDisplayedColumns(){
    let temp: string[] = ['check', 'id' ,'name', 'address', 'phone', 'birthday', 'gender', 'average', 'more'];
    this.displayedColumnsArray = temp.filter(item => !this.formHideColumn.get(item)?.value);
    if(this.displayedColumnsArray.length < 9){
      this.hide = false;
    }
    else{
      this.hide = true;
    }
  }

  downLoadPDF(){
    const doc = new jspdf.jsPDF('portrait', 'px', 'a4') as jsPDFWithPlugin;
    let temp : [string[]] = [[]];
    /* this.users.forEach(user => temp.push(Object.values(user))); */
    for(let key in this.checkedFormGroup.value){
       if(this.checkedFormGroup.value[key]){
        temp.push(Object.values(this.users[parseInt(key) - 1]));
       }
    }
    
    temp.splice(0,1);
    doc.autoTable({
      head:[['ID', 'NAME', 'ADDRESS', 'PHONE', 'BIRTHDAY', 'GENDER', 'AVERAGE']],
      body:temp
    })
    doc.save("UserTable.pdf"); 
  }

  getUsers(): void {
    this.usersService.getUsers()
      .subscribe(users => {
        this.users = users;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.users.forEach(
          item => {
            this.cityList.push(item.address);
          }
        );
        this.cityList = Array.from(new Set(this.cityList)); 
        this.route.paramMap.pipe(
          switchMap((params: ParamMap) =>
          params.get('email')!
        )).subscribe(x => {this.currentUser += x});
        //deal form checked
        users.map(user => {
          this.checkedFormGroup.addControl(user._id.toString(), new FormControl(false));
        })
      }); 
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    let listTrue = this.dataSource.filteredData.reduce((acc, user) => {
      return {...acc, [user._id]:true}
    }, {});
    let listFalse = this.users.filter(user => !this.dataSource.filteredData.includes(user)).reduce((acc, user) => {
      return {...acc, [user._id]:false}
    }, {});
    let listAllFalse = this.dataSource.filteredData.reduce((acc, user) => {
      return {...acc, [user._id]:false}
    }, {});
    if(completed){
      this.checkedFormGroup.patchValue(listTrue);
      this.checkedFormGroup.patchValue(listFalse);
    }
    else{
      this.checkedFormGroup.patchValue(listAllFalse);
    }
    if(completed){
      this.fieldSearch = false;
      this.numberUserChecked = this.dataSource.filteredData.length;
    }
    else{
      this.fieldSearch = true;
      this.numberUserChecked = 0;
    }
  }

  setOne(completed: boolean){
    if(completed){
      this.fieldSearch = false;
      this.numberUserChecked += 1;
    }
    else{
      this.numberUserChecked -= 1;
    }
    if(this.numberUserChecked === 0){
      this.fieldSearch = true;
    }
    if(completed && this.numberUserChecked === this.dataSource.filteredData.length){
      this.allComplete = true;
    }
  }

  someComplete(){
    if(this.allComplete){
      return false;
    }
    if(this.numberUserChecked > 0){
      return true;
    }
    return null;
  }

  applyFilter(event: Event) {
    this.dataSource.filterPredicate = ((data, filter): boolean => {
      let arrayForSearch = Object.values(data);
      let stringForSearch = arrayForSearch.join().toLowerCase();
      if (stringForSearch.indexOf(filter) == -1) {
        return false;
      }
      return true;
    });
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm$.pipe(      
      debounceTime(1000),    
    ).subscribe(val => {
      this.dataSource.filter = val.trim().toLowerCase()
    });

    this.searchTerm$.next(filterValue);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    } 
  }

  cityChange(){
    this.dataSource.filterPredicate = ((data, filter): boolean => {
      return data.address === filter;
    });
    this.dataSource.filter = this.options.value.city;
    let listAllFalse = this.dataSource.filteredData.reduce((acc, user) => {
      return {...acc, [user._id]:false}
    }, {});
    this.checkedFormGroup.patchValue(listAllFalse);
    this.allComplete = false;
    this.numberUserChecked = 0;
  }

  filterGender(){
    this.dataSource.filterPredicate = ((data, filter): boolean => {
      return data.gender === filter;
    });
    this.dataSource.filter = this.options.value.gender;

    this.allComplete = false;
    let listAllFalse = this.dataSource.filteredData.reduce((acc, user) => {
      return {...acc, [user._id]:false}
    }, {});
    this.checkedFormGroup.patchValue(listAllFalse);
    this.numberUserChecked = 0;
  }

  openCreateDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      title: 'Create New User'
    };
    const dialogRef = this.dialog.open(CreateUserComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
        data => {
          data ? this.users.push({...data, _id: this.users.length + 1}) : null;
          this.updateDataSource(this.users);
        }
    );   
  }

  openUpdateDialog(id :number){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '500px';
    dialogConfig.data = {
      users: this.users,
      id: id
    };
    const dialogRef = this.dialog.open(UpdateDeleteUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        let index = this.users.findIndex((user:User) => user._id === data.id );
        if(index === -1) {
          return;
        }
        else {
          this.users.splice(index, 1, {...data, _id: data.id});
        }
        this.updateDataSource(this.users);
      }
    ); 
  }

  Delete(id : number){
    let index = this.users.findIndex((user: User) => user._id == id );
    this.users.splice(index, 1);
    this.updateDataSource(this.users);
  }

  updateDataSource(data: User[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}



