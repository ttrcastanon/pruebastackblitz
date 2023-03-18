import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Documentacion_de_PasajeroComponent } from './Documentacion_de_Pasajero.component';

describe('Documentacion_de_PasajeroComponent', () => {
  let component: Documentacion_de_PasajeroComponent;
  let fixture: ComponentFixture<Documentacion_de_PasajeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Documentacion_de_PasajeroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Documentacion_de_PasajeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

