# 🛡️ BlockScan - Smart Contract Audit System

![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black)
![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green)
![Supabase](https://img.shields.io/badge/Supabase-2.0.0-darkgreen)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-cyan)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://blockscan-demo.vercel.app)

BlockScan is a comprehensive web-based platform designed to enhance blockchain security by providing thorough smart contract auditing tools. Our system allows developers and businesses to upload smart contracts for in-depth security analysis, identifying vulnerabilities and providing actionable recommendations before deployment. BlockScan leverages Slither, a powerful Solidity static analysis framework, to audit and scan for vulnerabilities in smart contracts, displaying the detailed terminal output directly in a user-friendly format.

## 🔍 Overview

In the rapidly evolving world of blockchain technology, smart contract security is paramount. A single vulnerability can lead to significant financial losses. BlockScan addresses this critical need by offering:

- **Automated Security Analysis**: Detect common vulnerabilities using static analysis
- **Comprehensive Reports**: Detailed vulnerability assessments with severity ratings
- **Actionable Recommendations**: Clear guidance on how to address identified issues
- **User-Friendly Interface**: Intuitive design for both beginners and experienced developers

## ✨ Features

### Smart Contract Submission
Upload your Solidity (.sol) files for thorough security analysis through our user-friendly interface.

### Comprehensive Audit Reports
Receive detailed reports categorizing vulnerabilities by severity (High, Medium, Low) with descriptions and remediation suggestions. BlockScan displays the raw terminal output from Slither directly in the interface, providing complete transparency into the auditing process while also converting the technical output into an easy-to-understand format.

### Vulnerability Detection
Identify critical security issues including:
- Reentrancy vulnerabilities
- Unchecked low-level calls
- Integer overflow/underflow
- Unprotected functions
- And many more

### Historical Report Access
Retrieve and compare previous audit reports to track security improvements over time.

## 🖥️ Dashboard Interface

BlockScan offers an intuitive dashboard experience with:

- **Contract Overview**: View key metrics and safety scores
- **Token Information**: Access liquidity, governance, and safety data
- **Risk Assessment**: Visualize potential vulnerabilities by severity
- **PDF Reports**: Download comprehensive audit results

## 🚀 Getting Started

### Live Demo

✨ **[Visit our live demo](https://blockscan-demo.vercel.app)** to see BlockScan in action! ✨

### Prerequisites

- Node.js (v14 or later)
- Database (MySQL or Supabase)
- Slither static analyzer

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/blockscan.git

# Navigate to project directory
cd blockscan

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run the development server
npm run dev
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/contract-upload` | POST | Upload a Solidity contract file |
| `/contract-analyze` | POST | Analyze an uploaded contract |

## 🔧 Technology Stack

- **Frontend**: Next.js, TailwindCSS, React
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Analysis Tools**: Slither (static analyzer)
- **Authentication**: Session-based user separation

## 📊 System Architecture

BlockScan uses a modern architecture with:

- **Database Schema**: Two main tables for metrics and vulnerabilities
- **API System**: RESTful design for contract upload and analysis
- **Session Management**: Unique session IDs for user data separation
- **Static Analysis**: Integration with Slither for vulnerability detection

## 🛠️ Slither Integration

BlockScan is powered by Slither, a comprehensive Solidity static analysis framework developed by Trail of Bits. Key aspects of our Slither integration include:

- **Full Terminal Output**: The system captures and displays the complete terminal output from Slither's analysis
- **Vulnerability Parsing**: Raw Slither output is parsed and categorized into a structured format
- **Severity Classification**: Vulnerabilities are automatically classified by severity level
- **Remediation Suggestions**: Each identified issue includes actionable suggestions based on Slither's recommendations
- **Markdown Reports**: Generates detailed reports in markdown format for better readability

When a contract is uploaded, our backend executes Slither against the Solidity code and processes the results through several parsing functions to transform the technical output into user-friendly insights.

## 👨‍💻 Development Team

- **Nguyen Thien Phuoc** - Group Leader, Fullstack Developer
- **Nguyen Phan Quoc Viet** - Frontend Developer, Document Preparer


Made with ❤️ for blockchain security
