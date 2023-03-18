import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterInstalacionComponent } from './show-advance-filter-Instalacion.component';

describe('ShowAdvanceFilterInstalacionComponent', () => {
  let component: ShowAdvanceFilterInstalacionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterInstalacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterInstalacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterInstalacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
