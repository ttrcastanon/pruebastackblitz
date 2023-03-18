import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent } from './show-advance-filter-Productividad_del_area_de_mantenimiento.component';

describe('ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent', () => {
  let component: ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
