import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../core/enums/app-routes.enum';

@Component({
  selector: 'app-library',
  imports: [RouterLink],
  templateUrl: './library.html',
  styleUrl: './library.css',
})
export class Library {
  protected readonly AppRoutes = AppRoutes;
}
