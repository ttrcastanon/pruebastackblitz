import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModulo_de_MantenimientoComponent } from './list-Modulo_de_Mantenimiento.component';

describe('ListModulo_de_MantenimientoComponent', () => {
  let component: ListModulo_de_MantenimientoComponent;
  let fixture: ComponentFixture<ListModulo_de_MantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModulo_de_MantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModulo_de_MantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
