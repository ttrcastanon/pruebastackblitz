import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listado_de_Ordenes_de_TrabajoComponent } from './Listado_de_Ordenes_de_Trabajo.component';

describe('Listado_de_Ordenes_de_TrabajoComponent', () => {
  let component: Listado_de_Ordenes_de_TrabajoComponent;
  let fixture: ComponentFixture<Listado_de_Ordenes_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listado_de_Ordenes_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Listado_de_Ordenes_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

