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
import { KeywordsRule } from './data';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColumnProps } from 'antd/es/table';
import { GroupType } from '../data';


const { Option } = Select;
const { confirm } = Modal;


function KeywordsManager() {
  const [keywords, setKeywords] = useState<KeywordsRule[]>([]);
  const [curId, setCurId] = useState("");
  const [form] = Form.useForm();
  const [group, setGroup] = useState<GroupType[]>([]);


  const refreshData = () => {
    fetch('/api/keywords')
      .then(r => {
        return r.json();
      })
      .then(r => {
        setKeywords(r);
      });
    fetch("/api/groups").then(r => {
      return r.json()
    }).then(r => {
      setGroup(r)
    });
  };

  useEffect(() => {
    refreshData()
  }, []);

  const setForm = (item: KeywordsRule) => {
    setCurId(item._id);

    form.setFieldsValue(item);
  };

  const onFinish = (values: KeywordsRule) => {
    console.log(values);
    values.suitable_group = values.suitable_group.map((i: any) => parseInt(i));
    var url = '/api/keywords';
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

  const deleteRule = (rule: KeywordsRule) => {
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


  const columns: ColumnProps<KeywordsRule>[] = [
    {
      title: '名称',
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
            id={index.toString()}
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
                dataSource={keywords}
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
                    name: "",
                    disabled: false,
                    keywords: [],
                    recall: false,
                    mute_time: 0,
                    unmute_list: [],
                    suitable_group: []
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
                  <Form.Item label="关键词列表" name="keywords" rules={[{ required: true }]}>
                    <Select mode="tags">

                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="撤回"
                    name="recall"
                    valuePropName="checked"
                    rules={[{ required: true }]}
                  >
                    <Switch></Switch>
                  </Form.Item>
                  <Form.Item
                    label="禁言时长"
                    name="mute_time"
                    rules={[{ required: true }]}
                  >
                    <InputNumber></InputNumber>
                  </Form.Item>
                  <Form.Item label="取消禁言列表" name="unmute_list" >
                    <Select mode="tags">
                    </Select>
                  </Form.Item>
                  <Form.Item label="适用群号" name="suitable_group" rules={[{ required: true }]}>
                    <Select mode="tags">
                      {group.map((g, idx) => (
                        <Option id={g.id} value={g.id}>{g.id} ({g.name})</Option>
                      ))}
                    </Select>
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

export default KeywordsManager;
