import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Remocion_e_instalacion_de_piezasComponent } from './Remocion_e_instalacion_de_piezas.component';

describe('Remocion_e_instalacion_de_piezasComponent', () => {
  let component: Remocion_e_instalacion_de_piezasComponent;
  let fixture: ComponentFixture<Remocion_e_instalacion_de_piezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Remocion_e_instalacion_de_piezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Remocion_e_instalacion_de_piezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

