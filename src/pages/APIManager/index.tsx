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
  InputNumber,
  Space,
  Modal,
} from 'antd';
import React, { useState, Component, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { GroupType, FriendType } from '../data';
import { APIType } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColumnProps } from 'antd/es/table';
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

function APIManager() {
  const [mtrList, setMtrList] = useState<APIType[]>([]);
  const [curId, setCurId] = useState("");
  const [form] = Form.useForm();
  const [group, setGroup] = useState<GroupType[]>([]);
  const [friend, setFriend] = useState<FriendType[]>([]);

  const refreshData = () => {
    fetch('/api/api')
      .then(r => {
        return r.json();
      })
      .then(r => {
        setMtrList(r);
      });
    fetch("/api/groups").then(r => {
      return r.json()
    }).then(r => {
      setGroup(r)
    });
    fetch("/api/friends").then(r => {
      return r.json()
    }).then(r => {
      setFriend(r)
    })
  };

  useEffect(() => {
    refreshData()
  }, []);

  const setForm = (item: APIType) => {
    setCurId(item._id);
    form.setFieldsValue(item);
  };

  const onFinish = (values: any) => {
    console.log(values)
    var url = '/api/api';
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

  const deleteRule = (rule: APIType) => {
    confirm({
      title: '确认删除该规则？',
      icon: <ExclamationCircleOutlined />,
      content: rule.name,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        fetch('/api/api/' + rule._id, {
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


  const columns: ColumnProps<APIType>[] = [
    {
      title: 'API名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
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
                dataSource={mtrList}
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
                    url: "",
                    name: "",
                    disabled: false,
                    eval: "",
                    creator: "",
                    headers: [],
                    method: "GET",
                    body: ""
                  }}
                  form={form}
                  style={{ overflow: 'auto' }}
                >
                  <Form.Item
                    label="API 名称"
                    name="name"
                    rules={[{ required: true }, { whitespace: false }]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.Item
                    label="API URL"
                    name="url"
                    rules={[{ required: true }]}
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
                  <Form.Item
                    label="方法"
                    name="method"
                    rules={[{ required: true }]}
                  >
                    <Select defaultValue="get" >
                      <Option value="GET">GET</Option>
                      <Option value="POST">POST</Option>
                      <Option value="DELETE">DELETE</Option>
                      <Option value="PUT">PUT</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="后处理代码"
                    name="eval"
                    rules={[]}
                  >
                    <Input></Input>
                  </Form.Item>
                  <Form.List name="headers" >
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <Form.Item label={'请求头 #' + (name + 1)} key={name} rules={[{ required: true }]}>
                            <Space key={key} style={{ display: 'flex' }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'header']}
                                fieldKey={[fieldKey, 'header']}
                                rules={[{ required: true, message: 'Missing first name' }]}
                              >
                                <Input placeholder="Key" />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'content']}
                                fieldKey={[fieldKey, 'content']}
                                rules={[{ required: true, message: 'Missing last name' }]}
                              >
                                <Input placeholder="Value" />
                              </Form.Item>
                              <MinusCircleOutlined onClick={() => remove(name)} />
                            </Space>
                          </Form.Item>
                        ))}
                        <Form.Item {...formItemLayoutWithOutLabel}>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ width: '60%' }}>
                            添加请求头
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                  <Form.Item label="创建者">
                    {form.getFieldValue("creator")}
                  </Form.Item>
                  <Form.Item
                    label="请求体"
                    name="body"
                    rules={[]}
                  >
                    <TextArea autoSize={{ minRows: 3 }}></TextArea>
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

export default APIManager;
