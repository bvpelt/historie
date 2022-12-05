import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTextComponent } from './history-text.component';

describe('HistoryTextComponent', () => {
  let component: HistoryTextComponent;
  let fixture: ComponentFixture<HistoryTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
