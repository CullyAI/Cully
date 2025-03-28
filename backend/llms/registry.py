# registry.py
# This file implements a register class that stores some global objects, which is used by other py files.
from typing import Dict, Any


class Registry:
    _registry: Dict[str, Any]

    def __init__(self):
        self._registry = {}

    def register(self, name, obj):
        if name in self._registry:
            raise KeyError(f"An object with name '{name}' is already registered.")
        self._registry[name] = obj
        print(f"Registered '{name}'.")

    def get(self, name):
        try1 = self._registry.get(name)
        if try1 is None:
            name = name + "_registry"
            try2 = self._registry.get(name)
            return try2
        else:
            return try1

    def list_registered(self):
        return list(self._registry.keys())

    def __repr__(self):
        list_names = ", ".join(self.list_registered())
        return f"Registered objects: ({list_names})"
    
    ModelRegistry = Registry()
    for model_name in model_configs:
        model_config = cs.repo[model_name + ".yaml"].node
        model = build_language_model(**model_config)
        ModelRegistry.register(model_name, model)