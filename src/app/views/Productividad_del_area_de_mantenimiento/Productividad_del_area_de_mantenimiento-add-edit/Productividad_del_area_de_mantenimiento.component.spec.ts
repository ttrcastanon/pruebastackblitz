﻿import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Productividad_del_area_de_mantenimientoComponent } from './Productividad_del_area_de_mantenimiento.component';

describe('Productividad_del_area_de_mantenimientoComponent', () => {
  let component: Productividad_del_area_de_mantenimientoComponent;
  let fixture: ComponentFixture<Productividad_del_area_de_mantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Productividad_del_area_de_mantenimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Productividad_del_area_de_mantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

