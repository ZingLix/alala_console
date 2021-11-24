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
import { GroupType, FriendType } from '../data';
import { BiliMonitorType } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColumnProps } from 'antd/es/table';
import MessageInput from './msg_input'

const { Option } = Select;
const { confirm } = Modal;


function BiliMonitor() {
  const [mtrList, setMtrList] = useState<BiliMonitorType[]>([]);
  const [curId, setCurId] = useState("");
  const [form] = Form.useForm();
  const [group, setGroup] = useState<GroupType[]>([]);
  const [friend, setFriend] = useState<FriendType[]>([]);

  const refreshData = () => {
    fetch('/api/bili_monitor')
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

  const setForm = (item: BiliMonitorType) => {
    setCurId(item._id);
    form.setFieldsValue(item);
  };

  const onFinish = (values: any) => {
    values.subs_group = values.subs_group.map((i: any) => parseInt(i));
    values.subs_user = values.subs_user.map((i: any) => parseInt(i));
    values.uid = parseInt(values.uid)

    var url = '/api/bili_monitor';
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

  const deleteRule = (rule: BiliMonitorType) => {
    confirm({
      title: '确认删除该规则？',
      icon: <ExclamationCircleOutlined />,
      content: rule.name,
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        fetch('/api/bili_monitor/' + rule._id, {
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


  const columns: ColumnProps<BiliMonitorType>[] = [
    {
      title: 'UP主名称',
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
                    rule_name: "",
                    name: "",
                    disabled: false,
                    uid: "",
                    send_msg: [],
                    subs_user: [],
                    subs_group: []
                  }}
                  form={form}
                  style={{ overflow: 'auto' }}
                >

                  <Form.Item
                    label="UP主 id"
                    name="uid"
                    extra={(() => {
                      if (curId == "") return null;
                      return form.getFieldValue("name");
                    })()}
                    rules={[{ required: true }]}
                  >
                    <InputNumber style={{ width: "100%" }}></InputNumber >
                  </Form.Item>
                  <Form.Item
                    label="停用"
                    name="disabled"
                    valuePropName="checked"
                    rules={[{ required: true }]}
                  >
                    <Switch></Switch>
                  </Form.Item>

                  <Form.List name="send_msg">
                    {(fields, { add, remove }) => {
                      if (fields.length == 0) {
                        add()
                      }
                      return (
                        <div>
                          {fields.map((field, index, list) => (

                            <Form.Item label={'回复 #' + (index + 1)} key={index} rules={[{ required: true }]} tooltip={<div>
                              bvid:   视频id
                              <br />
                              url:   视频链接
                              <br />
                              title:   视频标题
                              <br />
                              author:   作者
                              <br />
                              description:   描述
                              <br />
                              length:   时长
                              <br />
                              newline:   换行
                              <br />
                              comment:   评论数
                              <br />
                              play:   播放数
                            </div>}>
                              <Form.Item {...field} rules={[{
                                validator: (rule, value) => {
                                  if (value != undefined && value != "") {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject("请输入回复")
                                }
                              }]}>
                                <MessageInput
                                  onDelete={() => {
                                    remove(field.name);
                                  }}
                                  couldDelete={fields.length == 1}
                                ></MessageInput>
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
                              <PlusOutlined /> 添加回复
                            </Button>
                          </Form.Item>
                        </div>
                      );
                    }}
                  </Form.List>
                  <Form.Item label="订阅QQ" name="subs_user" >
                    <Select mode="tags">
                      {friend.map((g, idx) => (
                        <Option id={idx} value={g.id}>{g.id} ({g.nickname})</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="订阅群号" name="subs_group" >
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

export default BiliMonitor;
