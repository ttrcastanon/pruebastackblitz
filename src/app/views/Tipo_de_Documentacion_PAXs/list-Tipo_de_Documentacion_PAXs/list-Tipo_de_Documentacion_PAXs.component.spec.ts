import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_Documentacion_PAXsComponent } from './list-Tipo_de_Documentacion_PAXs.component';

describe('ListTipo_de_Documentacion_PAXsComponent', () => {
  let component: ListTipo_de_Documentacion_PAXsComponent;
  let fixture: ComponentFixture<ListTipo_de_Documentacion_PAXsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_Documentacion_PAXsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_Documentacion_PAXsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
