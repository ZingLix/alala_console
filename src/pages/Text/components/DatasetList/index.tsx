import { Modal, Row, Col, Card, Radio, Upload, Button, Spin, List, message } from 'antd';
import React from 'react';
import { TextDataType } from './data.d';

interface DatasetListProps {
  datasetList: TextDataType[];
}

class DatasetList extends React.Component<DatasetListProps> {
  state: {
    modalVisible: boolean;
    activeIndex: number;
  };
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      activeIndex: 0,
    };
  }
  componentDidMount() {}

  render() {
    return (
      <Row type="flex" align="middle">
        <Col span={8}>
          <List<TextDataType>
            size="large"
            rowKey="id"
            itemLayout="vertical"
            pagination={{
              onChange: page => {},
              pageSize: 4,
            }}
            dataSource={this.props.datasetList}
            renderItem={(item, index) => (
              <List.Item key={item._id}>
                <List.Item.Meta
                  title={
                    <a
                      onClick={() => {
                        this.setState({ activeIndex: index });
                      }}
                    >
                      {item.name}
                    </a>
                  }
                />
                <div>
                  <div>{item.description}</div>
                </div>
              </List.Item>
            )}
          />
        </Col>
        <Col span={16}>
          <Spin spinning={this.state.activeIndex == -1}>
            <Card style={{ margin: '40px', height: '550px' }}>
              {(() => {
                if (this.props.datasetList.length != 0) {
                  return (
                    <div>
                      <p>文本数量：{this.props.datasetList[this.state.activeIndex]['data_num']}</p>
                      <p>
                        分类：
                        {JSON.stringify(
                          this.props.datasetList[this.state.activeIndex]['label_category'],
                        )}
                      </p>
                    </div>
                  );
                } else {
                  return <div></div>;
                }
              })()}
            </Card>
          </Spin>
        </Col>
      </Row>
    );
  }
}

export default DatasetList;
