import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Orden_de_servicioComponent } from './Orden_de_servicio.component';

describe('Orden_de_servicioComponent', () => {
  let component: Orden_de_servicioComponent;
  let fixture: ComponentFixture<Orden_de_servicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Orden_de_servicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Orden_de_servicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

