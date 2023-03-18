import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent } from './show-advance-filter-Estatus_Modulo_de_Mantenimiento.component';

describe('ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent', () => {
  let component: ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterEstatus_Modulo_de_MantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
