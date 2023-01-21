class TechniqueLayerObject:
    """Object to be used by technique layer list to assist in generating mitre layers."""

    def __init__(self, rule_type: str, technique_id: str, count: int):
        self.rule_type = rule_type
        self.technique_id = technique_id
        self.count = count


class TechniqueLayerList:
    """Object to be used to hold technique layer objects to assist in generating mitre layers."""

    def __init__(self):

        self.yara_technique_list = []
        self.yara_layer_list = []

        self.snort_technique_list = []
        self.snort_layer_list = []

        self.final_list = []

    def add_technique_yara(self, technique_id: str) -> None:
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

    def add_technique_snort(self, technique_id: str) -> None:
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

    def __find_technique_layer(self, rule_type: str, technique_id: str) -> int:
        """Finds a specific technique layer in the technique layer list for a given rule type and returns the index of the that technique layer."""
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

    def __compile_techniques(self):
        """Build final lists to be used in generating a mitre layer."""
        for technique in self.yara_technique_list:
            if technique in self.snort_technique_list:

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

    def __generate_techniques(self) -> list:
        """Method to generate techniques description used for generating a mitre layer."""
        self.__compile_techniques()
        technique_list = []

        for layer in self.final_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}],
                }
            )

        for layer in self.yara_layer_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}],
                }
            )

        for layer in self.snort_layer_list:
            technique_list.append(
                {
                    "techniqueID": layer.technique_id,
                    "score": layer.count,
                    "metadata": [{"name": "Coverage", "value": f"{layer.rule_type}"}],
                }
            )

        return technique_list

    def generate_mitre_layer(self, layer_name: str, description: str) -> str:
        """Generate mitre layer that can be utilized to create an SVG or imported into navigator."""
        techniques = self.__generate_techniques()

        layer = {
            "name": f"{layer_name}",
            "versions": {"layer": "4.4", "navigator": "4.8.0"},
            "sorting": 3,  # descending order of score
            "description": f"{description}",
            "domain": "enterprise-attack",
            "techniques": techniques,
        }
        return layer
