import React, { Component } from 'react';
import {
  FormText,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col
} from 'reactstrap';
import map from 'lodash/map';

class DynamicMultiFileInput extends Component {
  constructor() {
    super();
    this.state = {
      files: [null],
      maxInputs: 10
    };
  }

  isLastElement(index) {
    return this.state.files.length - 1 === index;
  }

  isNotTheOnlyElement() {
    return this.state.files.length > 1;
  }

  addInput = () => {
    this.setState(state => {
      const files = [...state.files, null];

      this.emitOnChange({ files });
      return {
        files
      };
    });
  };

  removeInput = index => {
    this.setState(state => {
      const files = [...state.files];

      files.splice(index, 1);
      this.emitOnChange({ files });
      return {
        files
      };
    });
  };

  handleInputChange = (event, index) => {
    const [file] = event.target.files;

    if (!file) return;

    this.setState(state => {
      const files = [...state.files];

      files[index] = file;
      const changedState = { files };

      this.emitOnChange(changedState);

      return changedState;
    });
  };

  isMaxInputsReached() {
    return this.state.files.length >= this.state.maxInputs;
  }

  emitOnChange(partialState) {
    console.log(partialState);
    const { onChange } = this.props;
    if (typeof onChange === 'function') {
      onChange(partialState);
    }
  }

  render() {
    return (
      <FormGroup row>
        <Label for="image" sm={2}>
          {this.props.label}
        </Label>
        <Col sm={10}>
          {map(this.state.files, (_, index) => {
            const name = 'input-' + index;

            return (
              <Row className="mb-4" key={index}>
                <Col xs="8">
                  <Input
                    type="file"
                    id="image"
                    onChange={event => this.handleInputChange(event, index)}
                    name={name}
                  />
                </Col>
                <Col xs="2">
                  <Row>
                    {this.isNotTheOnlyElement() && (
                      <Col xs="3">
                        <Button onClick={() => this.removeInput(index)}>
                          -
                        </Button>
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
          <FormText color="muted">
            Only files with extensions: *.png, *.jpg, *.jpeg
          </FormText>
        </Col>
      </FormGroup>
    );
  }
}

export default DynamicMultiFileInput;
