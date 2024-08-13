import click

@click.group()
def main():
    """Main command group."""
    pass

@click.group()
def admin():
    """Admin command group."""
    pass

@admin.command()
@click.argument('user_id')
@click.option('--email', required=True, help='The email address of the user.')
@click.option('--admin', is_flag=True, help='Grant admin privileges.')
def create_user(user_id, email, admin):
    """Create a new user."""
    click.echo(f'Creating user {user_id} with email {email}. Admin: {admin}')

@admin.command()
@click.argument('user_id')
def delete_user(user_id):
    """Delete a user."""
    click.echo(f'Deleting user {user_id}')

@click.command()
@click.argument('filename')
@click.option('--lines', default=10, help='Number of lines to read from the file.')
def read_file(filename, lines):
    """Read a file."""
    with open(filename, 'r') as file:
        for _ in range(lines):
            click.echo(file.readline().strip())

main.add_command(admin)
main.add_command(read_file)

if __name__ == "__main__":
    main()
