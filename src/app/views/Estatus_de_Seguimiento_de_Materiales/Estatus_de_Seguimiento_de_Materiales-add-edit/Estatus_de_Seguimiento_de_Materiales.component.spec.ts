import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Seguimiento_de_MaterialesComponent } from './Estatus_de_Seguimiento_de_Materiales.component';

describe('Estatus_de_Seguimiento_de_MaterialesComponent', () => {
  let component: Estatus_de_Seguimiento_de_MaterialesComponent;
  let fixture: ComponentFixture<Estatus_de_Seguimiento_de_MaterialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Seguimiento_de_MaterialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Seguimiento_de_MaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

