export default `#graphql
extend type Query {
   surveys: [Survey!]! @auth
 }
 type SurveyAnswer {
    image: String
    answer: String!
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    date: DateTime!
    didAnswer: Boolean
  }
`;
