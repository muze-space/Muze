import { Component } from '@angular/core';
import { Search } from '../../components/search/search';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum';

@Component({
  selector: 'app-header',
  imports: [Search, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly AppRoutes = AppRoutes;

  // searchChange = output<string>();

  // onSearchChange(value: string): void {
  //   this.searchChange.emit(value);
  // }
}
