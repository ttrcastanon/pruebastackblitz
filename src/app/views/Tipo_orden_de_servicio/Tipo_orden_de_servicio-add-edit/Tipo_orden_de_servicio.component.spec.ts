import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_orden_de_servicioComponent } from './Tipo_orden_de_servicio.component';

describe('Tipo_orden_de_servicioComponent', () => {
  let component: Tipo_orden_de_servicioComponent;
  let fixture: ComponentFixture<Tipo_orden_de_servicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_orden_de_servicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_orden_de_servicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

