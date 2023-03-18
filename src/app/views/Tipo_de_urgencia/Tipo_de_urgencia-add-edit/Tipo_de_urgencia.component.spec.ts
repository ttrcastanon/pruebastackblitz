import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_urgenciaComponent } from './Tipo_de_urgencia.component';

describe('Tipo_de_urgenciaComponent', () => {
  let component: Tipo_de_urgenciaComponent;
  let fixture: ComponentFixture<Tipo_de_urgenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_urgenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_urgenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

