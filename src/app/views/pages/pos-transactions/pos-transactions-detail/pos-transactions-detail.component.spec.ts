import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTransactionsDetailComponent } from './pos-transactions-detail.component';

describe('PosTransactionsDetailComponent', () => {
  let component: PosTransactionsDetailComponent;
  let fixture: ComponentFixture<PosTransactionsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosTransactionsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTransactionsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
