import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resultado_de_Autorizacion_de_VueloComponent } from './Resultado_de_Autorizacion_de_Vuelo.component';

describe('Resultado_de_Autorizacion_de_VueloComponent', () => {
  let component: Resultado_de_Autorizacion_de_VueloComponent;
  let fixture: ComponentFixture<Resultado_de_Autorizacion_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Resultado_de_Autorizacion_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Resultado_de_Autorizacion_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

