import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterLayout_ProveedoresComponent } from './show-advance-filter-Layout_Proveedores.component';

describe('ShowAdvanceFilterLayout_ProveedoresComponent', () => {
  let component: ShowAdvanceFilterLayout_ProveedoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterLayout_ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterLayout_ProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterLayout_ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
