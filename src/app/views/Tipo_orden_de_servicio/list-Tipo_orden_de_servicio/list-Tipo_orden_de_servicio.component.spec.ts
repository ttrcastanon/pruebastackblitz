import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_orden_de_servicioComponent } from './list-Tipo_orden_de_servicio.component';

describe('ListTipo_orden_de_servicioComponent', () => {
  let component: ListTipo_orden_de_servicioComponent;
  let fixture: ComponentFixture<ListTipo_orden_de_servicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_orden_de_servicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_orden_de_servicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
