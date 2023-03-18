import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterProveedores_para_MSComponent } from './show-advance-filter-Proveedores_para_MS.component';

describe('ShowAdvanceFilterProveedores_para_MSComponent', () => {
  let component: ShowAdvanceFilterProveedores_para_MSComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterProveedores_para_MSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterProveedores_para_MSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterProveedores_para_MSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
