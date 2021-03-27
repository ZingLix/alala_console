import { Button, Card, Col, Form, AutoComplete, Select, Switch, Input } from 'antd';
import React, { useState, Component } from 'react';

import { DeleteOutlined } from '@ant-design/icons';


const { Search } = Input;
const { Option } = Select;

const pageSize = 5;

interface ExpressionType {
  varname?: string;
  varlist?: string[];
}

interface PriceInputProps {
  value?: ExpressionType;
  onChange?: (value: ExpressionType) => void;
  onDelete: () => void;
  isFirst: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange, onDelete, isFirst }) => {
  const [varname, setVarname] = useState('');
  const [varlist, setVarlist] = useState([]);

  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange({ varname, varlist, ...value, ...changedValue });
    }
  };

  const onVarname = (e: any) => {
    setVarname(e.target.value);
    triggerChange({ varname: e.target.value });
  };
  const onVarlistChange = (e: any) => {
    setVarlist(e);
    triggerChange({ varlist: e });
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
        mode="tags"
        value={value.varlist || varlist}
        onChange={onVarlistChange}
        style={{ width: '100%', marginTop: '8px' }}
      ></Select>
    </div>
  );
};

export default PriceInput;
