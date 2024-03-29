/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Card,
  Row,
  Col,
  Form,
  Table,
  Select,
  Tooltip,
  Skeleton,
  message,
  Typography,
  Modal,
  Popconfirm
} from 'antd';
import React, { useState, Component, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
import {
  SmileOutlined,
  EditOutlined,
  SmileFilled,
  CopyOutlined,
} from '@ant-design/icons';
import { GroupType, FriendType } from '../data';
import { PermissionType } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColumnProps } from 'antd/es/table';
import MessageInput from './msg_input'
import { fromPairs } from '@umijs/deps/compiled/lodash';
import {
  SyncOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;
const { Paragraph } = Typography;

function PermissionManager() {
  const [mtrList, setMtrList] = useState<PermissionType[]>([]);
  const [curId, setCurId] = useState("");
  const [form] = Form.useForm();
  const [group, setGroup] = useState<GroupType[]>([]);
  const [friend, setFriend] = useState<FriendType[]>([]);
  const [role, setRole] = useState<PermissionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const refreshData = () => {
    fetch('/api/permission')
      .then(r => {
        return r.json();
      })
      .then(r => {
        setMtrList(r);
        if (curId == "") {
          setForm(r[0])
        } else {
          console.log("test")
          setForm(r.filter((x: any) => x.username == curId)[0])
        }
        setLoading(false);
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
    fetch('/api/self_permission')
      .then(r => r.json())
      .then(r => setRole(r)
      )
  };

  useEffect(() => {
    refreshData()
  }, []);

  const setForm = (item: PermissionType) => {
    console.log(item)
    setCurId(item.username);
    form.setFieldsValue(item);
  };

  const onFinish = (values: any) => {
    values.group = values.group.map((i: any) => parseInt(i));
    values.person = values.person.map((i: any) => parseInt(i));
    console.log(values)

    var url = '/api/permission/' + curId;

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
        message.success('更新成功');
        refreshData();
        if (curId == '') {
          form.resetFields();
        }
      })
      .catch(e => {
        message.error('更新失败');
      });
  };

  const columns: ColumnProps<PermissionType>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',

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
                rowKey="username"
                rowClassName={(record, index) => {
                  if (record.username == curId) return 'ant-table-row-selected';
                  else return '';
                }}
              ></Table>
            </Col>
            <Col span={16} style={{ paddingLeft: '16px' }}>
              <Card style={{ marginTop: '8px' }}>
                <Skeleton loading={loading}>
                  <Form
                    {...formItemLayout}
                    name="complex-form"
                    onFinish={onFinish}
                    initialValues={{
                      username: "",
                      role: 2,
                      person: [],
                      group: []
                    }}
                    form={form}
                    style={{ overflow: 'auto' }}
                  >
                    <Form.Item
                      label="用户名"
                    //  name="username"
                    //rules={[{ required: true }, { whitespace: false }]}
                    >
                      {form.getFieldValue("username")}
                    </Form.Item>

                    <Form.Item
                      label="角色"
                    //  name="rule_name"
                    //rules={[{ required: true }, { whitespace: false }]}
                    >
                      {((role) => {
                        if (role == 0) return "管理员"
                        else if (role == 1) return "普通用户"
                        else return "未知"
                      })(form.getFieldValue("role"))
                      }
                    </Form.Item>
                    <Form.Item label="相关 QQ" name="person" >
                      <Select mode="tags" disabled={role?.role != 0}>
                        {friend.map((g, idx) => (
                          <Option id={idx} value={g.id}>{g.id} ({g.nickname})</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="相关群" name="group" >
                      <Select mode="tags" disabled={role?.role != 0}>
                        {group.map((g, idx) => (
                          <Option id={idx} value={g.id}>{g.id} ({g.name})</Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Key"  >
                      {form.getFieldValue("key")}

                      <Popconfirm placement="top" title="确定要刷新key？" onConfirm={() => {
                        fetch("/api/key/" + curId, {
                          method: "POST"
                        }).then(r => {
                          if (r.ok) {
                            setRefreshing(true)
                            refreshData()
                            message.success("刷新成功")
                            setRefreshing(false)

                          } else {
                            r.json().then(r => {
                              message.error(r['error'])
                            })
                          }
                        })
                      }}>
                        <Tooltip placement="top" title="刷新">
                          <SyncOutlined spin={refreshing} style={{ marginLeft: "8px" }} />
                        </Tooltip>

                      </Popconfirm >
                      <Tooltip placement="top" title="复制">
                        <CopyOutlined onClick={() => {
                          navigator.clipboard.writeText(form.getFieldValue("key"))
                          message.success("复制成功")
                        }} style={{ marginLeft: "8px" }} />
                      </Tooltip>
                    </Form.Item>
                    <Form.Item label=" " colon={false}>
                      <Button type="primary" htmlType="submit" disabled={role?.role != 0}>
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
                </Skeleton>
              </Card>
            </Col>
          </Row>
        </Card>
      </PageContainer>
    </>
  );

}

export default PermissionManager;
