import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_cargaComponent } from './Tipo_de_carga.component';

describe('Tipo_de_cargaComponent', () => {
  let component: Tipo_de_cargaComponent;
  let fixture: ComponentFixture<Tipo_de_cargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_cargaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_cargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

