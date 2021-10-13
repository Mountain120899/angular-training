import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDeleteUserComponent } from './update-delete-user.component';

describe('UpdateDeleteUserComponent', () => {
  let component: UpdateDeleteUserComponent;
  let fixture: ComponentFixture<UpdateDeleteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateDeleteUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
