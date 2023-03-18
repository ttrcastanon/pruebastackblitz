import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConcepto_Balance_GeneralComponent } from './list-Concepto_Balance_General.component';

describe('ListConcepto_Balance_GeneralComponent', () => {
  let component: ListConcepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<ListConcepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConcepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConcepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
