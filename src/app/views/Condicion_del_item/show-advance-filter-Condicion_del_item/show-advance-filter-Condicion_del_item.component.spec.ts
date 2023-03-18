import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceFilterCondicion_del_itemComponent } from './show-advance-filter-Condicion_del_item.component';

describe('ShowAdvanceFilterCondicion_del_itemComponent', () => {
  let component: ShowAdvanceFilterCondicion_del_itemComponent;
  let fixture: ComponentFixture<ShowAdvanceFilterCondicion_del_itemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAdvanceFilterCondicion_del_itemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAdvanceFilterCondicion_del_itemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
