import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCatalogo_codigo_ATAComponent } from './show-advance-filter-Catalogo_codigo_ATA.component';

describe('ShowAdvanceFilterCatalogo_codigo_ATAComponent', () => {
  let component: ShowAdvanceFilterCatalogo_codigo_ATAComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCatalogo_codigo_ATAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCatalogo_codigo_ATAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCatalogo_codigo_ATAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
