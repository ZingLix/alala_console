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
import React, { useState, Component, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { GroupType } from '../data';
import { RuleType } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColumnProps } from 'antd/es/table';
import ExprInput from './expression_input';
import VarInput from './var_input';
import ApiInput from './api_input';
import { APIType } from "../APIManager/data";

const { Option } = Select;
const { confirm } = Modal;


function RulesManager() {
  const [rules, setRules] = useState([]);
  const [curId, setCurId] = useState("");
  const [form] = Form.useForm();
  const [group, setGroup] = useState<GroupType[]>([]);
  const [api, setApi] = useState<APIType[]>([]);

  const refreshData = () => {
    fetch('/api/rules')
      .then(r => {
        return r.json();
      })
      .then(r => {
        setRules(r);
      });
    fetch("/api/groups").then(r => {
      return r.json()
    }).then(r => {
      setGroup(r)
    });
    fetch("/api/api").then(r => {
      return r.json()
    }).then(r => {
      setApi(r)
    });
  };

  useEffect(() => {
    refreshData()
  }, []);
  const checkPrice = (rule: any, value: any) => {
    if (value != undefined && value.expr2 != '') {
      return Promise.resolve();
    }
    return Promise.reject('Price must be greater than zero!');
  };
  const checkVar = (rule: any, value: any) => {
    if (value != undefined && value.varlist != []) {
      return Promise.resolve();
    }
    return Promise.reject('Price must be greater than zero!');
  };

  const setForm = (item: RuleType) => {
    setCurId(item._id);

    form.setFieldsValue(item);
  };

  const onFinish = (values: any) => {
    console.log(values);
    if (values.exprs == undefined) {
      message.warn('至少存在一个条件');
      return;
    }
    values.suitable_group = values.suitable_group.map((i: any) => parseInt(i));
    var url = '/api/rules';
    if (curId != '') {
      url += '/' + curId;
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
        refreshData();
        if (curId == '') {
          form.resetFields();
        }
      })
      .catch(e => {
        message.error('添加失败');
      });
  };

  const deleteRule = (rule: RuleType) => {
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
            refreshData();
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
      dataIndex: '_id',
      render: (text, record, index) => {

        return (
          <ButtonGroup>
            <Button
              onClick={() => {
                setForm(record);
              }}
              icon={<EditOutlined />}
            ></Button>
            <Button
              onClick={() => {
                deleteRule(record);
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
      <PageContainer className={styles.main}>
        <Card bordered={false} bodyStyle={{ padding: '8px 32px 16px 32px' }}>
          <Row style={{ height: '100%' }}>
            <Col span={8}>
              <Table
                columns={columns}
                dataSource={rules}
                style={{ marginTop: '4px' }}
                rowKey="_id"
                rowClassName={(record, index) => {
                  if (record._id == curId) return 'ant-table-row-selected';
                  else return '';
                }}
              ></Table>
            </Col>
            <Col span={16} style={{ paddingLeft: '16px' }}>
              <Button
                type="primary"
                onClick={() => {
                  setCurId("");
                  form.resetFields();
                }}
                style={{ marginTop: '4px' }}
              >
                新建
              </Button>
              <Card style={{ marginTop: '8px' }}>
                <Form
                  {...formItemLayout}
                  name="complex-form"
                  onFinish={onFinish}
                  initialValues={{
                    name: '',
                    reply: '',
                    vars: [],
                    priority: 50,
                    disabled: false,
                    probability: 50,
                  }}
                  form={form}
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
                              <Form.Item {...field} rules={[{ validator: checkPrice }]}>
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
                    rules={[{ whitespace: false }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.List name="vars">
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          {fields.map((field, index, list) => (
                            <Form.Item label={'变量 #' + (index + 1)} key={index}>
                              <Form.Item {...field} rules={[{ validator: checkVar }]}>
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
                  <Form.List name="api">
                    {(fields, { add, remove }) => {
                      return (
                        <div>
                          {fields.map((field, index, list) => (
                            <Form.Item label={'API 变量 #' + (index + 1)} key={index}>
                              <Form.Item {...field} rules={[{ validator: checkVar }]}>
                                <ApiInput
                                  onDelete={() => {
                                    remove(field.name);
                                  }}
                                  api_list={api}
                                  isFirst={index == 0}
                                ></ApiInput>
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
                              <PlusOutlined /> 添加 API 变量
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
                    <Select mode="tags">
                      {group.map((g, idx) => (
                        <Option id={idx} value={g.id}>{g.id} ({g.name})</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="创建者">
                    {form.getFieldValue("creator")}
                  </Form.Item>
                  <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit">
                      {(() => {
                        if (curId != "") {
                          return "更新"
                        } else {
                          return "添加"
                        }
                      })()}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
          </Row>
        </Card>
      </PageContainer>
    </>
  );

}

export default RulesManager;
