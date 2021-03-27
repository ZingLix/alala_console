import { Button, Card, Col, Form, AutoComplete, Select, Switch, Input } from 'antd';
import React, { useState, Component } from 'react';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface ExpressionType {
  expr1?: string;
  expr2?: string[];
  operator?: string;
  regex?: boolean;
  relation?: string;
  negative?: boolean;
}

interface PriceInputProps {
  value?: ExpressionType;
  onChange?: (value: ExpressionType) => void;
  onDelete: () => void;
  isFirst: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange, onDelete, isFirst }) => {
  const [expr1, setExpr1] = useState('{m0}');
  const [expr2, setExpr2] = useState([]);
  const [operator, setOperator] = useState('in');
  const [regex, setRegex] = useState(false);
  const [relation, setRelation] = useState('and');
  const [negative, setNegative] = useState(false);

  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange({ expr1, expr2, operator, regex, relation, negative, ...value, ...changedValue });
    }
  };

  const onExpr1Change = (e: any) => {
    setExpr1(e);
    triggerChange({ expr1: e });
  };
  const onExpr2Change = (e: any) => {
    setExpr2(e);
    triggerChange({ expr2: e });
  };
  const onOperatorChange = (newCurrency: string) => {
    setOperator(newCurrency);
    triggerChange({ operator: newCurrency });
  };
  const onRegexChange = (e: any) => {
    setRegex(e);
    triggerChange({ regex: e });
  };
  const onNegativeChange = (e: any) => {
    setNegative(e);
    triggerChange({ negative: e });
  };
  const onRelationChange = (e: string) => {
    setRelation(e);
    triggerChange({ relation: e });
  };
  return (
    <div>
      最近第
      <Select
        value={value.expr1 || expr1}
        onChange={onExpr1Change}
        style={{ width: 100, marginLeft: 8, marginRight: 8 }}
      >
        {Array.from({ length: 10 }, (_, i) => i).map((field, index, list) => (
          <Option value={`{m${field}}`} key={index}>{field + 1}</Option>
        ))}
      </Select>
      条消息
      <Select
        value={value.operator || operator}
        style={{ width: 80, marginLeft: 8, marginRight: 8 }}
        onChange={onOperatorChange}
      >
        <Option value="equal" key="1">等于</Option>
        <Option value="in" key="2">含有</Option>
      </Select>
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
      > */}
      <br />
      <Select
        mode="tags"
        value={value.expr2 || expr2}
        onChange={onExpr2Change}
        style={{ width: '100%', marginTop: '8px' }}
      ></Select>
      {/* <TagsList ></TagsList> */}
      {/* </div> */}
      <br />
      <div style={{ marginTop: 8 }}>
        正则：
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={value.regex || regex}
          onChange={onRegexChange}
          style={{ marginRight: 8 }}
        />
        取反：
        <Switch
          checkedChildren="开"
          unCheckedChildren="关"
          checked={value.negative || negative}
          onChange={onNegativeChange}
          style={{ marginRight: 8 }}
        />
        {!isFirst && (
          <Select
            value={value.relation || relation}
            style={{ width: 80, marginRight: 8 }}
            onChange={onRelationChange}
          >
            <Option value="and" key="1">and</Option>
            <Option value="or" key="2">or</Option>
          </Select>
        )}
        <Button onClick={onDelete} type="primary" shape="circle" icon={<DeleteOutlined />}></Button>
      </div>
    </div>
  );
};

export default PriceInput;
