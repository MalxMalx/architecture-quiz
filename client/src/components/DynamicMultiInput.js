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
    this.setState(state => {
      const values = [...state.values, ''];

      this.emitOnChange({ values });
      return {
        values
      };
    });
  }

  removeInput(index) {
    this.setState(state => {
      const values = [...state.values];

      values.splice(index, 1);
      this.emitOnChange({ values });
      return {
        values
      };
    });
  }

  handleInputChange(value, index) {
    this.setState(state => {
      const values = [...state.values];

      values[index] = value;
      this.emitOnChange({ values });
      return {
        values
      };
    });
  }

  isMaxInputsReached() {
    return this.state.values.length >= this.state.maxInputs;
  }

  handleCheckedChange(event, index) {
    if (event.target.checked) {
      this.setState(state => {
        const checkedIndexes = [...state.checkedIndexes, index];

        this.emitOnChange({ checkedIndexes });
        return {
          checkedIndexes
        };
      });
    } else {
      this.setState(state => {
        const checkedIndexes = [...state.checkedIndexes];

        checkedIndexes.splice(index, 1);
        return {
          checkedIndexes
        };
      });
    }
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
