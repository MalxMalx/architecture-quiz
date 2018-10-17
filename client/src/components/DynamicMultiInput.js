import React, { Component } from 'react';
import { FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import map from 'lodash/map';

class DynamicMultiInput extends Component {
  constructor() {
    super();
    this.state = {
      values: [''],
      maxInputs: 10
    };

    this.addInput = this.addInput.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  isLastElement(index) {
    return this.state.values.length - 1 === index;
  }

  isNotTheOnlyElement() {
    return this.state.values.length > 1;
  }

  addInput() {
    this.setState({
      values: [...this.state.values, '']
    });
  }

  removeInput(index) {
    const newValues = [...this.state.values];

    newValues.splice(index, 1);

    this.setState({
      values: newValues
    });
  }

  handleInputChange(value, index) {
    const newValues = [...this.state.values];

    newValues[index] = value;

    this.setState({
      values: newValues
    });
  }

  isMaxInputsReached() {
    return this.state.values.length >= this.state.maxInputs;
  }

  render() {
    return (
      <FormGroup>
        <Label for="questionText">Answers:</Label>
        {map(this.state.values, (_, index) => {
          return (
            <Row key={index}>
              <Col xs="8">
                <Input
                  type="text"
                  onChange={event =>
                    this.handleInputChange(event.target.value, index)
                  }
                  value={this.state.values[index]}
                />
              </Col>
              <Col xs="2">
                <Row>
                  {this.isNotTheOnlyElement() && (
                    <Col>
                      <Button onClick={() => this.removeInput(index)}>-</Button>
                    </Col>
                  )}
                  {this.isLastElement(index) &&
                    !this.isMaxInputsReached() && (
                      <Col>
                        <Button onClick={this.addInput}>+</Button>
                      </Col>
                    )}
                </Row>
              </Col>
            </Row>
          );
        })}
      </FormGroup>
    );
  }
}

export default DynamicMultiInput;
