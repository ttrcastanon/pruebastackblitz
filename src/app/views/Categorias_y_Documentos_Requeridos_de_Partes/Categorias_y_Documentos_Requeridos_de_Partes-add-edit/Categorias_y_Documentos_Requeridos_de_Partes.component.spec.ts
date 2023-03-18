import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categorias_y_Documentos_Requeridos_de_PartesComponent } from './Categorias_y_Documentos_Requeridos_de_Partes.component';

describe('Categorias_y_Documentos_Requeridos_de_PartesComponent', () => {
  let component: Categorias_y_Documentos_Requeridos_de_PartesComponent;
  let fixture: ComponentFixture<Categorias_y_Documentos_Requeridos_de_PartesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Categorias_y_Documentos_Requeridos_de_PartesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Categorias_y_Documentos_Requeridos_de_PartesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

