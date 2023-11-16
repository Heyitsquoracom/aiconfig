<div align="center"><picture>
  <img alt="aiconfig" src="aiconfig-docs/static/img/readme_logo.png">
</picture></div>
<br/>

![Python](https://github.com/lastmile-ai/aiconfig/actions/workflows/pr_python.yml/badge.svg)
![Node](https://github.com/lastmile-ai/aiconfig/actions/workflows/pr_typescript.yml/badge.svg)
![Docs](https://github.com/lastmile-ai/aiconfig/actions/workflows/test-deploy-docs.yml/badge.svg)

<!-- <div align="right"><a href="https://aiconfig.lastmileai.dev">Go to Docs</a></div> -->

## Overview

AIConfig is a source-control friendly way to manage prompts and model parameters for generative AI.

1. **Prompts as configs**: a [standardized JSON format](https://aiconfig.lastmileai.dev/docs/overview/ai-config-format) to store generative AI model settings, prompt inputs/outputs, and flexible metadata. This allows you to iterate on prompts and model parameters _separately from your application code_.
2. **Model-agnostic SDK**: Python & Node SDKs to use `aiconfig` in your application code. AIConfig is designed to be **model-agnostic** and **multi-modal**, so you can extend it to work with any generative AI model, including text, image and audio.
3. **AI Workbook editor**: A [notebook-like playground](https://lastmileai.dev/workbooks/clooqs3p200kkpe53u6n2rhr9) to edit `aiconfig` files visually, run prompts, tweak models and model settings, and chain things together.

> Full documentation: **[aiconfig.lastmileai.dev](https://aiconfig.lastmileai.dev/)**

## Features

- [x] **Source-control friendly** [`aiconfig` format](https://aiconfig.lastmileai.dev/docs/overview/ai-config-format) to save prompts and model settings, which you can use for evaluation, reproducibility and simplifying your application code.
- [x] **Multi-modal and model agnostic**. Use with any model, and serialize/deserialize data with the same `aiconfig` format.
- [x] **Prompt chaining and parameterization** with [{{handlebars}}](https://handlebarsjs.com/) templating syntax, allowing you to pass dynamic data into prompts (as well as between prompts).
- [x] **Streaming** supported out of the box, allowing you to get playground-like streaming wherever you use `aiconfig`.
- [x] **Notebook editor**. [AI Workbooks editor](https://lastmileai.dev/workbooks/clooqs3p200kkpe53u6n2rhr9) to visually create your `aiconfig`, and use the SDK to connect it to your application code.

## Install

Install with your favorite package manager for Node or Python.

### Node.js

#### `npm` or `yarn`

```bash
npm install aiconfig
```

```bash
yarn add aiconfig
```

### Python

#### `pip` or `poetry`

```bash
pip install python-aiconfig
```

```bash
poetry add python-aiconfig
```

[Detailed installation instructions](https://aiconfig.lastmileai.dev/docs/introduction/getting-started/#installation).

## Getting Started - your first AIConfig

> **We cover Python instructions here, for Node.js please see the [detailed Getting Started guide](https://aiconfig.lastmileai.dev/docs/introduction/getting-started)**

In this quickstart, you will create a customizable NYC travel itinerary using `aiconfig`.

This AIConfig contains a prompt chain to get a list of travel activities from an LLM and then customize the activities based on user preferences.

### Download `travel.aiconfig.json`

```json
{
  "name": "NYC Trip Planner",
  "description": "Intrepid explorer with ChatGPT and AIConfig",
  "schema_version": "latest",
  "metadata": {
    "models": {
      "gpt-3.5-turbo": {
        "model": "gpt-3.5-turbo",
        "top_p": 1,
        "temperature": 1
      },
      "gpt-4": {
        "model": "gpt-4",
        "max_tokens": 3000,
        "system_prompt": "You are an expert travel coordinator with exquisite taste."
      }
    },
    "default_model": "gpt-3.5-turbo"
  },
  "prompts": [
    {
      "name": "get_activities",
      "input": "Tell me 10 fun attractions to do in NYC."
    },
    {
      "name": "gen_itinerary",
      "input": "Generate an itinerary ordered by {{order_by}} for these activities: {{get_activities.output}}.",
      "metadata": {
        "model": "gpt-4",
        "parameters": {
          "order_by": "geographic location"
        }
      }
    }
  ]
}
```

### Run the `get_activities` prompt.

> **Note**: Make sure to specify the API keys (such as `OPENAI_API_KEY`) in your environment before proceeding.

You don't need to worry about how to run inference for the model; it's all handled by AIConfig. The prompt runs with gpt-3.5-turbo since that is the `default_model` for this AIConfig.

#### Python

```python
from aiconfig import AIConfigRuntime, InferenceOptions

# Load the aiconfig. You can also use AIConfigRuntime.loadJSON({})
config = AIConfigRuntime.load('travel.aiconfig.json')

# Run a single prompt (with streaming)
inference_options = InferenceOptions(stream=True)
await config.run("get_activities", params=None, inference_options)
```

### Run the `gen_itinerary` prompt.

This prompt depends on the output of `get_activities`. It also takes in parameters (user input) to determine the customized itinerary.

Let's take a closer look:

**`gen_itinerary` prompt:**

```
"Generate an itinerary ordered by {{order_by}} for these activities: {{get_activities.output}}."
```

**prompt metadata:**

```json
{
  "metadata": {
    "model": "gpt-4",
    "parameters": {
      "order_by": "geographic location"
    }
  }
}
```

Observe the following:

1. The prompt depends on the output of the `get_activities` prompt.
2. It also depends on an `order_by` parameter (using {{handlebars}} syntax)
3. It uses **gpt-4**, whereas the `get_activities` prompt it depends on uses **gpt-3.5-turbo**.

> Effectively, this is a prompt chain between `gen_itinerary` and `get_activities` prompts, _as well as_ as a model chain between **gpt-3.5-turbo** and **gpt-4**.

Let's run this with AIConfig:

#### Python

Replace `config.run` above with this:

```python
inference_options = InferenceOptions(stream=True)
await config.run_with_dependencies(
    "gen_itinerary",
    params={"order_by": "duration"},
    inference_options)
```

Notice how simple the syntax is to perform a fairly complex task - running 2 different prompts across 2 different models and chaining one's output as part of the input of another.

### Save the AIConfig

Let's save the AIConfig back to disk, and serialize the outputs from the latest inference run as well:

```python
# Save the aiconfig to disk. and serialize outputs from the model run
config.save('updated.aiconfig.json', include_output=True)
```

## Edit `aiconfig` in a notebook editor

We can iterate on an `aiconfig` using a notebook-like editor called an **AI Workbook**. Now that we have an `aiconfig` file artifact that encapsulates the generative AI part of our application, we can iterate on it separately from the application code that uses it.

1. Go to https://lastmileai.dev.
2. Go to Workbooks page: https://lastmileai.dev/workbooks
3. Click dropdown from '+ New Workbook' and select 'Create from AIConfig'
4. Upload `travel.aiconfig.json`

<p align="center">
<video controls height="480" width="800">
    <source src="https://github.com/lastmile-ai/aiconfig/assets/81494782/5d901493-bbda-4f8e-93c7-dd9a91bf242e"/>
  </video>
</p>

Try out the workbook playground here: **[NYC Travel Workbook](https://lastmileai.dev/workbooks/clooqs3p200kkpe53u6n2rhr9)**

> **We are working on a local editor that you can run yourself. For now, please use the hosted version on https://lastmileai.dev.**

<!-- <video controls><source src="https://s3.amazonaws.com/publicdata.lastmileai.com/workbook_editor_480.mov"/></video> -->

## OpenAI Introspection API

If you are already using OpenAI completion API's in your application, you can get started very quickly to start saving the messages in an `aiconfig`.

Simply add the following lines to your `import`:

```python
import openai
from aiconfig.ChatCompletion import create_and_save_to_config
 openai.ChatCompletion.create = create_and_save_to_config
```

Now you can continue using `openai` completion API as normal. By default, the data will get serialized to an `aiconfig.json`.

## Supported Models

AIConfig supports the following model models out of the box:

- OpenAI chat models (GPT-3, GPT-3.5, GPT-4)
- Google PaLM models (PaLM chat)
- Hugging Face text generation models (e.g. Mistral-7B)

The `aiconfig` data model is model-agnostic and multi-modal. If you need to use a model that isn't provided out of the box, you can implement a `ModelParser` for it (see [Extending AIConfig](#extending-aiconfig)).

## AIConfig SDK

The AIConfig SDK supports CRUD operations for prompts, models, parameters and metadata. Here are some common examples.

The root interface is the `AIConfigRuntime` object. That is the entrypoint for interacting with an AIConfig programmatically.

Let's go over a few key CRUD operations to give a glimpse

### AIConfig `create`

```python
config = AIConfigRuntime.create("aiconfig name", "description")
```

### Prompt `resolve`

`resolve` deserializes an existing `Prompt` into the data object that its model expects.

```python
config.resolve("prompt_name", params)
```

`params` are overrides you can specify to resolve any `{{handlebars}}` templates in the prompt. See the `gen_itinerary` prompt in the Getting Started example.

### Prompt `serialize`

`serialize` is the inverse of `resolve` -- it serializes the data object that a model understands into a `Prompt` object that can be serialized into the `aiconfig` format.

```python
config.serialize("model_name", data, "prompt_name")
```

### Prompt `run`

`run` is used to run inference for the specified `Prompt`.

```python
config.run("prompt_name", params)
```

### `run_with_dependencies`

There's a variant of `run` called `run_with_dependencies` -- this re-runs all prompt dependencies.
For example, in [`travel.aiconfig.json`](#download-travelaiconfigjson), the `gen_itinerary` prompt references the output of the `get_activities` prompt using `{{get_activities.output}}`.

Running this function will first execute `get_activities`, and use its output to resolve the `gen_itinerary` prompt before executing it.
This is transitive, so it computes the Directed Acyclic Graph of dependencies to execute. Complex relationships can be modeled this way.

```python
config.run_with_dependencies("gen_itinerary")
```

### Updating metadata and parameters

Use the `get/setMetadata` and `get/setParameter` methods to interact with metadata and parameters (`setParameter` is just syntactic sugar to update `"metadata.parameters"`)

```python
config.setMetadata("key", data, "prompt_name")
```

Note: if `"prompt_name"` is specified, the metadata is updated specifically for that prompt. Otherwise, the global metadata is updated.

### `AIConfigRuntime.registerModelParser`

Use the `AIConfigRuntime.registerModelParser` if you want to use a different `ModelParser`, or configure AIConfig to work with an additional model.

AIConfig uses the model name string to retrieve the right `ModelParser` for a given Prompt (see `AIConfigRuntime.getModelParser`), so you can register a different ModelParser for the same ID to override which `ModelParser` handles a Prompt.

For example, suppose I want to use `MyOpenAIModelParser` to handle `gpt-4` prompts. I can do the following at the start of my application:

```python
AIConfigRuntime.registerModelParser(myModelParserInstance, ["gpt-4"])
```

## Extending AIConfig

AIConfig is designed to be customized and extended for your use-case. There are some key extension points for AIConfig:

### Bring your own Model

You can use any generative AI model with the `aiconfig` format. All you need to do is define a `ModelParser` class. This class is responsible for 3 key operations:

- **serialize** prompts, model parameters and inference outputs into an `aiconfig`.
- **deserialize** existing `aiconfig` `Prompts` for that model into the data that the model accepts (e.g. OpenAI chat completion params).
- **run** inference using a model (e.g. calling the OpenAI API or a model running locally).

# Defining Your Own Model Parser

In this guide, you will learn the basics of defining your own custom Model Parser for use in the AIConfig library. Model Parsers play a crucial role in managing and interacting with AI models within the AIConfig SDK. You can create custom Model Parsers to suit your specific needs and integrate them seamlessly into AIConfig.

## ModelParser Class

The `ModelParser` is an abstract base class that serves as the foundation for all Model Parsers. It defines a set of methods and behaviors that any Model Parser implementation must adhere to. Below are the key methods defined in the `ModelParser` class:

- `id()`
  Returns an identifier for the model parser (e.g., "OpenAIModelParser, HuggingFaceTextGeneration", etc.).
- `serialize()`
  Serialize a prompt and additional metadata/model settings into a `Prompt` object that can be saved in the AIConfig.
- `deserialize()`
  Deserialize a `Prompt` object loaded from an AIConfig into a structure that can be used for model inference.
- `run()`
  Execute model inference based on completion data constructed in the `deserialize()` method. It saves the response or output in `prompt.outputs`.
- `get_output_text()`: Get the output text from the output object containing model inference response.
- `get_model_settings()`: Extract the AI model's settings from the AIConfig

## Model Parser Extensibility

When defining your custom Model Parser, you can inherit from the `ModelParser` class and override its methods as needed to customize the behavior for your specific AI models. This extensibility allows you to seamlessly integrate your Model Parser into the AIConfig framework and manage AI models with ease.

Here are some helpful resources to get started:

1. `ModelParser` class ([Python](https://github.com/lastmile-ai/aiconfig/blob/main/python/src/aiconfig/model_parser.py), [TypeScript](https://github.com/lastmile-ai/aiconfig/blob/main/typescript/lib/modelParser.ts)).
2. OpenAI Chat `ModelParser` ([Python](https://github.com/lastmile-ai/aiconfig/blob/main/python/src/aiconfig/default_parsers/openai.py#L25), [TypeScript](https://github.com/lastmile-ai/aiconfig/blob/main/typescript/lib/parsers/openai.ts#L261))

### Parameterized Model Parser

In some cases, you may want to create a specialized Model Parser that handles parameterization of prompts. The `ParameterizedModelParser` is an abstract subclass of `ModelParser` that provides additional methods and utilities for parameterization.

#### Quick Note On Parameterization:

In AIConfig, parameters refer to the handlebar syntax used by prompt inputs to denote a placeholder for another value. See # Parameters and Chaining Prompts section

### Model Parser Extensibility with Parameterization

When defining your own custom Model Parser, you can choose to inherit from the `ParameterizedModelParser` class to take advantage of the parameterization features provided by AIConfig. This allows you to create model parsers that can handle prompts with placeholders and dynamically replace them with actual values during serialization and deserialization.

By incorporating parameterization into your model parser, you can create AIConfigs that are more flexible and adaptable to different use cases, as well as facilitate the customization of prompt templates to meet specific requirements.

Another notable benefit of using parameterization is the ability to leverage the `run_with_dependencies` feature. The `run_with_dependencies` API method allows you to execute prompts with resolved dependencies and prompt references, providing more advanced control over the model's behavior.

The `ParameterizedModelParser` class and associated helper utilities empower you to harness the power of parameterization in your AI configuration management, offering greater flexibility and control over how prompts are processed and used in model inference.

### Helper Utils provided with the Parameterized Model Parser Class

The `ParameterizedModelParser` class extends the capabilities of the base `ModelParser` and includes the following methods:

- Python `resolve_prompt_template()` TypeScript: `resolve_prompt_template()`
  Resolves a templated string with provided parameters, allowing for dynamic prompt generation.
- Python `get_prompt_template()` TypeScript: `get_prompt_template()`
  An overrideable method that returns a template for a prompt. Customize this method to specify how prompt templates are extracted from prompts.

### General Helper Utilities for Parameterization

To facilitate parameterization, AIConfig provides a set of helper utilities:

- Python: `resolve_parameters()` TypeScript: `resolveParameters()`
  Resolves parameters within a given string by substituting placeholders with actual values.
- Python: `resolve_prompt_string()` TypeScript: `resolve_prompt_string()`
  Resolves a templated string with parameters, similar to the `resolve_prompt_template()` method of the `ParameterizedModelParser` class.
- Python: `resolve_parametrized_prompt()` TypeScript: `resolve_parametrized_prompt() `
  Resolves a parametrized prompt by substituting parameter placeholders with their corresponding values.
- Python: `resolve_system_prompt()` TypeScript: `resolve_system_prompt() `
  Resolves system prompts, often used in multi-turn conversations, by applying parameterization to system prompt templates.

These utilities enable dynamic parameterization of prompts and customization of prompt templates to meet specific requirements.

## Callback handlers

The AIConfig SDK has a `CallbackManager` class which can be used to register callbacks that trace prompt resolution, serialization, deserialization, and inference. This lets you get a stack trace of what's going on under the covers, which is especially useful for complex control flow operations.

Anyone can register a callback, and filter for the events they care about. You can subsequently use these callbacks to integrate with your own monitoring and observability systems.

Video: https://github.com/lastmile-ai/aiconfig/assets/141073967/ce909fc4-881f-40d9-9c67-78a6682b3063

#### Structure of a Callback Event

Each callback event is an object of the CallbackEvent type, containing:

name: The name of the event (e.g., "on_resolve_start").
file: The source file where the event is triggered
data: An object containing relevant data for the event, such as parameters or results.
ts_ns: An optional timestamp in nanoseconds.

#### Writing Custom Callbacks

Custom callbacks are functions that conform to the Callback type. They receive a CallbackEvent object containing event details, and return a Promise. Here's an example of a simple logging callback:

```typescript
const myLoggingCallback: Callback = async (event: CallbackEvent) => {
  console.log(`Event triggered: ${event.name}`, event);
};
```

```python
async def my_logging_callback(event: CallbackEvent) -> None:
  print(f"Event triggered: {event.name}", event)
```

Sample output:

```
Event triggered: on_resolve_start
CallbackEventModel(name='on_resolve_start', file='/Users/John/Projects/aiconfig/python/src/aiconfig/Config.py', data={'prompt_name': 'get_activities', 'params': None}, ts_ns=1700094936363867000)
Event triggered: on_deserialize_start
```

#### Setting up a CallbackManager and Registering Callbacks

To register this callback with the AIConfigRuntime, include it in the array of callbacks when creating a CallbackManager:

```typescript
const myCustomCallback: Callback = async (event: CallbackEvent) => {
  console.log(`Event triggered: ${event.name}`, event);
};

const callbackManager = new CallbackManager([myCustomCallback]);
aiConfigRuntimeInstance.setCallbackManager(callbackManager);
```

```python
async def my_custom_callback(event: CallbackEvent) -> None:
  print(f"Event triggered: {event.name}", event)

callback_manager = CallbackManager([my_custom_callback])
aiconfigRuntimeInstance.set_callback_manager(callback_manager)
```

#### Triggering Callbacks

Callbacks are automatically triggered at specific points in the AIConfigRuntime flow. For example, when the resolve method is called on an AIConfigRuntime instance, it triggers on_resolve_start and on_resolve_end events, which are then passed to the CallbackManager to execute any associated callbacks.

Sample implementation inside source code:

```typescript
  public async resolve(promptName: string, params: JSONObject = {}) {
    const startEvent = {
      name: "on_resolve_start",
      file: __filename,
      data: { promptName, params },
    } as CallbackEvent;
    await this.callbackManager.runCallbacks(startEvent);

    /** Method Implementation*/

    const endEvent = {
      name: "on_resolve_end",
      file: __filename,
      data: { result: resolvedPrompt },
    };
    await this.callbackManager.runCallbacks(endEvent);
    return resolvedPrompt;
  }
```

```python
async def resolve(
    self,
    prompt_name: str,
    params: Optional[dict] = None,
    **kwargs,
):
    event = CallbackEvent("on_resolve_start", __file__, {"prompt_name": prompt_name, "params": params})
    await self.callback_manager.run_callbacks(event)

    """Method Implementation"""

    event = CallbackEvent("on_resolve_complete", __name__, {"result": response})
    await self.callback_manager.run_callbacks(event)
    return response

```

Similarly, ModelParsers should trigger their own events when serializing, deserializing, and running inference. These events are also passed to the CallbackManager to execute any associated callbacks.

#### Handling Callbacks with Timers

The CallbackManager uses a timeout mechanism to ensure callbacks do not hang indefinitely. If a callback does not complete within the specified timeout, it is aborted, and an error is logged. This timeout can be adjusted in the CallbackManager constructor and defaults to 5 if not specified.

```typescript
const customTimeout = 10; // 10 seconds
const callbackManager = new CallbackManager(callbacks, customTimeout);
```

```python
custom_timeout = 10; # 10 seconds
callback_manager = CallbackManager([my_logging_callback], custom_timeout)
```

#### Error Handling

Custom callbacks should include error handling to manage exceptions. Errors thrown within callbacks are caught by the CallbackManager and can be logged or handled as needed.

## Custom metadata

You can store any kind of JSON-serializable metadata in an `aiconfig`. See the [metadata schema details](https://aiconfig.lastmileai.dev/docs/overview/ai-config-format#metadata) to learn more.

To add metadata, use the `config.setMetadata` API (available in both Python and TypeScript).

## Cookbooks

We provide several guides to demonstrate the power of `aiconfig`.

> **See the [`cookbooks`](https://github.com/lastmile-ai/aiconfig/tree/main/cookbooks) folder for examples to clone.**

## Roadmap

aiconfig -- for prompt, model and parameter management

- Motivation
- Why use aiconfig
- Getting Started
- Core Components
- Capabilities
  - Version Control
  - Model parser
  - Routing
  - Evaluation
- Debugging
- Roadmap
  - Multi-modal model support (use with image, audio generation models as well as multi-modal models like GPT-V)
  - Routing
  - Evaluation
