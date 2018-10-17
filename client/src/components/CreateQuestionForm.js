import axios from 'axios';
import React, { Component } from 'react';
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormText
} from 'reactstrap';
import DynamicMultiInput from './DynamicMultiInput';

// TODO:
// - validate before sending
// - reset the form on successful submission

class CreateQuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionText: '',
      image: null,
      answers: [],
      correctAnswersIndexes: []
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onAnswersChange = this.onAnswersChange.bind(this);
  }

  onAnswersChange({ values, checkedIndexes }) {
    if (values) {
      this.setState({
        answers: values
      });
    }
    if (checkedIndexes) {
      this.setState({
        correctAnswersIndexes: checkedIndexes
      });
    }
  }

  handleInputChange(event) {
    const { target } = event;
    const name = target.name;

    let value;

    if (target.type === 'file') {
      value = target.files[0];
    } else if (target.type === 'checkbox') {
      value = target.checked;
    } else {
      value = target.value;
    }

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const data = new FormData();
    data.append('image', this.state.image);
    data.append('text', this.state.questionText);
    data.append('answers', this.state.answers);
    data.append('correctAnswersIndexes', this.state.correctAnswersIndexes);

    try {
      const response = await axios.post('/api/v1/question', data);
      const { id } = response.data;

      alert(`Your question was successfully submitted. here's the id: ${id}`);
    } catch (error) {
      console.error(error);
      alert(`Sorry, your question was NOT submitted! There was an error`);
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <h2>Create a question</h2>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="questionText">Question:</Label>
                <Input
                  type="text"
                  name="questionText"
                  id="questionText"
                  placeholder="Example: Who is the architect of this building?"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup row>
                <Label for="image" sm={2}>
                  Image:
                </Label>
                <Col sm={10}>
                  <Input
                    type="file"
                    name="image"
                    id="image"
                    onChange={this.handleInputChange}
                  />
                  <FormText color="muted">
                    Only files with extensions: *.png, *.jpg, *.jpeg
                  </FormText>
                </Col>
              </FormGroup>
              <DynamicMultiInput
                label="Answers:"
                checkboxLabel="correct"
                onChange={this.onAnswersChange}
              />
              <Button>Submit</Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateQuestionForm;
