import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringExpenseListComponent } from './recurring-expense-list.component';

describe('RecurringExpenseListComponent', () => {
  let component: RecurringExpenseListComponent;
  let fixture: ComponentFixture<RecurringExpenseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringExpenseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
