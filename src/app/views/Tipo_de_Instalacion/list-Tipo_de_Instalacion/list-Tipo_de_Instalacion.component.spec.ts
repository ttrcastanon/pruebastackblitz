import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_InstalacionComponent } from './list-Tipo_de_Instalacion.component';

describe('ListTipo_de_InstalacionComponent', () => {
  let component: ListTipo_de_InstalacionComponent;
  let fixture: ComponentFixture<ListTipo_de_InstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_InstalacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_InstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
