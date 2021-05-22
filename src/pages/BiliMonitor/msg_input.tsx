import { Button, Card, Col, Form, Row, Select, Switch, Input } from 'antd';
import React, { useState, Component } from 'react';

import { DeleteOutlined } from '@ant-design/icons';


const { Search } = Input;
const { Option } = Select;

const pageSize = 5;

interface MessageInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onDelete: () => void;
  couldDelete: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ value = "", onChange, onDelete, couldDelete }) => {
  const [msg, setMsg] = useState('');


  const onMsgChange = (e: any) => {
    setMsg(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }

  };

  return (
    <Row>
      <Input
        type="text"
        value={value || msg}
        onChange={onMsgChange}
        style={{
          width: "90%", marginRight: 8
        }}
      />
      <Button onClick={onDelete} type="primary" shape="circle" icon={<DeleteOutlined />} disabled={couldDelete}></Button>
    </Row>
  );
};

export default MessageInput;
