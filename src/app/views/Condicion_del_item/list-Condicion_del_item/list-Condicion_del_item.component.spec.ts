import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCondicion_del_itemComponent } from './list-Condicion_del_item.component';

describe('ListCondicion_del_itemComponent', () => {
  let component: ListCondicion_del_itemComponent;
  let fixture: ComponentFixture<ListCondicion_del_itemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCondicion_del_itemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCondicion_del_itemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
