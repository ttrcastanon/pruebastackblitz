﻿import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConceptoComponent } from './Concepto.component';

describe('ConceptoComponent', () => {
  let component: ConceptoComponent;
  let fixture: ComponentFixture<ConceptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConceptoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

