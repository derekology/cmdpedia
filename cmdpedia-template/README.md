# > cmdpedia

## Introduction

Cmdpedia is an work-in-progress encyclopedia of commands that allows users to search for commands, view their available inputs, add inputs, and copy command syntax. It connects to a Supabase Postgres database to retrieve and manage command data.

## Features

- Search for commands by name or keyword
- View available inputs for a selected command
- Add inputs to customize the command's syntax
- Edit placeholder values in the syntax
- Copy the complete command syntax with selected inputs

## Getting Started

### Prerequisites

Before running cmdpedia, make sure you have the following prerequisites installed on your system:

- Node.js (at least version 18.16.x)
- npm (Node Package Manager)

### Installation

To set up cmdpedia locally, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/derekology/cmdpedia.git
   ```

2. Change into the project directory:

   ```bash
   cd cmdpedia
   ```

3. Install the dependencies using npm:

   ```bash
   npm install
   ```

4. Create a Supabase account and set up a project with a database named "cmdpedia".

5. Obtain your Supabase URL and API key.

6. Create a .env file in the project root and add your Supabase URL and API key:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_KEY=your-supabase-api-key
   ```

### Usage

After you have installed the dependencies, you can start the development server:

```bash
npm run dev
```

This will launch the development server, and you can access the application by visiting http://localhost:5173 in your web browser.

## Contributing

Contributions are welcome! If you find a bug or have an idea for an enhancement, feel free to open an issue or submit a pull request.

## Contact

If you have any questions about this project, please feel free to reach out to me at me@derekw.co.
