import {Message_Asset_Intf} from './message_asset_intf';
export interface Data_Asset_Intf{
    [key:string]:any;
    Message:
      Array<Message_Asset_Intf>
    
}