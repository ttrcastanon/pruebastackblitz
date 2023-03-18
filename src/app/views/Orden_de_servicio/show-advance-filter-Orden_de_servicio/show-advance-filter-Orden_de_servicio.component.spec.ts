import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterOrden_de_servicioComponent } from './show-advance-filter-Orden_de_servicio.component';

describe('ShowAdvanceFilterOrden_de_servicioComponent', () => {
  let component: ShowAdvanceFilterOrden_de_servicioComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterOrden_de_servicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterOrden_de_servicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterOrden_de_servicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
