﻿import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_ClienteComponent } from './list-Tipo_de_Cliente.component';

describe('ListTipo_de_ClienteComponent', () => {
  let component: ListTipo_de_ClienteComponent;
  let fixture: ComponentFixture<ListTipo_de_ClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_ClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_ClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
