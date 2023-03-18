import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTipo_de_PilotoComponent } from './list-Tipo_de_Piloto.component';

describe('ListTipo_de_PilotoComponent', () => {
  let component: ListTipo_de_PilotoComponent;
  let fixture: ComponentFixture<ListTipo_de_PilotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTipo_de_PilotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTipo_de_PilotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
