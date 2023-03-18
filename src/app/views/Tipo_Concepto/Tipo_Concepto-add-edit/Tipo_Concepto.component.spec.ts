import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tipo_ConceptoComponent } from './Tipo_Concepto.component';

describe('Tipo_ConceptoComponent', () => {
  let component: Tipo_ConceptoComponent;
  let fixture: ComponentFixture<Tipo_ConceptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tipo_ConceptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tipo_ConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

