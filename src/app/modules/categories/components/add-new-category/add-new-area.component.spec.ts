import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAreaComponent } from './add-new-category.component';

describe('AddNewAreaComponent', () => {
  let component: AddNewAreaComponent;
  let fixture: ComponentFixture<AddNewAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
