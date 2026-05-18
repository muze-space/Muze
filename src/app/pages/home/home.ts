import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { Footer } from '../../footer/footer';
import { PopularTracks } from "../../components/popular-tracks/popular-tracks";

@Component({
  selector: 'app-home',
  imports: [Header, Footer, PopularTracks],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
