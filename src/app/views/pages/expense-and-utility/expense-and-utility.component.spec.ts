import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAndUtilityComponent } from './expense-and-utility.component';

describe('ExpenseAndUtilityComponent', () => {
  let component: ExpenseAndUtilityComponent;
  let fixture: ComponentFixture<ExpenseAndUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenseAndUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseAndUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
