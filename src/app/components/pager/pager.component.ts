import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  imports: [CommonModule],
})
export class PagerComponent implements OnInit {
  @Input() totalPages: number = 0;
  @Input() currentPage: number = 0;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  handlePageChange(page: number) {
    this.pageChange.emit(page);
  }
}
