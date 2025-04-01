import os

from dataclasses import dataclass, field
from hydra.core.config_store import ConfigStore
from typing import List, Dict, Optional
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
cs = ConfigStore.instance()

@dataclass
class ModelRegistryParams:
    model_name: str
    raw_model_name: str
    PORT: int = None
    API_KEY: Optional[str] = field(default=None)


# List to keep track of all config objects
model_configs = []


# Function to register a model config and add it to the list
def register_model_registry(
    name: str, model_name: str, raw_model_name: str, port: int, API_KEY: str = None
):
    config = ModelRegistryParams(
        model_name=model_name, raw_model_name=raw_model_name, PORT=port, API_KEY=API_KEY
    )
    cs.store(name=name, node=config)
    model_configs.append(name)


# Register all model configurations

''' 

Here is an example of a vllm register in case that becomes useful in the future

register_model_registry(
    name="llama_registry",
    model_name="Llama-3.2-3B-Instruct@vllm",
    raw_model_name="meta-llama/Llama-3.2-3B-Instruct",
    port=10000,
)

'''

register_model_registry(
    name="gpt4omini_registry",
    model_name="gpt-4o-mini",
    raw_model_name="gpt-4o-mini",
    port=-1,
    API_KEY=API_KEY
)

register_model_registry(
    name="gpt4o_registry",
    model_name="gpt-4o",
    raw_model_name="gpt-4o",
    port=-1,
    API_KEY=API_KEY
)