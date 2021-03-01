import { UploadOutlined } from '@ant-design/icons';
import { Modal, Row, Col, Input, Radio, Upload, Button, Spin, List, message } from 'antd';
import React from 'react';

interface ImportTextModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  taskId: string;
}

class ImportTextModal extends React.Component<ImportTextModalProps> {
  state: {
    name: string;
    tag: string[];
    description: string;
    dataset_category: string[];
    dataset_count: number;
    filestatus: string;
    session_id: string;
    timer: any;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      name: '',
      tag: [],
      description: '',
      dataset_category: [],
      dataset_count: 0,
      filestatus: 'none',
      session_id: '',
      timer: null,
    };
  }

  onRadioChange = (e: any) => {
    this.setState({
      tag: [e.target.value],
    });
  };

  handleOk = (e: any) => {
    if (this.state.name == '') {
      message.warn('请填写名称');
      return;
    }
    if (this.state.session_id == '' && this.state.filestatus == 'finished') {
      message.warn('请先上传');
      return;
    }
    fetch('/api/dataset/', {
      method: 'POST',
      body: JSON.stringify({
        name: this.state.name,
        description: this.state.description,
        session_id: this.state.session_id,
        task_id: this.props.taskId,
      }),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(r => {
        if (r.ok) {
          return r.json;
        }
        throw new Error('bad');
      })
      .then(r => {
        message.success('添加成功');
        if (this.props.onSuccess != undefined) {
          this.props.onSuccess();
        }
      })
      .catch(error => {
        message.error('添加失败');
      });
    //console.log(e, this.state);
    this.onCancel(0);
  };

  onUploadStatusChanged = (info: any) => {
    if (info.file.status === 'done') {
      console.log(info.file.response);
      this.setState({
        session_id: info.file.response['session_id'],
        filestatus: 'processing',
      });
      this.setState({
        timer: setInterval(() => {
          fetch('/api/dataset/upload/' + this.state.session_id)
            .then(r => r.json())
            .then(res => {
              this.setState({
                filestatus: res['status'],
              });
              if (res['status'] == 'finished') {
                this.setState({
                  dataset_category: res['label_category'],
                  dataset_count: res['data_num'],
                });
                clearInterval(this.state.timer);
              }
              if (res['status'] == 'error') {
                message.warn(res['info']);
                clearInterval(this.state.timer);
              }
              console.log(res['status']);
            });
        }, 1000),
      });
    }
  };

  onUploadRemoveItem = (file: any) => {
    this.setState({
      uploadDisabled: false,
      dataset_category: [],
      dataset_count: 0,
      filestatus: 'none',
      session_id: '',
      timer: null,
    });
    return true;
  };

  headerProcesser = () => {
    if (this.state.filestatus == 'finished') {
      return <div style={{ fontWeight: 'bold' }}>检测到 {this.state.dataset_count} 条数据</div>;
    } else {
      return <div style={{ fontWeight: 'bold' }}>等待上传</div>;
    }
  };

  onCancel = (e: any) => {
    this.setState({
      name: '',
      tag: [],
      description: '',
      uploadDisabled: false,
      dataset_category: [],
      dataset_count: 0,
      filestatus: 'none',
      session_id: '',
      timer: null,
    });
    this.props.onCancel();
  };

  render() {
    const props = {
      name: 'file',
      action: '/api/dataset/upload',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: this.onUploadStatusChanged,
      onRemove: this.onUploadRemoveItem,
      showUploadList: false,
    };
    return (
      <Modal
        title="导入数据"
        visible={this.props.visible}
        onOk={this.handleOk}
        onCancel={this.onCancel}
      >
        <Row type="flex" justify="space-around" align="middle">
          <Col span={4}>名称：</Col>
          <Col span={8}>
            <Input
              onChange={(e: any) => {
                this.setState({ name: e.target.value });
              }}
              value={this.state.name}
            />
          </Col>
        </Row>
        <Row style={{ height: '40px' }} type="flex" justify="space-around" align="middle">
          <Col span={4}>类型：</Col>
          <Col span={8}>
            <Radio.Group onChange={this.onRadioChange} value={this.state.tag[0]}>
              <Radio value="已标注">已标注</Radio>
              <Radio value="原始">原始</Radio>
            </Radio.Group>
          </Col>
        </Row>
        <Row type="flex" justify="space-around" align="middle">
          <Col span={4}>描述：</Col>
          <Col span={8}>
            <Input
              onChange={(e: any) => {
                this.setState({ description: e.target.value });
              }}
              value={this.state.description}
            />
          </Col>
        </Row>
        <Row type="flex" justify="space-around" align="middle" style={{ marginTop: '20px' }}>
          <Col span={6}>
            <Upload {...props}>
              <Button>
                <UploadOutlined />
                {(() => {
                  if (this.state.session_id != '') {
                    return '已上传';
                  } else {
                    return '点击上传文件';
                  }
                })()}
              </Button>
            </Upload>
          </Col>
        </Row>
        <Row type="flex" justify="space-around" align="middle" style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Spin spinning={this.state.filestatus == 'processing'}>
              <List
                header={this.headerProcesser()}
                bordered
                dataSource={this.state.dataset_category}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </Spin>
          </Col>
        </Row>
      </Modal>
    );
  }
}

export default ImportTextModal;
