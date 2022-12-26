from enum import Enum

class YaraRuleFieldSearch(Enum):
    Name = 'name'
    Meta = 'meta'
    Strings = 'strings'
    Conditions = 'conditions'
    Logic_Hash = 'logic hash'
    Author = 'author'
    Date_Added = 'Date Added'
    Compiles = 'compiles'
    Tactics = 'tactics'
    Techniques = 'techniques'
    Subtechniques = 'subtechniques'
