import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_ConceptoComponent } from './list-Tipo_Concepto.component';

describe('ListTipo_ConceptoComponent', () => {
  let component: ListTipo_ConceptoComponent;
  let fixture: ComponentFixture<ListTipo_ConceptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_ConceptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_ConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
