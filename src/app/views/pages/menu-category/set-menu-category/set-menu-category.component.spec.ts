import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetMenuCategoryComponent } from './set-menu-category.component';

describe('SetMenuCategoryComponent', () => {
  let component: SetMenuCategoryComponent;
  let fixture: ComponentFixture<SetMenuCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetMenuCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetMenuCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
