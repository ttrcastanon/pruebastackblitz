import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Catalogo_Tipo_de_VencimientoComponent } from './Catalogo_Tipo_de_Vencimiento.component';

describe('Catalogo_Tipo_de_VencimientoComponent', () => {
  let component: Catalogo_Tipo_de_VencimientoComponent;
  let fixture: ComponentFixture<Catalogo_Tipo_de_VencimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Catalogo_Tipo_de_VencimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Catalogo_Tipo_de_VencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

