import React, { Component } from 'react';
import CreateQuestionForm from './CreateQuestionForm';
import { Row, Col } from 'reactstrap';

class AdminPanel extends Component {
  render() {
    return (
      <Row>
        <Col>
          <CreateQuestionForm />
        </Col>
      </Row>
    );
  }
}

export default AdminPanel;
