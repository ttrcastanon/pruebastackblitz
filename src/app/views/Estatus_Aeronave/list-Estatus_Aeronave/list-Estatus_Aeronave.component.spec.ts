import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEstatus_AeronaveComponent } from './list-Estatus_Aeronave.component';

describe('ListEstatus_AeronaveComponent', () => {
  let component: ListEstatus_AeronaveComponent;
  let fixture: ComponentFixture<ListEstatus_AeronaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEstatus_AeronaveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEstatus_AeronaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
