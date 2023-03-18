import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAplicacion__de_PrestamoComponent } from './list-Aplicacion__de_Prestamo.component';

describe('ListAplicacion__de_PrestamoComponent', () => {
  let component: ListAplicacion__de_PrestamoComponent;
  let fixture: ComponentFixture<ListAplicacion__de_PrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAplicacion__de_PrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAplicacion__de_PrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
