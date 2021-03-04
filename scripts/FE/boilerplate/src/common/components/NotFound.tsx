import React from 'react';

interface IComponentProps {
  label?: string;
}

type AllProps = IComponentProps;

export class NotFound extends React.PureComponent<AllProps> {
  render() {
    const { label } = this.props;

    return <span>{label || 'Not found'}</span>;
  }
}
