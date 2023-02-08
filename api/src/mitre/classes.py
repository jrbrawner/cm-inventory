from src.yara.models import YaraRule
from src.snort.models import SnortRule
from src.sigma.models import SigmaRule

class TechniqueLayerObject:
    """Object to be used by layer generator class to assist in generating mitre layers."""

    def __init__(self, rule_type: str, technique_id: str, count: int):
        self.rule_type = rule_type
        self.technique_id = technique_id
        self.count = count

    def __repr__(self) -> str:
        return f"TechniqueLayerObject: rule_type: {self.rule_type}, technique_id: {self.technique_id}, count: {self.count}."
    
    def get_count(self) -> int:
        return self.count


class LayerGenerator:
    """Class that can take rule objects and be used to generate mitre layers."""

    def __init__(self):

        self.yara_technique_list = []
        self.yara_layer_list = []

        self.snort_technique_list = []
        self.snort_layer_list = []

        self.sigma_technique_list = []
        self.sigma_layer_list = []

        
        self.final_list = []

    def __add_technique_yara(self, technique_id: str) -> None:
        """Method to add yara rules that will be used in generating a mitre layer."""
        if technique_id not in self.yara_technique_list:
            technique_layer = TechniqueLayerObject("Yara", technique_id, 1)
            self.yara_layer_list.append(technique_layer)
            self.yara_technique_list.append(technique_id)
        else:
            for technique_layer in self.yara_layer_list:
                if technique_layer.technique_id is technique_id:
                    technique_layer.count += 1
                    break

    def __add_technique_snort(self, technique_id: str) -> None:
        """Method to add snort rules that will be used in generating a mitre layer."""
        if technique_id not in self.snort_technique_list:
            technique_layer = TechniqueLayerObject("Snort", technique_id, 1)
            self.snort_layer_list.append(technique_layer)
            self.snort_technique_list.append(technique_id)
        else:
            for technique_layer in self.snort_layer_list:
                if technique_layer.technique_id is technique_id:
                    technique_layer.count += 1
                    break

    def __add_technique_sigma(self, technique_id: str) -> None:
        """Method to add sigma rules that will be used in generating a mitre layer."""
        if technique_id not in self.sigma_technique_list:
            technique_layer = TechniqueLayerObject("Sigma", technique_id, 1)
            self.sigma_layer_list.append(technique_layer)
            self.sigma_technique_list.append(technique_id)
        else:
            for technique_layer in self.sigma_layer_list:
                if technique_layer.technique_id is technique_id:
                    technique_layer.count += 1
                    break

    def __find_technique_layer(self, rule_type: str, technique_id: str) -> int:
        """Finds a specific technique layer in the technique layer list for a given rule type and returns the index of that technique layer."""
        index = 0
        if rule_type == "Yara":
            for technique_layer in self.yara_layer_list:
                if technique_layer.technique_id is technique_id:
                    return index
                index += 1
        if rule_type == "Snort":
            for technique_layer in self.snort_layer_list:
                if technique_layer.technique_id is technique_id:
                    return index
                index += 1
        if rule_type == "Sigma":
            for technique_layer in self.sigma_layer_list:
                if technique_layer.technique_id is technique_id:
                    return index
                index += 1

    def __compile_techniques(self):
        """Build final lists to be used in generating a mitre layer."""

        for technique in self.yara_technique_list:
            if technique in self.snort_technique_list and technique in self.sigma_technique_list:

                technique_layer_index = self.__find_technique_layer("Yara", technique)
                technique_layer = self.yara_layer_list[technique_layer_index]
                count = technique_layer.count
                self.yara_layer_list.remove(technique_layer)

                technique_layer_index = self.__find_technique_layer("Snort", technique)
                technique_layer = self.snort_layer_list[technique_layer_index]
                count += technique_layer.count
                self.snort_layer_list.remove(technique_layer)

                technique_layer_index = self.__find_technique_layer("Sigma", technique)
                technique_layer = self.sigma_layer_list[technique_layer_index]
                count += technique_layer.count
                self.sigma_layer_list.remove(technique_layer)

                technique_layer = TechniqueLayerObject("Yara, Snort, Sigma", technique, count)
                self.final_list.append(technique_layer)

            elif technique in self.snort_technique_list and technique not in self.sigma_technique_list:

                technique_layer_index = self.__find_technique_layer("Yara", technique)
                technique_layer = self.yara_layer_list[technique_layer_index]
                count = technique_layer.count
                self.yara_layer_list.remove(technique_layer)

                technique_layer_index = self.__find_technique_layer("Snort", technique)
                technique_layer = self.snort_layer_list[technique_layer_index]
                count += technique_layer.count
                self.snort_layer_list.remove(technique_layer)

                technique_layer = TechniqueLayerObject("Yara, Snort", technique, count)
                self.final_list.append(technique_layer)

            elif technique in self.sigma_technique_list and technique not in self.snort_technique_list:

                technique_layer_index = self.__find_technique_layer("Yara", technique)
                technique_layer = self.yara_layer_list[technique_layer_index]
                count = technique_layer.count
                self.yara_layer_list.remove(technique_layer)

                technique_layer_index = self.__find_technique_layer("Sigma", technique)
                technique_layer = self.sigma_layer_list[technique_layer_index]
                count += technique_layer.count
                self.sigma_layer_list.remove(technique_layer)

                technique_layer = TechniqueLayerObject("Yara, Sigma", technique, count)
                self.final_list.append(technique_layer)
    
        for technique in self.snort_technique_list:
            if technique in self.sigma_technique_list and technique not in self.yara_technique_list:

                technique_layer_index = self.__find_technique_layer("Snort", technique)
                technique_layer = self.snort_layer_list[technique_layer_index]
                count = technique_layer.count
                self.snort_layer_list.remove(technique_layer)

                technique_layer_index = self.__find_technique_layer("Sigma", technique)
                technique_layer = self.sigma_layer_list[technique_layer_index]
                count += technique_layer.count
                self.sigma_layer_list.remove(technique_layer)

                technique_layer = TechniqueLayerObject("Snort, Sigma", technique, count)
                self.final_list.append(technique_layer)
            elif technique not in self.sigma_technique_list and technique not in self.yara_technique_list:

                technique_layer_index = self.__find_technique_layer("Snort", technique)
                technique_layer = self.snort_layer_list[technique_layer_index]
                count = technique_layer.count
                self.snort_layer_list.remove(technique_layer)

                technique_layer = TechniqueLayerObject("Snort", technique, count)
                self.final_list.append(technique_layer)

        for technique in self.sigma_technique_list:
            if technique not in self.snort_technique_list and technique not in self.yara_technique_list:
                technique_layer_index = self.__find_technique_layer("Sigma", technique)
                technique_layer = self.sigma_layer_list[technique_layer_index]
                count = technique_layer.count
                self.sigma_layer_list.remove(technique_layer)

                technique_layer = TechniqueLayerObject("Sigma", technique, count)
                self.final_list.append(technique_layer)

    def __generate_techniques(self) -> list[str]:
        """Method to generate techniques description used for generating a mitre layer."""
        self.__compile_techniques()
        technique_list = []

        for layer in self.final_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}]
                }
            )

        for layer in self.yara_layer_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}]
                }
            )

        for layer in self.snort_layer_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}]
                }
            )
        
        for layer in self.sigma_layer_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}]
                }
            )

        return technique_list

    def generate_mitre_layer(self, layer_name: str, description: str, yara_rules: list[YaraRule],
                             snort_rules: list[SnortRule], sigma_rules: list[SigmaRule]) -> str:
        """Generate mitre layer that can be utilized to create an SVG or imported into navigator."""
        if yara_rules is not None:
            for rule in yara_rules:
                for technique in rule.techniques:
                    self.__add_technique_yara(technique.id)
                for subtechnique in rule.subtechniques:
                    self.__add_technique_yara(subtechnique.id)
        if snort_rules is not None:
            for rule in snort_rules:
                for technique in rule.techniques:
                    self.__add_technique_snort(technique.id)
                for subtechnique in rule.subtechniques:
                    self.__add_technique_snort(subtechnique.id)
        if sigma_rules is not None:
            for rule in sigma_rules:
                for technique in rule.techniques:
                    self.__add_technique_sigma(technique.id)
                for subtechnique in rule.subtechniques:
                    self.__add_technique_sigma(subtechnique.id)
        
        #breaking here
        techniques = self.__generate_techniques()
        
        layer = {
            "name": f"{layer_name}",
            "versions": {"layer": "4.3", "navigator": "4.6.5"},
            "sorting": 3,  # descending order of score
            "description": f"{description}",
            "domain": "enterprise-attack",
            "techniques": techniques,
        }
        return layer
