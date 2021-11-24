import { Button, Card, Col, Form, AutoComplete, Select, Switch, Input } from 'antd';
import React, { useState, Component } from 'react';
import { APIType } from "../APIManager/data";
import { DeleteOutlined } from '@ant-design/icons';


const { Search } = Input;
const { Option } = Select;

const pageSize = 5;

interface ApiExpressionType {
  varname?: string;
  api_id?: string;
}

interface PriceInputProps {
  value?: ApiExpressionType;
  onChange?: (value: ApiExpressionType) => void;
  onDelete: () => void;
  api_list: APIType[];
  isFirst: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange, onDelete, api_list, isFirst }) => {
  const [varname, setVarname] = useState('');
  const [api_id, setApiId] = useState('');

  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange({ varname, api_id, ...value, ...changedValue });
    }
  };

  const onVarname = (e: any) => {
    setVarname(e.target.value);
    triggerChange({ varname: e.target.value });
  };
  const onVarlistChange = (e: any) => {
    setApiId(e);
    triggerChange({ api_id: e });
  };

  return (
    <div>
      <Input
        type="text"
        value={value.varname || varname}
        onChange={onVarname}
        style={{ width: 100, marginRight: 8 }}
      />

      {/* <div
        style={{
          display: 'inline-block',
          border: '1px solid',
          borderColor: '#d9d9d9',
          height: '32px',
          verticalAlign: 'middle',
          lineHeight: 1.5715,
          padding: '4px 8px 4px 8px',
          marginRight: '8px',
        }}
      >
        <TagsList tags={value.varlist || varlist} onChange={onVarlistChange}></TagsList>
      </div> */}
      <Button onClick={onDelete} type="primary" shape="circle" icon={<DeleteOutlined />}></Button>
      <br />
      <Select
        value={value.api_id || api_id}
        onChange={onVarlistChange}
        style={{ width: '100%', marginTop: '8px' }}
      >
        {api_list.map((item: APIType) => (<Option key={item._id} value={item._id}>{item.name}</Option>))}
      </Select>
    </div>
  );
};

export default PriceInput;
