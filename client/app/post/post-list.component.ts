import { Component, OnInit } from '@angular/core';
import { Angular2Apollo, ApolloQueryObservable } from 'angular2-apollo';
import { ApolloQueryResult } from 'apollo-client';

import gql from 'graphql-tag';

@Component({
  selector: 'app-post-list',
  template: `
    <ul>
      <li *ngFor="let post of posts">
        {{post.title}} by {{post.author.firstName}} {{post.author.lastName}}
        ({{post.votes}} votes)
        <app-post-upvoter [postId]="post.id" (onVote)="refresh()"></app-post-upvoter>
      </li>
    </ul>
  `
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  postsObs: ApolloQueryObservable<ApolloQueryResult>;
  
  constructor(
    private apollo: Angular2Apollo
  ) {}

  ngOnInit() {
    this.postsObs = this.apollo.watchQuery({
      query: gql`
        query allPosts {
          posts {
            id
            title
            votes
            author {
              id
              firstName
              lastName
            }
          }
        }
      `,
    });
    
    this.postsObs.subscribe(({data}) => {
      this.posts = data.posts;
      console.log('sub', data);
    });
  }

  refresh() {
    this.postsObs.refetch();
  }
}
