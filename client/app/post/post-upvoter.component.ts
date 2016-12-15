import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Angular2Apollo } from 'angular2-apollo';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-post-upvoter',
  template: `
    <button (click)="upvote()">
      Upvote
    </button>
  `
})
export class PostUpvoterComponent {
  @Input() postId: number;
  @Output() onVote: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private apollo: Angular2Apollo
  ) {}

  upvote() {
    this.apollo.mutate({
      mutation: gql`
        mutation upvotePost($postId: Int!) {
          upvotePost(postId: $postId) {
            id
            votes
          }
        }
      `,
      variables: {
        postId: this.postId,
      },
    }).toPromise();

    this.onVote.emit(this.postId);
  }
}
