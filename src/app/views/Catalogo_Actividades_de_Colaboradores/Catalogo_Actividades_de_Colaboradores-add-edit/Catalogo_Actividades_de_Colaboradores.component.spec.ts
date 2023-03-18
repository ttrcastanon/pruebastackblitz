import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalogo_Actividades_de_ColaboradoresComponent } from './Catalogo_Actividades_de_Colaboradores.component';

describe('Catalogo_Actividades_de_ColaboradoresComponent', () => {
  let component: Catalogo_Actividades_de_ColaboradoresComponent;
  let fixture: ComponentFixture<Catalogo_Actividades_de_ColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Catalogo_Actividades_de_ColaboradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Catalogo_Actividades_de_ColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

