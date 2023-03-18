import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Medio_de_ComunicacionComponent } from './Tipo_de_Medio_de_Comunicacion.component';

describe('Tipo_de_Medio_de_ComunicacionComponent', () => {
  let component: Tipo_de_Medio_de_ComunicacionComponent;
  let fixture: ComponentFixture<Tipo_de_Medio_de_ComunicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Medio_de_ComunicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Medio_de_ComunicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

