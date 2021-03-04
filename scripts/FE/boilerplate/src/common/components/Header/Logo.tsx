import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import logo from 'app/assets/images/logo.png';

export default function Logo(): JSX.Element {
  return (
    <Row className="flex-noWrap" align="middle" gutter={{ xs: 4, sm: 8 }}>
      <Col>
        <Link to="/">
          <img className="header__logo-img_width" src={logo} alt="logo" />
        </Link>
      </Col>

      <Col className="width-max-full">
        <Link className="basic-title color-black" to="/">
          Project name
        </Link>
      </Col>
    </Row>
  );
};
