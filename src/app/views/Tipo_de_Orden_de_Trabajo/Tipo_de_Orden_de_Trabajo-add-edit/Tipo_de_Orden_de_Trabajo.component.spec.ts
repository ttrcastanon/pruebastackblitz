import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Orden_de_TrabajoComponent } from './Tipo_de_Orden_de_Trabajo.component';

describe('Tipo_de_Orden_de_TrabajoComponent', () => {
  let component: Tipo_de_Orden_de_TrabajoComponent;
  let fixture: ComponentFixture<Tipo_de_Orden_de_TrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Orden_de_TrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Orden_de_TrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

