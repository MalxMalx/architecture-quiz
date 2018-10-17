import React, { Component } from 'react';
import { FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';
import map from 'lodash/map';

class DynamicMultiInput extends Component {
  constructor() {
    super();
    this.state = {
      values: [''],
      maxInputs: 10,
      checkedIndexes: []
    };

    this.addInput = this.addInput.bind(this);
    this.removeInput = this.removeInput.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
  }

  isLastElement(index) {
    return this.state.values.length - 1 === index;
  }

  isNotTheOnlyElement() {
    return this.state.values.length > 1;
  }

  addInput() {
    const values = [...this.state.values, ''];
    this.setState({
      values
    });
    this.emitOnChange({ values });
  }

  removeInput(index) {
    const values = [...this.state.values];

    values.splice(index, 1);

    this.setState({
      values
    });
    this.emitOnChange({ values });
  }

  handleInputChange(value, index) {
    const values = [...this.state.values];

    values[index] = value;
    this.setState({
      values
    });
    this.emitOnChange({ values });
  }

  isMaxInputsReached() {
    return this.state.values.length >= this.state.maxInputs;
  }

  handleCheckedChange(event, index) {
    let checkedIndexes;
    if (event.target.checked) {
      checkedIndexes = [...this.state.checkedIndexes, index];
      this.setState({
        checkedIndexes
      });
    } else {
      checkedIndexes = [...this.state.checkedIndexes];

      checkedIndexes.splice(index, 1);
      this.setState({
        checkedIndexes
      });
    }
    this.emitOnChange({ checkedIndexes });
  }

  emitOnChange(partialState) {
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(partialState);
    }
  }

  render() {
    return (
      <FormGroup>
        <Label>{this.props.label}</Label>
        {map(this.state.values, (_, index) => {
          const name = 'input-' + index;

          return (
            <Row className="mb-4" key={index}>
              <Col xs="8">
                <Input
                  name={name}
                  type="text"
                  onChange={event =>
                    this.handleInputChange(event.target.value, index)
                  }
                  value={this.state.values[index]}
                />
              </Col>
              <Col xs="2">
                <Row>
                  <Col xs="6">
                    <Label check>
                      <Input
                        type="checkbox"
                        onChange={event =>
                          this.handleCheckedChange(event, index)
                        }
                      />
                      {this.props.checkboxLabel}
                    </Label>
                  </Col>
                  {this.isNotTheOnlyElement() && (
                    <Col xs="3">
                      <Button onClick={() => this.removeInput(index)}>-</Button>
                    </Col>
                  )}
                  {this.isLastElement(index) &&
                    !this.isMaxInputsReached() && (
                      <Col xs="3">
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
