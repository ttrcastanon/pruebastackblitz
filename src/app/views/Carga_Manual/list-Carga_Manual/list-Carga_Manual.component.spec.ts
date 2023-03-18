import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarga_ManualComponent } from './list-Carga_Manual.component';

describe('ListCarga_ManualComponent', () => {
  let component: ListCarga_ManualComponent;
  let fixture: ComponentFixture<ListCarga_ManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCarga_ManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCarga_ManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
