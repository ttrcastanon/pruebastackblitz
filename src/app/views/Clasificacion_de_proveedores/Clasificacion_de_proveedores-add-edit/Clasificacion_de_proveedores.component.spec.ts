import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Clasificacion_de_proveedoresComponent } from './Clasificacion_de_proveedores.component';

describe('Clasificacion_de_proveedoresComponent', () => {
  let component: Clasificacion_de_proveedoresComponent;
  let fixture: ComponentFixture<Clasificacion_de_proveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Clasificacion_de_proveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Clasificacion_de_proveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

