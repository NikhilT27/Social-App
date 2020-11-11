import React, { useContext } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POST_QUERY);

  if (data) {
    var { getPosts: posts } = data;
  }

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
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
