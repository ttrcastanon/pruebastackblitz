import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResultado_de_Autorizacion_de_VueloComponent } from './list-Resultado_de_Autorizacion_de_Vuelo.component';

describe('ListResultado_de_Autorizacion_de_VueloComponent', () => {
  let component: ListResultado_de_Autorizacion_de_VueloComponent;
  let fixture: ComponentFixture<ListResultado_de_Autorizacion_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListResultado_de_Autorizacion_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListResultado_de_Autorizacion_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
