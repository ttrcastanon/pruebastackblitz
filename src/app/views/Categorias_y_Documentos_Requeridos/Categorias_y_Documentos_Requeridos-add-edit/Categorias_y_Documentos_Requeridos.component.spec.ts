import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categorias_y_Documentos_RequeridosComponent } from './Categorias_y_Documentos_Requeridos.component';

describe('Categorias_y_Documentos_RequeridosComponent', () => {
  let component: Categorias_y_Documentos_RequeridosComponent;
  let fixture: ComponentFixture<Categorias_y_Documentos_RequeridosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Categorias_y_Documentos_RequeridosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Categorias_y_Documentos_RequeridosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

