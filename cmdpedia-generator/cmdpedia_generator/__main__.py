"""
This is the command line interface for the cmdpedia_generator package.

cmdpedia generator aims to make documenting command line applications easier. For example, it'll parse this module docstring and display it on the home page. Then it'll parse its commands and make them available in the search bar above. Go on - give it a try! There are also more examples in the docs/example_modules folder.

It can be used by either importing the module and calling the `generate_cmdpedia` function, or by running the package as a script.

Please visit the Github repo in the About page to view known issues, or open a new one.

Thanks for visiting!
"""

import click
from cmdpedia_generator.core import generate

@click.command()
@click.argument('program_type')
@click.argument('file_path')
def main(program_type, file_path) -> None:
    """Main entry point for the command line interface.
    
    :param file_path: The file path to the .py module to generate documentation for.
    :param program_type: The type of program to generate documentation for. Must be one of: 'click'.
    """
    generate(program_type, file_path)

if __name__ == "__main__":
    main()
