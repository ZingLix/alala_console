/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Table,
  Select,
  Switch,
  Input,
  message,
  Slider,
  Modal,
} from 'antd';
import React, { useState, Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from '@ant-design/compatible/es/form';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { connect } from 'dva';
import { StateType } from './model';
import DatasetList from './components/DatasetList';
import StandardFormRow from './components/StandardFormRow';
import TagSelect from './components/TagSelect';
import styles from './style.less';
import ImportTextModal from './components/ImportTextModal';
import { TextDataType } from './components/DatasetList/data';
import TagsList from './components/TagsList';
import VarInput from './components/DoubleInput';
import ExprInput from './components/ExpressionInput';
import { RuleType } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColumnProps } from 'antd/es/table';

const { Search } = Input;
const { Option } = Select;

const { confirm } = Modal;

interface TextProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  text: StateType;
  loading: boolean;
}

class Text extends Component<TextProps> {
  form: any;
  state: {
    rules: RuleType[];
    curId: string;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      rules: [],
      curId: '',
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  refreshData = () => {
    fetch('/api/rules')
      .then(r => {
        return r.json();
      })
      .then(r => {
        this.setState({ rules: r });
      });
  };

  onModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  checkPrice = (rule: any, value: any) => {
    if (value != undefined && value.expr2 != '') {
      return Promise.resolve();
    }
    return Promise.reject('Price must be greater than zero!');
  };
  checkVar = (rule: any, value: any) => {
    if (value != undefined && value.varlist != []) {
      return Promise.resolve();
    }
    return Promise.reject('Price must be greater than zero!');
  };
  showModal = (e: any) => {
    this.setState({ modalVisible: true });
  };
  setForm = (item: RuleType) => {
    this.setState({ curId: item._id });

    this.form.setFieldsValue(item);
  };

  onFinish = (values: any) => {
    console.log(values);
    if (values.exprs == undefined) {
      message.warn('至少存在一个条件');
      return;
    }
    var url = '/api/rules';
    if (this.state.curId != '') {
      url += '/' + this.state.curId;
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'content-type': 'application/json',
      },
    })
      .then(r => {
        if (r.ok) return r.json();
        throw new Error('bad');
      })
      .then(r => {
        message.success('添加成功');
        this.refreshData();
        if (this.state.curId == '') {
          this.form.resetFields();
        }
      })
      .catch(e => {
        message.error('添加失败');
      });
  };

  deleteRule = (rule: RuleType) => {
    confirm({
      title: '确认删除该规则？',
      icon: <ExclamationCircleOutlined />,
      content: rule.name,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        fetch('/api/rules/' + rule._id, {
          method: 'DELETE',
        })
          .then(r => {
            if (r.ok) return r.json();
            throw new Error('bad');
          })
          .then(r => {
            message.success('删除成功');
            this.refreshData();
          })
          .catch(e => {
            message.error('删除失败');
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  render() {
    const columns: ColumnProps<RuleType>[] = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        render: (text: String, record: RuleType, index: number) => {
          return (
            <div
              style={(() => {
                if (record.disabled) {
                  return { color: 'red' };
                } else {
                  return {};
                }
              })()}
            >
              {text}
            </div>
          );
        },
      },
      {
        title: '优先度',
        dataIndex: 'priority',
        key: 'priority',
        sorter: (a: any, b: any) => a.priority - b.priority,
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '触发概率',
        dataIndex: 'probability',
        key: 'probability',
        sorter: (a: any, b: any) => a.probability - b.probability,
        sortDirections: ['descend', 'ascend'],
        render: (text: RuleType) => `${text}%`,
      },
      {
        title: '操作',
        dataInex: '_id',
        render: (text: RuleType, record: RuleType, index: number) => {
          return (
            <ButtonGroup>
              <Button
                onClick={() => {
                  this.setForm(text);
                }}
                icon={<EditOutlined />}
              ></Button>
              <Button
                onClick={() => {
                  this.deleteRule(text);
                }}
                icon={<DeleteOutlined></DeleteOutlined>}
              ></Button>
            </ButtonGroup>
          );
        },
        key: 'age',
      },
    ];
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    return (
      <>
        <Card bordered={false} bodyStyle={{ padding: '8px 32px 16px 32px' }}>
          <Row style={{ height: '100%' }}>
            <Col span={8}>
              <Table
                columns={columns}
                dataSource={this.state.rules}
                style={{ marginTop: '4px' }}
                rowKey="_id"
                rowClassName={(record, index) => {
                  if (record._id == this.state.curId) return 'ant-table-row-selected';
                  else return '';
                }}
              ></Table>
            </Col>
            <Col span={16} style={{ paddingLeft: '16px' }}>
              <Button
                type="primary"
                onClick={() => {
                  this.setState({ curId: '' }, () => {
                    this.form.resetFields();
                  });
                }}
                style={{ marginTop: '4px' }}
              >
                新建
              </Button>
              <Card style={{ marginTop: '8px' }}>
                <Form
                  {...formItemLayout}
                  name="complex-form"
                  onFinish={this.onFinish}
                  initialValues={{
                    name: '',
                    reply: '',
                    vars: [],
                    priority: 50,
                    disabled: false,
                    probability: 50,
                  }}
                  ref={r => (this.form = r)}
                  style={{ overflow: 'auto' }}
                >
                  <Form.Item
                    label="规则名称"
                    name="name"
                    rules={[{ required: true }, { whitespace: false }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="停用"
                    name="disabled"
                    valuePropName="checked"
                    rules={[{ required: true }]}
                  >
                    <Switch></Switch>
                  </Form.Item>
                  <Form.List name="exprs">
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          {fields.map((field, index, list) => (
                            <Form.Item label={'条件 #' + (index + 1)} key={index}>
                              <Form.Item {...field} rules={[{ validator: this.checkPrice }]}>
                                <ExprInput
                                  onDelete={() => {
                                    remove(field.name);
                                  }}
                                  isFirst={index == 0}
                                ></ExprInput>
                              </Form.Item>
                            </Form.Item>
                          ))}

                          <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                              }}
                              style={{ width: '60%' }}
                            >
                              <PlusOutlined /> 添加条件
                            </Button>
                          </Form.Item>
                        </div>
                      );
                    }}
                  </Form.List>
                  <Form.Item
                    label="回复"
                    name="reply"
                    rules={[{ required: true }, { whitespace: false }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.List name="vars">
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          {fields.map((field, index, list) => (
                            <Form.Item label={'变量 #' + (index + 1)} key={index}>
                              <Form.Item {...field} rules={[{ validator: this.checkVar }]}>
                                <VarInput
                                  onDelete={() => {
                                    remove(field.name);
                                  }}
                                  isFirst={index == 0}
                                ></VarInput>
                              </Form.Item>
                            </Form.Item>
                          ))}

                          <Form.Item {...formItemLayoutWithOutLabel}>
                            <Button
                              type="dashed"
                              onClick={() => {
                                add();
                              }}
                              style={{ width: '60%' }}
                            >
                              <PlusOutlined /> 添加变量
                            </Button>
                          </Form.Item>
                        </div>
                      );
                    }}
                  </Form.List>
                  <Form.Item label="优先度" name="priority" rules={[{ required: true }]}>
                    <Slider min={0} max={100} style={{ width: '200px' }} />
                  </Form.Item>
                  <Form.Item label="触发概率" name="probability" rules={[{ required: true }]}>
                    <Slider min={0} max={100} style={{ width: '200px' }} />
                  </Form.Item>
                  <Form.Item label="适用群号" name="suitable_group" rules={[{ required: true }]}>
                    <Select mode="tags"></Select>
                  </Form.Item>
                  <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit">
                      添加
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      </>
    );
  }
}

export default Text;
