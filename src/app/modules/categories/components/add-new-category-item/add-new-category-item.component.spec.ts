import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddNewCategoryItemComponent } from './add-new-category-item.component';


describe('AddNewAreaComponent', () => {
  let component: AddNewCategoryItemComponent;
  let fixture: ComponentFixture<AddNewCategoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCategoryItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
