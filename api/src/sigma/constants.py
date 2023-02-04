from enum import Enum


class SigmaRuleFieldSearch(Enum):
    Author = "author"
    Logsource = "logsource"
    Detection = "detection"
    Condition = "condition"
    Raw_Text = "raw_text"
    Title = "title"
    Description = "description"
    Date_Added = "date_added"
    Tactics = "tactics"
    Techniques = "techniques"
    Subtechniques = "subtechniques"
