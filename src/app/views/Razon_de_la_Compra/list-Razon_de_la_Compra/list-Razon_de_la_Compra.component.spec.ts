import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRazon_de_la_CompraComponent } from './list-Razon_de_la_Compra.component';

describe('ListRazon_de_la_CompraComponent', () => {
  let component: ListRazon_de_la_CompraComponent;
  let fixture: ComponentFixture<ListRazon_de_la_CompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRazon_de_la_CompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRazon_de_la_CompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
