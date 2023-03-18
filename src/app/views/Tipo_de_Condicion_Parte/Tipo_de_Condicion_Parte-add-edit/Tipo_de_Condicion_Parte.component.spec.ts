import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Condicion_ParteComponent } from './Tipo_de_Condicion_Parte.component';

describe('Tipo_de_Condicion_ParteComponent', () => {
  let component: Tipo_de_Condicion_ParteComponent;
  let fixture: ComponentFixture<Tipo_de_Condicion_ParteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Condicion_ParteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Condicion_ParteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

