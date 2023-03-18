import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListConcepto_Estado_de_ResultadoComponent } from './list-Concepto_Estado_de_Resultado.component';

describe('ListConcepto_Estado_de_ResultadoComponent', () => {
  let component: ListConcepto_Estado_de_ResultadoComponent;
  let fixture: ComponentFixture<ListConcepto_Estado_de_ResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListConcepto_Estado_de_ResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListConcepto_Estado_de_ResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
