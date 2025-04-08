from dataclasses import dataclass, field
from typing import List

@dataclass
class SampleParams:
    max_tokens: int = None
    temperature: float = 0.5
    top_p: float = 1.0
    frequency_penalty: float = None
    presence_penalty: float = None