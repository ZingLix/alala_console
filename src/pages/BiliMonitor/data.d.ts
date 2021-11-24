export interface BiliMonitorType {
  _id: string;
  name: string;
  disabled: boolean;
  uid: number;
  send_msg: string[];
  subs_user: number[];
  subs_group: number[];

}
