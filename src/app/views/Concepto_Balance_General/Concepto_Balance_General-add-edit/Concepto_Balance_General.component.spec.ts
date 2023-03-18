import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Concepto_Balance_GeneralComponent } from './Concepto_Balance_General.component';

describe('Concepto_Balance_GeneralComponent', () => {
  let component: Concepto_Balance_GeneralComponent;
  let fixture: ComponentFixture<Concepto_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Concepto_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Concepto_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

