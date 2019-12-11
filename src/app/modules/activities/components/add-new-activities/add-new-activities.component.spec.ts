import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewActivitiesComponent } from './add-new-activities.component';


describe('AddNewActivitiesComponent', () => {
  let component: AddNewActivitiesComponent;
  let fixture: ComponentFixture<AddNewActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewActivitiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
