import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAndUtilityListComponent } from './expense-and-utility-list.component';

describe('ExpenseAndUtilityListComponent', () => {
  let component: ExpenseAndUtilityListComponent;
  let fixture: ComponentFixture<ExpenseAndUtilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseAndUtilityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAndUtilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
