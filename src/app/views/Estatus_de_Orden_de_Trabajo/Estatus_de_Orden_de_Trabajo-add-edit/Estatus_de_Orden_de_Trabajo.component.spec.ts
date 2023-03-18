import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_Orden_de_TrabajoComponent } from './Estatus_de_Orden_de_Trabajo.component';

describe('Estatus_de_Orden_de_TrabajoComponent', () => {
  let component: Estatus_de_Orden_de_TrabajoComponent;
  let fixture: ComponentFixture<Estatus_de_Orden_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_Orden_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_Orden_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

