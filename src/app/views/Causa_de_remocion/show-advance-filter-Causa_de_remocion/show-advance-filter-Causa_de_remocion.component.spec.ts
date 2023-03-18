import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCausa_de_remocionComponent } from './show-advance-filter-Causa_de_remocion.component';

describe('ShowAdvanceFilterCausa_de_remocionComponent', () => {
  let component: ShowAdvanceFilterCausa_de_remocionComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCausa_de_remocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCausa_de_remocionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCausa_de_remocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
