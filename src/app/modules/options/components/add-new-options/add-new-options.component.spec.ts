import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewOptionComponent } from './add-new-options.component';


describe('AddNewOptionComponent', () => {
  let component: AddNewOptionComponent;
  let fixture: ComponentFixture<AddNewOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewOptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
