const requestFieldsSchema = {
  properties: {
    text: {
      type: 'string'
    },
    answers: {
      type: 'string'
    },
    correctAnswersIndexes: {
      type: 'string'
    }
  },
  required: ['text', 'answers', 'correctAnswersIndexes']
};

export { requestFieldsSchema };
