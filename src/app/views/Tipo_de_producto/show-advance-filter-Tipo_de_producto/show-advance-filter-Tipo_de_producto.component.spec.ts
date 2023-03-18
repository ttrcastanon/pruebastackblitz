import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterTipo_de_productoComponent } from './show-advance-filter-Tipo_de_producto.component';

describe('ShowAdvanceFilterTipo_de_productoComponent', () => {
  let component: ShowAdvanceFilterTipo_de_productoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterTipo_de_productoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterTipo_de_productoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterTipo_de_productoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
