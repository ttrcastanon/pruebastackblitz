import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Posicion_de_PiezasComponent } from './Tipo_de_Posicion_de_Piezas.component';

describe('Tipo_de_Posicion_de_PiezasComponent', () => {
  let component: Tipo_de_Posicion_de_PiezasComponent;
  let fixture: ComponentFixture<Tipo_de_Posicion_de_PiezasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Posicion_de_PiezasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Posicion_de_PiezasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

