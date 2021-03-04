import React from 'react';
import { List } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { StoreBranch } from '@axmit/redux-communications';
import { LoadingSpin } from 'common/components/LoadingSpin';
import { IBaseFilterModel } from 'common/models/requestModels';
import {ItemsNotFound} from "common/components/Text/ItemsNotFound";

interface IComponentProps<Model, Collection extends { data: Model[]; meta: { count?: number } }> {
  elementId: string;
}

interface IComponentState {
  pageIndex: number;
}

abstract class InfiniteListComponent<
  Collection extends { data: Model[]; meta: { count?: number } },
  Model,
  IProps,
  Params = any
> extends React.PureComponent<IComponentProps<Model, Collection> & IProps, IComponentState> {
  constructor(props: IComponentProps<Model, Collection> & IProps) {
    super(props);
    this.state = { pageIndex: 0 };
  }
  componentDidMount(): void {
    this.loadData();
  }

  render() {
    const { elementId } = this.props;
    const collection = this.getCollection();
    const { data: collectionData, loading } = collection;
    const items = collectionData?.data || [];
    const count = collectionData?.meta.count || 0;
    const hasMore = !loading && items.length < count;

    return (
      <InfiniteScroll
        pageStart={1}
        loadMore={() => this.loadData()}
        hasMore={!loading && hasMore}
        useWindow={false}
        getScrollParent={() => document.getElementById(elementId)}
      >
        {collectionData && (
          <List
            itemLayout="vertical"
            dataSource={items}
            renderItem={this.renderListItem}
            locale={{ emptyText: loading ? <div /> : <ItemsNotFound /> }}
          />
        )}
        {loading && <LoadingSpin />}
      </InfiniteScroll>
    );
  }

  loadData = () => {
    const collection = this.getCollection();
    const { pageIndex } = this.state;
    const pageSize = 10;
    const { data: collectionData, loading } = collection;
    const count = collectionData?.meta.count || 0;
    const hasMore = !loading && (!count || count > pageSize * pageIndex);

    if (hasMore) {
      const params: IBaseFilterModel = {
        limit: pageSize,
        offset: pageSize * pageIndex
      };

      this.loadCollection(params);
      this.setState(state => ({ pageIndex: state.pageIndex + 1 }));
    }
  };

  abstract getCollection: () => StoreBranch<Collection, Params>;
  abstract loadCollection: (params: IBaseFilterModel) => void;
  abstract renderListItem: (model: Model) => JSX.Element;
}

export const InfiniteList = InfiniteListComponent;
