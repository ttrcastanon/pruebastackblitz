﻿import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneroComponent } from './Genero.component';

describe('GeneroComponent', () => {
  let component: GeneroComponent;
  let fixture: ComponentFixture<GeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

