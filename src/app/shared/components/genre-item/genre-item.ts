import { Component, input } from '@angular/core';

@Component({
  selector: 'app-genre-item',
  imports: [],
  templateUrl: './genre-item.html',
  styleUrl: './genre-item.css',
})
export class GenreItem {
  genreLabel = input.required<string>();
}
