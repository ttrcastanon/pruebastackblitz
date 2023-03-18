import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterproveedor_multiComponent } from './show-advance-filter-proveedor_multi.component';

describe('ShowAdvanceFilterproveedor_multiComponent', () => {
  let component: ShowAdvanceFilterproveedor_multiComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterproveedor_multiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterproveedor_multiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterproveedor_multiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
