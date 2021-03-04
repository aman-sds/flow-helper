import React from 'react';
import { Spin } from 'antd';

export const LoadingSpin: React.FunctionComponent = () => {
  return (
      <div style={{ textAlign: 'center' }}>
        <Spin size="large" />
      </div>
  );
};
