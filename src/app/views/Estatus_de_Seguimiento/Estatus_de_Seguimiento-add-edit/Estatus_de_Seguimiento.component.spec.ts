import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Estatus_de_SeguimientoComponent } from './Estatus_de_Seguimiento.component';

describe('Estatus_de_SeguimientoComponent', () => {
  let component: Estatus_de_SeguimientoComponent;
  let fixture: ComponentFixture<Estatus_de_SeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Estatus_de_SeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Estatus_de_SeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

