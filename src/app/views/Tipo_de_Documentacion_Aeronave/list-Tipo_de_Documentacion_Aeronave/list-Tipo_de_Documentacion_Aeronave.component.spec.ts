import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Documentacion_AeronaveComponent } from './list-Tipo_de_Documentacion_Aeronave.component';

describe('ListTipo_de_Documentacion_AeronaveComponent', () => {
  let component: ListTipo_de_Documentacion_AeronaveComponent;
  let fixture: ComponentFixture<ListTipo_de_Documentacion_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Documentacion_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Documentacion_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
