import openai
import backoff
import copy
import base64

from abc import ABC, abstractmethod
from dataclasses import asdict
from io import BytesIO
from logging import getLogger
from typing import Dict, Any, List

from llms.config_store import model_configs, cs
from llms.registry import Registry
from llms.params import SampleParams

logger = getLogger(__name__)


def parse_api_output(response: openai.types.Completion):
    return [choice for choice in response.choices]


class LanguageModel(ABC):
    API_URL = None
    api_key = None
    model = None
    sample_params = None

    @abstractmethod
    def generate(self):
        pass


class APILanguageModel(LanguageModel):
    API_URL = "https://api.openai.com/v1/"

    def __init__(
        self,
        API_URL,
        api_key,
        model,
        sample_params,
        user_stop_token=None,
    ):
        self.API_URL = API_URL
        self.api_key = api_key
        self.model_name = model
        if sample_params is not None:
            self.sample_params = asdict(sample_params)
        self.user_stop_token = user_stop_token

        self.client: openai.Client = openai.Client(
            api_key=self.api_key,
            base_url=self.API_URL,
        )

    @backoff.on_exception(backoff.expo, openai.OpenAIError, max_time=10, max_tries=3)
    def generate(
        self,
        prompt: List[dict],
    ):
        # This function calls the API for one input prompt
        final_sample_params = copy.deepcopy(self.sample_params)
        final_sample_params.update(
            {
                k: v
                for k, v in locals().items()
                if v is not None and k in self.sample_params
            }
        )
        
        try:
            response = self.client.completions.create(
                model=self.model_name,
                prompt=prompt,
                **final_sample_params,
            )
            
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise

        return parse_api_output(response)


class GPTLanguageModel(APILanguageModel):
    @backoff.on_exception(backoff.expo, openai.OpenAIError, max_time=10, max_tries=3)
    def generate(
        self,
        prompt: List[dict],
    ):
        # This function calls the API for one input prompt
        final_sample_params = copy.deepcopy(self.sample_params)
        final_sample_params.update(
            {
                k: v
                for k, v in locals().items()
                if v is not None and k in self.sample_params
            }
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=prompt,
                **final_sample_params
            )
            
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise

        return response.choices[0].message.content
    
    def stream_generate(
        self,
        prompt: List[dict]
    ):
        final_sample_params = copy.deepcopy(self.sample_params)
        final_sample_params.update(
            {
                k: v
                for k, v in locals().items()
                if v is not None and k in self.sample_params
            }
        )
        
        try:
            stream = self.client.chat.completions.create(
                model=self.model_name,
                messages=prompt,
                stream=True,
                **final_sample_params
            )

            for chunk in stream:
                content = chunk.choices[0].delta.content

                if content:
                    yield chunk.choices[0].delta.content.encode("utf-8")
                        
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise
        
        
class GPTSpeechToSpeechModel(APILanguageModel):
    @backoff.on_exception(backoff.expo, openai.OpenAIError, max_time=10, max_tries=3)
    def generate(
        self,
        prompt: List[dict],
        voice: str = "nova",
    ):
        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                modalities=["text", "audio"],
                audio={"voice": voice, "format": "wav"},
                messages=prompt,
            )
            
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise

        return response.choices[0].message.audio.data
    
    def stream_generate(
        self,
        prompt: List[dict],
    ):
        try:
            stream = self.client.chat.completions.create(
                model=self.model_name,
                modalities=["text"],
                messages=prompt,
                stream=True,
            )
            
            for chunk in stream:
                delta = chunk.choices[0].delta

                if delta.content:
                    yield delta.content

            
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise
        
        
class GPTSpeechToTextModel(APILanguageModel):
    @backoff.on_exception(backoff.expo, openai.OpenAIError, max_time=10, max_tries=3)
    def transcribe(
        self,
        audio: str,
    ):
        try:
            response = self.client.audio.transcriptions.create(
                model=self.model_name,
                file=audio,
                response_format="text",
            )
            
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise

        return response
    
    
class GPTTextToSpeechModel(APILanguageModel):
    @backoff.on_exception(backoff.expo, openai.OpenAIError, max_time=10, max_tries=3)
    def generate(
        self,
        text: str,
        instructions: str = None,
        voice: str = None,
        file_path: str = None,
    ):
        try:
            if file_path:
                with self.client.audio.speech.with_streaming_response.create(
                    model=self.model_name,
                    voice=voice,
                    input=text,
                    instructions=instructions
                ) as response:
                    response.stream_to_file(file_path)
                    
                return True
                
            else:
                buffer = BytesIO()

                with self.client.audio.speech.with_streaming_response.create(
                    model=self.model_name,
                    voice=voice,
                    input=text,
                    instructions=instructions
                ) as response:
                    for chunk in response.iter_bytes():
                        buffer.write(chunk)

                buffer.seek(0)
                return buffer.read()
            
        except openai.OpenAIError as e:
            logger.error(f"OpenAIError: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            raise
        

def convert_param2hf(openai_param: Dict[str, Any]) -> Dict[str, Any]:
    mapping = {
        "max_tokens": "max_new_tokens",
        "top_p": "top_p",
        "stop": "stop_string",
        "n": "num_return_sequences",
    }
    
    return {mapping[k]: openai_param.get(k, None) for k in mapping.keys()}


def build_language_model(
    # configs: RunConfig,
    model_name: str,
    raw_model_name: str = None,
    PORT: int = None,
    API_KEY: str = None,
    temperature = 1.0
) -> LanguageModel:
    # This function creates a language model object based on the model name
    # xxx-vllm: the model is initialied as an APILanguageModel, but the API_URL is set to the local server
    # gpt-models: the model is initialized as an APIlanguageModel, but the API_URL is set to the OpenAI API
    # xxx-hf: the model is initailized as an HFLanguageModel
    if "@vllm" in model_name:
        return APILanguageModel(
            API_URL=f"http://localhost:{PORT}/v1/",
            api_key="empty",
            model=raw_model_name,
            sample_params=SampleParams(
                max_tokens=100,
                temperature=temperature,
                top_p=1.0,
            ),
        )
        
    elif "gpt" in model_name:
        if "transcribe" in model_name:
            return GPTSpeechToTextModel(
                API_URL="https://api.openai.com/v1/",
                api_key=API_KEY,
                model=raw_model_name,
                sample_params=None
            )
            
        elif "tts" in model_name:
            return GPTTextToSpeechModel(
                API_URL="https://api.openai.com/v1/",
                api_key=API_KEY,
                model=raw_model_name,
                sample_params=None
            )
        
        elif "audio" in model_name:
            return GPTSpeechToSpeechModel(
                API_URL="https://api.openai.com/v1/",
                api_key=API_KEY,
                model=raw_model_name,
                sample_params=None
            )
            
        else:
            return GPTLanguageModel(
                API_URL="https://api.openai.com/v1/",
                api_key=API_KEY,
                model=raw_model_name,
                sample_params=SampleParams(
                    max_tokens=100,
                    temperature=temperature,
                    top_p=1.0,
                ),
            )
        
        
ModelRegistry = Registry()
for model_name in model_configs:
    model_config = cs.repo[model_name + ".yaml"].node
    model = build_language_model(**model_config)
    ModelRegistry.register(model_name, model)