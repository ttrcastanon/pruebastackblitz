import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_DestinoComponent } from './list-Tipo_de_Destino.component';

describe('ListTipo_de_DestinoComponent', () => {
  let component: ListTipo_de_DestinoComponent;
  let fixture: ComponentFixture<ListTipo_de_DestinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_DestinoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_DestinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
