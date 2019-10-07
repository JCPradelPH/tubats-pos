import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRecurringExpenseComponent } from './set-recurring-expense.component';

describe('SetRecurringExpenseComponent', () => {
  let component: SetRecurringExpenseComponent;
  let fixture: ComponentFixture<SetRecurringExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetRecurringExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRecurringExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
