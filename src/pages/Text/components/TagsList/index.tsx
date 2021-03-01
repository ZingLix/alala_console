import React from 'react';
import { Descriptions, Tag, Typography, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface TagsListProps {
  tags: string[];
  onChange: (_: string[]) => void;
}

class TagsList extends React.Component<TagsListProps> {
  input: any;
  state: {
    inputVisible: boolean;
    inputValue: string;
  };

  constructor(props: any) {
    super(props);
    this.state = {
      inputVisible: false,
      inputValue: '',
    };
  }

  handleClose = (removedTag: string) => {
    const tags = this.props.tags.filter(tag => tag !== removedTag);
    this.props.onChange(tags);
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e: any) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.props;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      this.props.onChange(tags);
    }
    this.setState({
      inputVisible: false,
      inputValue: '',
    });
  };
  render() {
    const { inputVisible, inputValue } = this.state;
    return (
      <span >
        {this.props.tags.map((tag, index) => {
          return (
            <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
              {tag}
            </Tag>
          );
        })}
        {inputVisible && (
          <Input
            ref={input => (this.input = input)}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && (
          <Tag className="site-tag-plus" onClick={this.showInput}>
            <PlusOutlined />
          </Tag>
        )}
      </span>
    );
  }
}

export default TagsList;
