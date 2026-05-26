import { Component, output } from '@angular/core';
import { Search } from '../../components/search/search';

@Component({
  selector: 'app-header',
  imports: [Search],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  searchChange = output<string>();

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }
}
