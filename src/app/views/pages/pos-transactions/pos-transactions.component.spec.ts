import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionsComponent } from './pos-transactions.component';

describe('PosTransactionsComponent', () => {
  let component: PosTransactionsComponent;
  let fixture: ComponentFixture<PosTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
