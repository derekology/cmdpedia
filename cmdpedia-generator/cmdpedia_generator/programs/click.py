
import ast


class ClickGroupVisitor(ast.NodeVisitor):
    """Visitor class for extracting Click group functions from a module."""

    def __init__(self) -> None:
        """Initialize the visitor object."""
        self.group: list = []

    def visit_FunctionDef(self, node: ast.FunctionDef) -> None:
        """
        Visit a FunctionDef node in the AST.
        
        :param node: The node to visit.
        """
        if any(isinstance(decorator, ast.Call) and
               isinstance(decorator.func, ast.Attribute) and
               decorator.func.attr == "group"
               for decorator in node.decorator_list):
            self.group.append(node.name)
        self.generic_visit(node)

    def get_groups(self) -> list:
        """Return the list of Click group functions."""
        return self.group


class ClickEntryVisitor(ast.NodeVisitor):
    """Visitor class for extracting all functions called in the if __name__ == "__main__" block."""

    def __init__(self) -> None:
        """
        Initialize the visitor object.
        """
        self.entry_funcs = []

    def visit_If(self, node: ast.If) -> None:
        """
        Visit an If node in the AST to check if it's the main entry point.
        
        :param node: The node to visit.
        """
        if (isinstance(node.test, ast.Compare) and
            isinstance(node.test.left, ast.Name) and
            node.test.left.id == "__name__" and
            isinstance(node.test.ops[0], ast.Eq) and
            isinstance(node.test.comparators[0], ast.Constant) and
            node.test.comparators[0].value == "__main__"):
            
            for stmt in node.body:
                if isinstance(stmt, ast.Expr) and isinstance(stmt.value, ast.Call):
                    func = stmt.value.func
                    if isinstance(func, ast.Name):
                        self.entry_funcs.append(func.id)
                    elif isinstance(func, ast.Attribute):
                        self.entry_funcs.append(f"{ast.dump(func.value)}.{func.attr}")

        self.generic_visit(node)

    def get_entry_funcs(self) -> list:
        """Return the list of entry point functions."""
        return self.entry_funcs


class ClickGroupHierarchyVisitor(ast.NodeVisitor):
    """Visitor class for extracting the hierarchy of Click groups from a module."""

    def __init__(self, entry_funcs: str = None) -> None:
        """
        Initialize the visitor object.
        
        :param entry: The name of the entry point function.
        """
        self.hierarchy: dict[str, str] = {}
        self.current_path: list[str] = []
        self.entry_funcs: list[str] = entry_funcs

    def visit_FunctionDef(self, node) -> None:
        """
        Visit a FunctionDef node in the AST.
        
        :param node: The node to visit.
        """
        if any(isinstance(decorator, ast.Call) and decorator.func.attr == "group" for decorator in node.decorator_list):
            if not node.name:
                return
            elif node.name in self.entry_funcs:
                self.hierarchy[node.name] = ""
                self.generic_visit(node)
            else:
                self.current_path.append(node.name)
                self.hierarchy[node.name] = " ".join(self.current_path)
                self.generic_visit(node)
                self.current_path.pop()
        else:
            self.generic_visit(node)

    def visit_Call(self, node) -> None:
        """
        Visit a Call node in the AST.
        
        :param node: The node to visit.
        """
        if isinstance(node.func, ast.Attribute) and node.func.attr == "add_command":
            if isinstance(node.func.value, ast.Name):
                parent_group: str = node.func.value.id
                if node.args and isinstance(node.args[0], ast.Name):
                    command_name: str = node.args[0].id
                    self.hierarchy[command_name] = command_name \
                        if parent_group in self.entry_funcs \
                        else f"{self.hierarchy[parent_group]} {command_name}"
        self.generic_visit(node)

    def get_hierarchy(self) -> dict:
        """Return the hierarchy of Click groups."""
        return self.hierarchy


class ClickCommandVisitor(ast.NodeVisitor):
    """Visitor class for extracting Click command functions from a module."""

    def __init__(self, hierarchy: dict) -> None:
        """
        Initialize the visitor object.
        
        :param hierarchy: The hierarchy of Click groups.
        """
        self.commands: list = []
        self.current_group: str | None = None
        self.hierarchy: dict = hierarchy

    def visit_FunctionDef(self, node) -> None:
        """
        Visit a FunctionDef node in the AST.
        
        :param node: The node to visit.
        """
        command_info = {
            "id": len(self.commands),
            "type": "click",
            "name": node.name.replace("_", "-"),
            "group": self.current_group,
            "description": ast.get_docstring(node) or "No description provided.",
            "CommandArgs": [],
            "CommandOptions": [],
            "CommandFlags": []
        }

        is_command = False
        is_group = False
        for decorator in node.decorator_list:
            if isinstance(decorator, ast.Call) and isinstance(decorator.func, ast.Attribute):
                if decorator.func.attr == "group":
                    is_group = True
                elif decorator.func.attr == "command":
                    is_command = True
                    command_info["group"] = "" if decorator.func.value.id == 'click' else self.hierarchy.get(decorator.func.value.id, "")
                elif decorator.func.attr == "argument":
                    arg_name = decorator.args[0].value
                    help_text = "No description provided."
                    for keyword in decorator.keywords:
                        if keyword.arg == "help":
                            help_text = keyword.value.value
                    command_info["CommandArgs"].append({
                        "id": len(command_info["CommandArgs"]),
                        "placeholder": arg_name,
                        "description": help_text,
                        "required": not any(kw.arg == "default" for kw in decorator.keywords)
                    })
                elif decorator.func.attr == "option":
                    option_name = decorator.args[0].value
                    is_flag = any(kw.arg == "is_flag" for kw in decorator.keywords)
                    default_value = any(kw.arg == "default" for kw in decorator.keywords)
                    help_text = "No description provided."
                    for keyword in decorator.keywords:
                        if keyword.arg == "help":
                            help_text = keyword.value.value
                    if is_flag:
                        command_info["CommandFlags"].append({
                            "id": len(command_info["CommandFlags"]),
                            "flag": option_name,
                            "description": help_text,
                            "required": not default_value
                        })
                    else:
                        command_info["CommandOptions"].append({
                            "id": len(command_info["CommandOptions"]),
                            "flag": option_name,
                            "separator": "=",
                            "placeholder": "input",
                            "description": help_text,
                            "required": not default_value
                        })

        if is_command and not is_group:
            self.commands.append(command_info)
        self.generic_visit(node)


def extract_click_commands(parsed_ast) -> tuple:
    """
    Extract Click commands from a abstract syntax tree.
    
    :param parsed_ast: abstract syntax tree parsed from the source code of the module.
    :return: A tuple containing the docstring, entry point functions, and a list of commands.
    """
    docstring = ast.get_docstring(parsed_ast) or ""

    click_entry_visitor: ClickEntryVisitor = ClickEntryVisitor()
    click_entry_visitor.visit(parsed_ast)
    entry_funcs: str = click_entry_visitor.get_entry_funcs()

    click_group_hierarchy_visitor: ClickGroupHierarchyVisitor = ClickGroupHierarchyVisitor(entry_funcs=entry_funcs)
    click_group_hierarchy_visitor.visit(parsed_ast)
    hierarchy: dict = click_group_hierarchy_visitor.get_hierarchy()

    click_command_visitor: ClickCommandVisitor = ClickCommandVisitor(hierarchy=hierarchy)
    click_command_visitor.visit(parsed_ast)
    commands: dict = click_command_visitor.commands

    return docstring, entry_funcs, commands