import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Bitacora_de_AeronaveComponent } from './list-Tipo_de_Bitacora_de_Aeronave.component';

describe('ListTipo_de_Bitacora_de_AeronaveComponent', () => {
  let component: ListTipo_de_Bitacora_de_AeronaveComponent;
  let fixture: ComponentFixture<ListTipo_de_Bitacora_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Bitacora_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Bitacora_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
