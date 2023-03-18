import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_AvisoComponent } from './list-Tipo_de_Aviso.component';

describe('ListTipo_de_AvisoComponent', () => {
  let component: ListTipo_de_AvisoComponent;
  let fixture: ComponentFixture<ListTipo_de_AvisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_AvisoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_AvisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
