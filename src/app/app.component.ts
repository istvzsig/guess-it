import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GameComponent } from './components/game.component';

@Component({
  imports: [RouterModule, GameComponent, GameComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'guess-it';
}
