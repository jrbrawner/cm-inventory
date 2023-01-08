from enum import Enum

class SnortRuleFieldSearch(Enum):
    Action = "action"
    Protocol = "protocol"
    Src_IP = "src_ip"
    Src_Port = "src_port"
    Direction = "direction"
    Dst_IP = "dst_ip"
    Dst_Port = "dst_port"
    Date_Added = "date_added"
    Body_Options = "body_options"
    ID = "id"
