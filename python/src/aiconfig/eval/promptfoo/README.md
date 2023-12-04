# Promptfoo integration

Use case: I'm a SWE who wants to run my AIConfig against a set of test cases specified in a config file. Each test case has the input and a success condition of my choosing.

## Philosophy / design

Prompfoo has a pretty nice interface (both input and outputs) for addressing the use case. Tests are specified in a yaml file and the test suite can be run with a simple command. The same config file makes it easy to connect your test suite to an AI config with a small amount of code.

## How-to guide

1. Write your test cases in a Promptfoo config file. See examples/travel/travel_promtfooconfig.yaml as an example.
2. Define an AIConfig test suite settings file. It should have the prompt name and path to your aiconfig. See examples/travel/travel_aiconfig_test_suite_settings.json for example.
3. Set your provider to point to run_aiconfig.py with your settings file as the argument. For e.g. see examples/travel/travel_promtfooconfig.yaml. Like this:

```
providers:
  - exec:python ../../run_aiconfig.py ./travel_aiconfig_test_suite_settings.json
```

4. export your provider API key if needed so it's available to subprocess environments:
   `export OPENAI_API_KEY=...`

5. Make sure your shell environment (including subshells) contains a python3 executable called `python` on its path. One way to do this is to set up an anaconda/miniconda environment.

6. Run `npx promptfoo@latest eval -c path/to/promptfooconfig.yaml`
You should see one passing test and one failing test.

### Debugging / Troubleshooting
Help, something went wrong! 
-> Try adding --verbose flag at the end of the `npx` command.