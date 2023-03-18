import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLayout_Balance_GeneralComponent } from './list-Layout_Balance_General.component';

describe('ListLayout_Balance_GeneralComponent', () => {
  let component: ListLayout_Balance_GeneralComponent;
  let fixture: ComponentFixture<ListLayout_Balance_GeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListLayout_Balance_GeneralComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLayout_Balance_GeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
