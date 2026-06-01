import { Component } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [],
  templateUrl: './audio-player.html',
  styleUrl: './audio-player.css',
})
export class AudioPlayer {
   audioUrl =
    'https://prod-1.storage.jamendo.com/?trackid=1214935&format=mp31&from=m%2FRH55uqt37qs1uyEvAd5g%3D%3D%7Ck8HaDdaUpN97QcWF9Bej4A%3D%3D';
}
