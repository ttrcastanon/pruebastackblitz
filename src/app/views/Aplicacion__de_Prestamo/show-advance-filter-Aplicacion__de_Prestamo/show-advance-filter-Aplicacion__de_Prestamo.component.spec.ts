import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterAplicacion__de_PrestamoComponent } from './show-advance-filter-Aplicacion__de_Prestamo.component';

describe('ShowAdvanceFilterAplicacion__de_PrestamoComponent', () => {
  let component: ShowAdvanceFilterAplicacion__de_PrestamoComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterAplicacion__de_PrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterAplicacion__de_PrestamoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterAplicacion__de_PrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
