import fetch, { Response } from "isomorphic-fetch";

function handleJson(response) {
  try {
    return response.json();
  } catch (e) {
    if (response.status > 399)
      throw new Error("Fetch error: " + response.statusText);
    throw new Error("Error when converting response to JSON");
  }
}

class GraphQLError extends Error {
  errors;

  constructor(errors) {
    super("GraphQL Error");
    this.errors = errors;
  }
}

export default async function graphqlFetch(query, variables, jwt) {
  const result = await fetch(`${process.env.URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
    },
    body: JSON.stringify({ query, variables })
  }).then(handleJson);
  if (result.errors) {
    throw new GraphQLError(result.errors);
  }
  return result.data;
}
