import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetExpenseAndUtilityComponent } from './set-expense-and-utility.component';

describe('SetExpenseAndUtilityComponent', () => {
  let component: SetExpenseAndUtilityComponent;
  let fixture: ComponentFixture<SetExpenseAndUtilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetExpenseAndUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetExpenseAndUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
