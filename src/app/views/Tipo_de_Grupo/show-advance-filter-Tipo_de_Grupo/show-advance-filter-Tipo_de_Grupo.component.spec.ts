﻿import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_GrupoComponent } from './show-advance-filter-Tipo_de_Grupo.component';

describe('ShowAdvanceFilterTipo_de_GrupoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_GrupoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_GrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_GrupoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_GrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
