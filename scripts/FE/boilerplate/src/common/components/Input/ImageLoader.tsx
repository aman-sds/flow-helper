import React from 'react';
import { message, Upload } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import { checkImage, getBase64 } from 'common/helpers/loader.helper';
import { ITokenModel } from 'entities/Auth/Auth.models';
import Icon from 'antd/lib/icon';

interface IImageModel {
  [key: string]: any;
}

interface IComponentProps {
  value?: IImageModel;
  onChange?: (image: IImageModel) => void;
}

interface IComponentState {
  loading: boolean;
}

type AllProps = RouteComponentProps & IComponentProps;

class ImageLoaderComponent extends React.PureComponent<AllProps> {
  state: IComponentState = {
    loading: false
  };

  onChange = (info: any) => {
    const { onChange } = this.props;
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }

    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, () =>
        this.setState({
          loading: false
        })
      );

      if (onChange) {
        onChange(info.file.response);
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  render() {
    const { children, value } = this.props;
    const { loading } = this.state;

    const imageUrl = `/api/images/${value?.id}?size=medium`;
    const props = getProps();

    return (
      <Upload {...props} onChange={this.onChange}>
        {value?.id ? (
          <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
        ) : (
          <div>
            <Icon />
            {children}
          </div>
        )}
      </Upload>
    );
  }
}

export const ImageLoader = withRouter(ImageLoaderComponent);

function getProps() {
  const creds = JSON.parse(localStorage.getItem('creds') || '{}') as ITokenModel;

  return {
    name: 'file',
    action: `/api/images`,
    headers: {
      authorization: `Bearer ${creds?.access?.token}`
    },
    multiple: false,
    listType: 'picture-card' as 'picture-card',
    className: 'avatar-uploader',
    showUploadList: false,
    beforeUpload: checkImage
  };
}
