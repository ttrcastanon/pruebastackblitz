import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResponsable_Incidencia_VueloComponent } from './list-Responsable_Incidencia_Vuelo.component';

describe('ListResponsable_Incidencia_VueloComponent', () => {
  let component: ListResponsable_Incidencia_VueloComponent;
  let fixture: ComponentFixture<ListResponsable_Incidencia_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListResponsable_Incidencia_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListResponsable_Incidencia_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
