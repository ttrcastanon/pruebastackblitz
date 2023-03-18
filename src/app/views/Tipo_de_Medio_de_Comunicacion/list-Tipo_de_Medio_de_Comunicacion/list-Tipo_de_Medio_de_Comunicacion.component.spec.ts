import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Medio_de_ComunicacionComponent } from './list-Tipo_de_Medio_de_Comunicacion.component';

describe('ListTipo_de_Medio_de_ComunicacionComponent', () => {
  let component: ListTipo_de_Medio_de_ComunicacionComponent;
  let fixture: ComponentFixture<ListTipo_de_Medio_de_ComunicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Medio_de_ComunicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Medio_de_ComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
