import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Concepto_de_Gasto_de_AeronaveComponent } from './Concepto_de_Gasto_de_Aeronave.component';

describe('Concepto_de_Gasto_de_AeronaveComponent', () => {
  let component: Concepto_de_Gasto_de_AeronaveComponent;
  let fixture: ComponentFixture<Concepto_de_Gasto_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Concepto_de_Gasto_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Concepto_de_Gasto_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

