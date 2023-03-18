import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_PresupuestosComponent } from './show-advance-filter-Layout_Presupuestos.component';

describe('ShowAdvanceFilterLayout_PresupuestosComponent', () => {
  let component: ShowAdvanceFilterLayout_PresupuestosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_PresupuestosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_PresupuestosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_PresupuestosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
