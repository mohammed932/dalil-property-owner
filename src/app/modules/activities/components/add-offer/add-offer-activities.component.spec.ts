import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOfferActivityComponent } from './add-offer-activities.component';


describe('AddOfferActivityComponent', () => {
  let component: AddOfferActivityComponent;
  let fixture: ComponentFixture<AddOfferActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddOfferActivityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOfferActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
