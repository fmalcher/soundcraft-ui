import { Input, Component, OnInit } from '@angular/core';
import { SendChannel } from 'soundcraft-ui-connection';

@Component({
  selector: 'soundcraft-ui-prepost',
  templateUrl: './prepost.component.html',
  styleUrls: ['./prepost.component.css'],
})
export class PrepostComponent implements OnInit {
  @Input() channel: SendChannel;

  post: boolean;

  constructor() {}

  ngOnInit(): void {
    this.channel.post$.subscribe(value => (this.post = !!value));
  }
}
