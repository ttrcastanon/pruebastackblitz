import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipos_de_Modelo_CursoComponent } from './Tipos_de_Modelo_Curso.component';

describe('Tipos_de_Modelo_CursoComponent', () => {
  let component: Tipos_de_Modelo_CursoComponent;
  let fixture: ComponentFixture<Tipos_de_Modelo_CursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipos_de_Modelo_CursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipos_de_Modelo_CursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

