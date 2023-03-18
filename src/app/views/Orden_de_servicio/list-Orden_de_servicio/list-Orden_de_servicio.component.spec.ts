import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrden_de_servicioComponent } from './list-Orden_de_servicio.component';

describe('ListOrden_de_servicioComponent', () => {
  let component: ListOrden_de_servicioComponent;
  let fixture: ComponentFixture<ListOrden_de_servicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrden_de_servicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOrden_de_servicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
