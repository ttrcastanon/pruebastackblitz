import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterPolitica_de_ProveedoresComponent } from './show-advance-filter-Politica_de_Proveedores.component';

describe('ShowAdvanceFilterPolitica_de_ProveedoresComponent', () => {
  let component: ShowAdvanceFilterPolitica_de_ProveedoresComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterPolitica_de_ProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterPolitica_de_ProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterPolitica_de_ProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
