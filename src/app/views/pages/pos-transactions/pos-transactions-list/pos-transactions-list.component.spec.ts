import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionsListComponent } from './pos-transactions-list.component';

describe('PosTransactionsListComponent', () => {
  let component: PosTransactionsListComponent;
  let fixture: ComponentFixture<PosTransactionsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosTransactionsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTransactionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
