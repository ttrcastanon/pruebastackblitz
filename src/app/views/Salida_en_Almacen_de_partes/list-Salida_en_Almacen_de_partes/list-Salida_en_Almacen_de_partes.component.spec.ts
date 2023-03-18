import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSalida_en_Almacen_de_partesComponent } from './list-Salida_en_Almacen_de_partes.component';

describe('ListSalida_en_Almacen_de_partesComponent', () => {
  let component: ListSalida_en_Almacen_de_partesComponent;
  let fixture: ComponentFixture<ListSalida_en_Almacen_de_partesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSalida_en_Almacen_de_partesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSalida_en_Almacen_de_partesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
