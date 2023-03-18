import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Posicion_de_PiezasComponent } from './list-Tipo_de_Posicion_de_Piezas.component';

describe('ListTipo_de_Posicion_de_PiezasComponent', () => {
  let component: ListTipo_de_Posicion_de_PiezasComponent;
  let fixture: ComponentFixture<ListTipo_de_Posicion_de_PiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Posicion_de_PiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Posicion_de_PiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
