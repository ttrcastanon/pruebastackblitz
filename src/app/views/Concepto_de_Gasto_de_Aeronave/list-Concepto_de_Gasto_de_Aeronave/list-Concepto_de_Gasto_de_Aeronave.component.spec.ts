import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConcepto_de_Gasto_de_AeronaveComponent } from './list-Concepto_de_Gasto_de_Aeronave.component';

describe('ListConcepto_de_Gasto_de_AeronaveComponent', () => {
  let component: ListConcepto_de_Gasto_de_AeronaveComponent;
  let fixture: ComponentFixture<ListConcepto_de_Gasto_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConcepto_de_Gasto_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConcepto_de_Gasto_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
