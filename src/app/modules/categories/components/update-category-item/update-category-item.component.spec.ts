import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateCategoryItemComponent } from './update-category-item.component';


describe('AddNewAreaComponent', () => {
  let component: UpdateCategoryItemComponent;
  let fixture: ComponentFixture<UpdateCategoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCategoryItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
