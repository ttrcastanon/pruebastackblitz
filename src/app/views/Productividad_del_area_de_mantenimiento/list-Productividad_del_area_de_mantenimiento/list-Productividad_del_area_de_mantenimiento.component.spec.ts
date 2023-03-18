import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListProductividad_del_area_de_mantenimientoComponent } from './list-Productividad_del_area_de_mantenimiento.component';

describe('ListProductividad_del_area_de_mantenimientoComponent', () => {
  let component: ListProductividad_del_area_de_mantenimientoComponent;
  let fixture: ComponentFixture<ListProductividad_del_area_de_mantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListProductividad_del_area_de_mantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListProductividad_del_area_de_mantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
