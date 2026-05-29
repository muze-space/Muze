import { Component } from '@angular/core';
import { TeamMember } from './models/team-member.model';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  readonly teamMembers: TeamMember[] = [
    {
      name: 'Ihar Leshchanka',
      role: 'Frontend Developer',
      bio: 'Builds clean and practical web interfaces, works with Angular, creates reusable components, and pays attention to code quality and maintainable project structure. Outside of coding, he is interested in learning new tools and improving development workflows.',
      photoUrl: 'https://github.com/ileshchanka.png',
      githubUrl: 'https://github.com/ileshchanka',
    },
    {
      name: 'Vladyslava Nikitchenko',
      role: 'Frontend Developer',
      bio: 'Turns ideas into clean, user-friendly interfaces. She works with Angular, builds reusable components, and pays close attention to responsive layout and accessibility. In everyday work she values teamwork, clear communication, and steady, reliable progress.',
      photoUrl: 'https://github.com/vladaworkflow-ops.png',
      githubUrl: 'https://github.com/vladaworkflow-ops',
    },
  ];
}
