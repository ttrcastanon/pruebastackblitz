import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesObjectsComponent } from './modules-objects.component';

describe('ModulesObjectsComponent', () => {
  let component: ModulesObjectsComponent;
  let fixture: ComponentFixture<ModulesObjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulesObjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulesObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
