import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoryListComponent } from './menu-category-list.component';

describe('MenuCategoryListComponent', () => {
  let component: MenuCategoryListComponent;
  let fixture: ComponentFixture<MenuCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
