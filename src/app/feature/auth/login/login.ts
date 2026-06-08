import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../../core/enums/app-routes.enum'

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  AppRoutes = AppRoutes;
}
