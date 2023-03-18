import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_Modulo_de_MantenimientoComponent } from './list-Estatus_Modulo_de_Mantenimiento.component';

describe('ListEstatus_Modulo_de_MantenimientoComponent', () => {
  let component: ListEstatus_Modulo_de_MantenimientoComponent;
  let fixture: ComponentFixture<ListEstatus_Modulo_de_MantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_Modulo_de_MantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_Modulo_de_MantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
