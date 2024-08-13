"""Core module for the cmdpedia_generator package."""

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

def generate(module_name: str, program_type: ProgramTypeEnum) -> None:
    """
    Generate command documentation for a Click CLI module.
    
    :param module_name: The name of the module to generate documentation for.
    :param program_type: The type of program to generate documentation for.
    """
    extractor: callable = get_program_extractor(program_type)
    module = __import__(module_name)
    operating_system: str = platform.system()
    python_command: str = "python" if operating_system == "Windows" else "python3"
    docstring, entry_funcs, commands = extractor(module)
    command_list: list = [command for command in commands]
    filename = os.path.basename(module.__file__)
    result: dict = {
        "docstring": docstring,
        "runCommand": f"{python_command} {filename}",
        "entryFuncs": entry_funcs,
        "commands": command_list
    }
    replace_placeholder_in_html(HTML_TEMPLATE_PATH, f"{filename}-cmdpedia.html", PLACEHOLDER_STRING, result)
