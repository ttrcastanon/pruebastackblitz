import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterModulo_de_MantenimientoComponent } from './show-advance-filter-Modulo_de_Mantenimiento.component';

describe('ShowAdvanceFilterModulo_de_MantenimientoComponent', () => {
  let component: ShowAdvanceFilterModulo_de_MantenimientoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterModulo_de_MantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterModulo_de_MantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterModulo_de_MantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
