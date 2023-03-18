import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_de_Cierre_de_VueloComponent } from './list-Estatus_de_Cierre_de_Vuelo.component';

describe('ListEstatus_de_Cierre_de_VueloComponent', () => {
  let component: ListEstatus_de_Cierre_de_VueloComponent;
  let fixture: ComponentFixture<ListEstatus_de_Cierre_de_VueloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_de_Cierre_de_VueloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_de_Cierre_de_VueloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
