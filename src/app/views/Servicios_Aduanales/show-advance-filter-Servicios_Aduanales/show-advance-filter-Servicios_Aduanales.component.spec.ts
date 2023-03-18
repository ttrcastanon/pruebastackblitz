import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterServicios_AduanalesComponent } from './show-advance-filter-Servicios_Aduanales.component';

describe('ShowAdvanceFilterServicios_AduanalesComponent', () => {
  let component: ShowAdvanceFilterServicios_AduanalesComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterServicios_AduanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterServicios_AduanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterServicios_AduanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
