import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_SeguroComponent } from './list-Tipo_de_Seguro.component';

describe('ListTipo_de_SeguroComponent', () => {
  let component: ListTipo_de_SeguroComponent;
  let fixture: ComponentFixture<ListTipo_de_SeguroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_SeguroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_SeguroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
