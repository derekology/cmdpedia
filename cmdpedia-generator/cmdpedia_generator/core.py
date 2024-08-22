"""Core module for the cmdpedia_generator package."""

from typing import Optional

import ast
import json
import os
import platform
import sys
import base64


HTML_TEMPLATE_PATH: str = 'templates/index.html'
PLACEHOLDER_STRING: str = 'MERGE_PROGRAM_INFO_JSON_HERE'

current_directory: str = os.getcwd()
sys.path.insert(0, current_directory)


class ProgramTypeEnum:
    """Enumeration of supported program types."""
    CLICK = 'click'

def get_program_extractor(program_type: str) -> callable:
    """
    Get the extractor for a program type.

    :param program_type: The program type.
    :return: The extractor.
    """
    if program_type == ProgramTypeEnum.CLICK:
        import cmdpedia_generator.programs.click as click
        return click.extract_click_commands
    else:
        raise ValueError(f"Unsupported program type: {program_type}")


def replace_placeholder_in_html(template_path, output_path, placeholder, replacement) -> None:
    """
    Replace a placeholder in an HTML template with a base64 encoded JSON string.

    :param template_path: The path to the HTML template file.
    :param output_path: The path to the output file.
    :param placeholder: The placeholder string to replace.
    :param replacement: The JSON object to replace the placeholder with.
    """
    json_string: str = json.dumps(replacement)
    encoded_json_string: str = base64.b64encode(json_string.encode('utf-8')).decode('utf-8')

    base_path: str = os.path.dirname(__file__)
    template_path: str = os.path.join(base_path, template_path.replace('/', os.sep))

    with open(template_path, 'r', encoding='utf-8') as file:
        content = file.read()

    updated_content: str = content.replace(placeholder, encoded_json_string)

    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(updated_content)

def generate(program_type: ProgramTypeEnum, file_path: str) -> None:
    """
    Generate command documentation for a Click CLI module.
    
    :param program_type: The type of program to generate documentation for.
    :param file_path: The file path to the .py module to generate documentation for.
    """
    if not file_path.endswith(".py"):
        raise ValueError(f"Invalid file type: {file_path}. Expected a .py file.")
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            source_code = file.read()
    except Exception as e:
        raise IOError(f"Error reading file {file_path}: {str(e)}")
    
    try:
        parsed_ast = ast.parse(source_code)
    except SyntaxError as e:
        raise SyntaxError(f"Syntax error in file {file_path}: {str(e)}")
    
    extractor: callable = get_program_extractor(program_type)
    try:
        docstring, entry_funcs, commands = extractor(parsed_ast)
    except Exception as e:
        raise RuntimeError(f"Error extracting commands from {file_path}: {str(e)}")

    operating_system: str = platform.system()
    python_command: str = "python" if operating_system == "Windows" else "python3"
    docstring, entry_funcs, commands = extractor(parsed_ast)
    command_list: list = [command for command in commands]
    filename = os.path.basename(file_path)
    result: dict = {
        "docstring": docstring,
        "runCommand": f"{python_command} {filename}",
        "entryFuncs": entry_funcs,
        "commands": command_list
    }
    
    output_path = os.path.join(current_directory, f"{filename}-cmdpedia.html")
    try:
        replace_placeholder_in_html(HTML_TEMPLATE_PATH, output_path, PLACEHOLDER_STRING, result)
    except Exception as e:
        raise IOError(f"Error writing output file {output_path}: {str(e)}")
