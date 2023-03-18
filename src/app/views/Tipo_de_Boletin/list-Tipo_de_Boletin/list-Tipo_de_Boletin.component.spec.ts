import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_BoletinComponent } from './list-Tipo_de_Boletin.component';

describe('ListTipo_de_BoletinComponent', () => {
  let component: ListTipo_de_BoletinComponent;
  let fixture: ComponentFixture<ListTipo_de_BoletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_BoletinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_BoletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
