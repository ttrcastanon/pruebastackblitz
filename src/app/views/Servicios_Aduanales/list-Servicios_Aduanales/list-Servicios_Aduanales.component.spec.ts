import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListServicios_AduanalesComponent } from './list-Servicios_Aduanales.component';

describe('ListServicios_AduanalesComponent', () => {
  let component: ListServicios_AduanalesComponent;
  let fixture: ComponentFixture<ListServicios_AduanalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListServicios_AduanalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListServicios_AduanalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
