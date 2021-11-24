export interface RuleType {
  _id: string;
  name: string;
  exprs: {
    expr1: string;
    expr2: string[];
    operator: string;
    regex: boolean;
    relation: string;
  }[];
  reply: string;
  priority: number;
  probability: number;
  disabled: boolean;
  vars: {
    varname: string;
    varlist: string[];
  }[];
  api: {
    name: string;
    api_id: string;
  }[];
  suitable_group: number[];
}
