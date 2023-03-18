import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCatalogo_serviciosComponent } from './show-advance-filter-Catalogo_servicios.component';

describe('ShowAdvanceFilterCatalogo_serviciosComponent', () => {
  let component: ShowAdvanceFilterCatalogo_serviciosComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCatalogo_serviciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCatalogo_serviciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCatalogo_serviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
