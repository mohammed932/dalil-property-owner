import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOccationComponent } from './update-activities.component';


describe('UpdateActivitiesComponent', () => {
  let component: UpdateOccationComponent;
  let fixture: ComponentFixture<UpdateActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateActivitiesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
