import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Detalle_de_Actividades_de_ColaboradoresComponent } from './Detalle_de_Actividades_de_Colaboradores.component';

describe('Detalle_de_Actividades_de_ColaboradoresComponent', () => {
  let component: Detalle_de_Actividades_de_ColaboradoresComponent;
  let fixture: ComponentFixture<Detalle_de_Actividades_de_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Detalle_de_Actividades_de_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Detalle_de_Actividades_de_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

