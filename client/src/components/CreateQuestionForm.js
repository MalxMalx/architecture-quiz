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
import axios from 'axios';

// answers
// correctAnswers

class CreateQuestionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionText: '',
      image: null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    // alert(`You have submitted a question: ${this.state.questionText}`);

    const data = new FormData();
    data.append('image', this.state.image);
    data.append('text', this.state.questionText);

    await axios.post('/api/v1/question', data);
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
              <br />
              <Button>Submit</Button>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CreateQuestionForm;
