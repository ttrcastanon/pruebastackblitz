import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipos_de_CursoComponent } from './Tipos_de_Curso.component';

describe('Tipos_de_CursoComponent', () => {
  let component: Tipos_de_CursoComponent;
  let fixture: ComponentFixture<Tipos_de_CursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipos_de_CursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipos_de_CursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

