import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterFolios_Generacion_OCComponent } from './show-advance-filter-Folios_Generacion_OC.component';

describe('ShowAdvanceFilterFolios_Generacion_OCComponent', () => {
  let component: ShowAdvanceFilterFolios_Generacion_OCComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterFolios_Generacion_OCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterFolios_Generacion_OCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterFolios_Generacion_OCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
