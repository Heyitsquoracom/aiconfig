# Function Calling with OpenAI

This example is taken from https://github.com/openai/openai-node/blob/v4/examples/function-call-stream.ts and modified to show the same functionality using AIConfig.

TThis notebook serves as a practical guide for leveraging AIConfig and function calling with OpenAI models. We start with a mock database of books and functions to list, search, and retrieve books. Function calling is enabled so the LLM can interpret a user's question, determine the appropriate function to call, and execute the function. Read more about [Function Calling with Open AI](https://openai.com/blog/function-calling-and-other-api-updates) and [AIConfig for prompt and model management](https://github.com/lastmile-ai/aiconfig).

[Google Colab notebook](https://colab.research.google.com/drive/1WCMVtdoLV2QUnTUZThAxKCpUAlt8VdOy#scrollTo=51w-3OZC_Z97)
