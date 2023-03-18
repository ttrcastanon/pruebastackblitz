import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_MiscelaneasComponent } from './list-Tipo_de_Miscelaneas.component';

describe('ListTipo_de_MiscelaneasComponent', () => {
  let component: ListTipo_de_MiscelaneasComponent;
  let fixture: ComponentFixture<ListTipo_de_MiscelaneasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_MiscelaneasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_MiscelaneasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
