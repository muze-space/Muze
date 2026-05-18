import { Component, output } from '@angular/core';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  searchChange = output<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchChange.emit(value);
  }
}
