# Alertsite Technical Benchmark v2

## Overview

The AlertSite Bench App is a comprehensive tool designed to provide users with a user-friendly interface for monitoring and analyzing the performance of their AlertSite devices.

## Project Structure

- **/pages/api/**: Contains the API-related code.

  - **monitor_batch**: Contains the implementation for the `monitor_batch` APIs.

- **/src**: Contains the source code for the project.

  - **/app/dashboard**: Contains the dashboard components.
    - **/components**: Contains the dashboard components.
    - **/hooks**: Contains the dashboard hooks.
    - **/providers**: Contains the dashboard providers.
  - **/models**: Includes data models and schema definitions.
  - **/components/ui**: Contains the ShadCDN UI components.
  - **/utils**: Utility functions and helpers.
  - **/lib**: Contains test cases for various modules.

- **README.md**: Overview of the project (this file).

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/spencer-christian/alertsite_bench_app.git
```

2. Install the required dependencies:

```bash
npm i
```

3. Run the project:

```bash
npm run dev
```

4. Run the tests:

```bash
npm test
```

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please submit a pull request or open an issue on the GitHub repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
