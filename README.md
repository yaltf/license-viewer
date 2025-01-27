<!--
SPDX-License-Identifier: GPL-3.0-only.
SPDX-FileCopyrightText: 2025 International Committee of the Red Cross.

This software is licensed under GPL v3.0 license.
See LICENSE file at the root of the project.
-->

# License Viewer

License Viewer provides a convenient interface to display which package comes with which license. The tool is configurable and allows to filter data based on package name or license type. Furthermore, it enables exporting the data in various formats, including CSV and PDF, in addition to directly printing.

Developed by International Committee of the Red Cross (ICRC) in collaboration with Cortex Security S.A.

![License Viewer Screenshot](/imgs/license-viewer.png "License Viewer")

## Features

- Select from multiple scan results and examine license information by target
- Filter by package name and/or license type
- Export results in convenient formats

## Prerequisites

- Go 1.23 or higher

## Installation

```bash
# Clone the repository
git clone https://github.com/yaltf/license-viewer.git

# Change to project directory
cd license-viewer

# Build the project
go build
```

## Configuration

Create a directory named `results` that will contain the scan results:

```bash
mkdir results
```

## Usage

### View license information

Copy the scan results to `results` directory and run the following command

```bash
# Start UI as web application
./license-viewer
```

Then select a scan result and then a target to display the software packages and their corresponding licenses.

### Export

- To export results to a file, click CSV or PDF button on top of the license table.
- To print the table, click Print button and follow the instructions.

### Project Structure

```
.
├── main.go
├── index.html
├── assets/
│   └── css/
│       └── bulma.min.css
│       └── datatables.min.css
│   └── js/
│       └── app.js
│       └── datatables.min.js
│       └── jquery.-3.7.1.min.css
```
## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m -S 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Copyright and License

© 2025 International Committee of the Red Cross.

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

The [International Committee of the Red Cross (ICRC)](https://www.icrc.org/) is an impartial, neutral and independent organization whose exclusively humanitarian mission is to protect the lives and dignity of victims of armed conflict and other situations of violence and to provide them with assistance.
The ICRC also endeavours to prevent suffering by promoting and strengthening humanitarian law and universal humanitarian principles.
Established in 1863, the ICRC is at the origin of the Geneva Conventions and the International Red Cross and Red Crescent Movement. It directs and coordinates the international activities conducted by the Movement in armed conflicts and other situations of violence.