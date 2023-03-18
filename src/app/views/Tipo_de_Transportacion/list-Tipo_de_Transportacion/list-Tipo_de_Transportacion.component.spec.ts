import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_TransportacionComponent } from './list-Tipo_de_Transportacion.component';

describe('ListTipo_de_TransportacionComponent', () => {
  let component: ListTipo_de_TransportacionComponent;
  let fixture: ComponentFixture<ListTipo_de_TransportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_TransportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_TransportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
