import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_orden_de_servicioComponent } from './show-advance-filter-Tipo_orden_de_servicio.component';

describe('ShowAdvanceFilterTipo_orden_de_servicioComponent', () => {
  let component: ShowAdvanceFilterTipo_orden_de_servicioComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_orden_de_servicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_orden_de_servicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_orden_de_servicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
