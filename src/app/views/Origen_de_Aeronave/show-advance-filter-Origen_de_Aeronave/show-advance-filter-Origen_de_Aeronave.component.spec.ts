import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterOrigen_de_AeronaveComponent } from './show-advance-filter-Origen_de_Aeronave.component';

describe('ShowAdvanceFilterOrigen_de_AeronaveComponent', () => {
  let component: ShowAdvanceFilterOrigen_de_AeronaveComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterOrigen_de_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterOrigen_de_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterOrigen_de_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
