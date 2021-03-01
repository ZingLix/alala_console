import request from '@/utils/request';
import { TextDataType } from './data.d';

export async function queryFakeList(): TextDataType[] {
  return [
    {
      id: 1,
      title: '文本1',
      tag: ['原始'],
      description: '文本描述111',
      href: '',
    },
    {
      id: 2,
      title: '文本2',
      tag: ['已标注'],
      description: '文本描述222',
      href: '',
    },
    {
      id: 3,
      title: '文本3',
      tag: ['原始'],
      description: '文本描述112341',
      href: '',
    },
    {
      id: 4,
      title: '文本4',
      tag: ['原始'],
      description: '文本描述6326111',
      href: '',
    },
  ];
}
