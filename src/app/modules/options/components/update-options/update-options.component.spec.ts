import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateOptionsComponent } from './update-options.component';


describe('UpdateOptionsComponent', () => {
  let component: UpdateOptionsComponent;
  let fixture: ComponentFixture<UpdateOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateOptionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
