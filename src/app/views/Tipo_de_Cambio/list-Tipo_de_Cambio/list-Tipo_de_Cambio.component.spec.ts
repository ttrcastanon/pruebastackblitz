import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_CambioComponent } from './list-Tipo_de_Cambio.component';

describe('ListTipo_de_CambioComponent', () => {
  let component: ListTipo_de_CambioComponent;
  let fixture: ComponentFixture<ListTipo_de_CambioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_CambioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_CambioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
