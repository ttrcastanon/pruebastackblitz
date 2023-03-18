import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHistorial_de_Instalacion_de_partesComponent } from './list-Historial_de_Instalacion_de_partes.component';

describe('ListHistorial_de_Instalacion_de_partesComponent', () => {
  let component: ListHistorial_de_Instalacion_de_partesComponent;
  let fixture: ComponentFixture<ListHistorial_de_Instalacion_de_partesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListHistorial_de_Instalacion_de_partesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHistorial_de_Instalacion_de_partesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
