import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_de_Concepto_Balance_GeneralComponent } from './Tipo_de_Concepto_Balance_General.component';

describe('Tipo_de_Concepto_Balance_GeneralComponent', () => {
  let component: Tipo_de_Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<Tipo_de_Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_de_Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_de_Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

