import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent } from './show-advance-filter-Resultado_de_Autorizacion_de_Vuelo.component';

describe('ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent', () => {
  let component: ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterResultado_de_Autorizacion_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
