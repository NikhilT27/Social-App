import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import PostCard from "../components/PostCard";

function Home() {
  const { loading, data } = useQuery(FETCH_POST_QUERY);
  console.log("Asda");
  if (data) {
    var { getPosts: posts } = data;
    console.log(posts);
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>loading</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id}>
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

const FETCH_POST_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      comments {
        username
      }
      commentCount
    }
  }
`;

export default Home;
