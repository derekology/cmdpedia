# > cmdpedia

cmdpedia is a work-in-progress that aims to make documenting command line applications easier.

Given a Python (Click-only for now) module, it'll parse its docstring and commands to generate a single HTML file that displays this information in a searchable, interactive way.

## Features

- Standalone, sharable HTML file
- Search for commands by name or keyword
- View available inputs for a selected command
- Add inputs to customize the command's syntax
- Edit placeholder values in the syntax
- Copy the complete command syntax with selected inputs

## Demo

[View the cmdpedia for this project's main module.](https://derekology.github.io/cmdpedia/)

Additional examples are located in the [docs/example_modules](https://github.com/derekology/cmdpedia/tree/main/docs/example_modules) folder.

## Installation

Install the generator from [PyPi](https://pypi.org/project/cmdpedia-generator/) by executing `pip install cmdpedia_generator`

## Usage

Once installed, generate a cmdpedia by either importing the module and calling the `generate()` function with the program type and filepath passed as arguments, or by running the package as a script.

Usage examples can be found in the [docs/example_modules](https://github.com/derekology/cmdpedia/tree/main/docs/example_modules) folder.

## Contributing

Contributions are welcome! If you find a bug or have an idea for an enhancement, feel free to open an issue or submit a pull request.

## Contact

If you have any questions about this project, please feel free to reach out to me at me@derekw.co.
