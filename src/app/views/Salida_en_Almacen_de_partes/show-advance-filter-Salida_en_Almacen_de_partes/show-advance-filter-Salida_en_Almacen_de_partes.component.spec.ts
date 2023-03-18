import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterSalida_en_Almacen_de_partesComponent } from './show-advance-filter-Salida_en_Almacen_de_partes.component';

describe('ShowAdvanceFilterSalida_en_Almacen_de_partesComponent', () => {
  let component: ShowAdvanceFilterSalida_en_Almacen_de_partesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterSalida_en_Almacen_de_partesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterSalida_en_Almacen_de_partesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterSalida_en_Almacen_de_partesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
