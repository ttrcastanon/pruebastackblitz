import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agrupacion_Concepto_Balance_GeneralComponent } from './Agrupacion_Concepto_Balance_General.component';

describe('Agrupacion_Concepto_Balance_GeneralComponent', () => {
  let component: Agrupacion_Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<Agrupacion_Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Agrupacion_Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Agrupacion_Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

