// backend.mjs
import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Timer } from './timer.mjs';

// Initialize environment variables
dotenv.config();

// Setup async exec
const execAsync = promisify(exec);

// Setup directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
async function ensureUploadsDirectory() {
    try {
        await fs.mkdir(UPLOADS_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating uploads directory:', error);
        throw error;
    }
}

// Initialize Supabase
function initializeSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
    }

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            persistSession: false,
        },
        global: {
            headers: {
                'apikey': supabaseKey,  // Add this
                'Authorization': `Bearer ${supabaseKey}`,  // And this
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        }
    });
}

// Initialize Express and middleware
function initializeExpress() {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // CORS configuration
    const corsOptions = {
        origin: ['http://localhost:3000', 'http://localhost:3001', 'https://blockscan-swin.vercel.app', 'https://blockscan-ndr4.onrender.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    };
    app.use(cors(corsOptions));

    return { app, corsOptions };
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${path.parse(file.originalname).name}-${uniqueSuffix}.sol`);
    }
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        if (!file.originalname.toLowerCase().endsWith('.sol')) {
            return cb(new Error('Only .sol files are allowed'));
        }
        cb(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Slither analysis functions
async function executeSlitherAnalysis(filePath) {
  try {
      const options = {
          maxBuffer: 1024 * 1024 * 50 // 50MB buffer
      };

      // Execute single Slither command for analysis
      let slitherOutput = '';
      try {
          const { stdout, stderr } = await execAsync(`slither "${filePath}" --print human-summary`, options);
          
          // Combine stdout and stderr as Slither might output to either
          slitherOutput = stdout || '';
          if (stderr) {
              console.log('Slither stderr:', stderr);
              // Only add stderr if it contains useful information
              if (stderr.includes('contracts in source files') || 
                  stderr.includes('Source lines of code') ||
                  stderr.includes('Number of')) {
                  slitherOutput += '\n' + stderr;
              }
          }
      } catch (execError) {
          console.error('Slither execution error:', execError);
          // Even if the command fails, we might have useful output
          slitherOutput = execError.stdout || '';
          if (execError.stderr) {
              console.log('Error stderr:', execError.stderr);
              if (execError.stderr.includes('contracts in source files') || 
                  execError.stderr.includes('Source lines of code') ||
                  execError.stderr.includes('Number of')) {
                  slitherOutput += '\n' + execError.stderr;
              }
          }
      }

      if (!slitherOutput.trim()) {
          throw new Error('No output received from Slither analysis');
      }

      // Clean the output
      const cleanOutput = slitherOutput
          .replace(/\u001b\[\d+m/g, '') // Remove ANSI color codes
          .replace(/\r\n/g, '\n')       // Normalize line endings
          .trim();

      // For vulnerabilities, run a separate detailed analysis
      let vulnsOutput = '';
      try {
          const { stdout: vulnsStdout, stderr: vulnsStderr } = await execAsync(`slither "${filePath}"`, options);
          vulnsOutput = (vulnsStdout || '') + (vulnsStderr || '');
      } catch (vulnError) {
          console.error('Vulnerability analysis error:', vulnError);
          vulnsOutput = (vulnError.stdout || '') + (vulnError.stderr || '');
      }

      const cleanVulns = vulnsOutput
          .replace(/\u001b\[\d+m/g, '')
          .replace(/\r\n/g, '\n')
          .trim();

      return {
          overview: cleanOutput,
          vulns: cleanVulns
      };
  } catch (error) {
      console.error('Slither execution error:', error);
      throw error;
  }
}




// Parse Slither output
const parseSlitherOutput = (output, scanDuration) => {
  try {
    // Initialize metrics with default values
    const metrics = {
      total_contracts: 0,
      source_lines: 0,
      assembly_lines: 0,
      scan_duration: scanDuration,      
      optimization_issues: 0,
      informational_issues: 0,
      low_issues: 0,
      medium_issues: 0,
      high_issues: 0,
      ercs: 'None'
    };

    // Split output into lines and process each line
    const lines = output.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);


    // Process each line
    lines.forEach(line => {
      let value;
      if (line.includes('Total number of contracts')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.total_contracts = parseInt(value);
      }
      else if (line.includes('Source lines of code')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.source_lines = parseInt(value);
      }
      else if (line.includes('Number of assembly lines')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.assembly_lines = parseInt(value);
      }
      else if (line.includes('Number of optimization issues')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.optimization_issues = parseInt(value);
      }
      else if (line.includes('Number of informational issues')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.informational_issues = parseInt(value);
      }
      else if (line.includes('Number of low issues')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.low_issues = parseInt(value);
      }
      else if (line.includes('Number of medium issues')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.medium_issues = parseInt(value);
      }
      else if (line.includes('Number of high issues')) {
        value = line.match(/:\s*(\d+)/)?.[1];
        if (value) metrics.high_issues = parseInt(value);
      }
      else if (line.includes('ERCs:')) {
        metrics.ercs = line.split('ERCs:')[1]?.trim() || 'None';
      }
    });
    return metrics;
  } catch (error) {
    console.error('Error parsing output:', error);
    throw new Error(`Failed to parse Slither output: ${error.message}`);
  }
};

// Parse Slither vulnerabilities
function parseSlitherVulns(slitherVulns) {
    const vulnsArray = [];
    const lines = slitherVulns.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

        const vulnerabilityTypes = [
            { id: 'abiencoderv2-array', name: 'Storage abiencoderv2 array', severity: 'High', recommendation: 'Use a compiler >= 0.5.10.' },
            { id: 'arbitrary-send-erc20', name: 'transferFrom uses arbitrary from', severity: 'High', recommendation: 'Use msg.sender as from in transferFrom.'},
            { id: 'array-by-reference', name: 'Modifying storage array by value', severity: 'High', recommendation:'Ensure the correct usage of memory and storage in the function parameters. Make all the locations explicit.' },
            { id: 'encode-packed-collision', name: 'ABI encodePacked Collision', severity: 'High', recommendation:'Do not use more than one dynamic type in abi.encodePacked() (see the Solidity documentation). Use abi.encode(), preferably.' },
            { id: 'incorrect-shift', name: 'The order of parameters in a shift instruction is incorrect.', severity: 'High', recommendation:'Swap the order of parameters.' },
            { id: 'multiple-constructors', name: 'Multiple constructor schemes', severity: 'High', recommendation:'Only declare one constructor, preferably using the new scheme constructor(...) instead of function <contractName>(...).'},
            { id: 'name-reused', name: 'Contract\'s name reused', severity: 'High', recommendation:'Rename the contract.' },
            { id: 'protected-vars', name: 'Detected unprotected variables', severity: 'High', recommendation:'Add access controls to the vulnerable function' },
            { id: 'public-mappings-nested', name: 'Public mappings with nested variables', severity: 'High', recommendation:'Do not use public mapping with nested structures.' },
            { id: 'rtlo', name: 'Right-To-Left-Override control character is used', severity: 'High', recommendation:'Special control characters must not be allowed.' },
            { id: 'shadowing-state', name: 'State variables shadowing', severity: 'High', recommendation:'Remove the state variable shadowing.' },
            { id: 'suicidal', name: 'Functions allowing anyone to destruct the contract', severity: 'High', recommendation:'Protect access to all sensitive functions.' },
            { id: 'uninitialized-state', name: 'Uninitialized state variables', severity: 'High', recommendation:'Initialize all the variables. If a variable is meant to be initialized to zero, explicitly set it to zero to improve code readability.' },
            { id: 'uninitialized-storage', name: 'Uninitialized storage variables', severity: 'High', recommendation:'Initialize all storage variables.' },
            { id: 'unprotected-upgrade', name: 'Unprotected upgradeable contract', severity: 'High', recommendation:'Add a constructor to ensure initialize cannot be called on the logic contract.'},
            { id: 'codex', name: 'Use Codex to find vulnerabilities.', severity: 'High', recommendation:'Review codexs message.' },
            { id: 'arbitrary-send-erc20-permit', name: 'transferFrom uses arbitrary from with permit', severity: 'High', recommendation:'Ensure that the underlying ERC20 token correctly implements a permit function.'},
            { id: 'arbitrary-send-eth', name: 'Functions that send Ether to arbitrary destinations', severity: 'High', recommendation:'Ensure that an arbitrary user cannot withdraw unauthorized funds.' },
            { id: 'controlled-array-length', name: 'Array Length Assignment', severity: 'High', recommendation:'Do not allow array lengths to be set directly set; instead, opt to add values as needed. Otherwise, thoroughly review the contract to ensure a user-controlled variable cannot reach an array length assignment.' },
            { id: 'controlled-delegatecall', name: 'Controlled Delegatecall', severity: 'High', recommendation:'Avoid using delegatecall. Use only trusted destinations.'},
            { id: 'delegatecall-loop', name: 'Payable functions using delegatecall inside a loop', severity: 'High', recommendation:'Carefully check that the function called by delegatecall is not payable/doesnt use msg.value.'},
            { id: 'incorrect-exp', name: 'Incorrect exponentiation', severity: 'High', recommendation:'Use the correct operator ** for exponentiation.' },
            { id: 'incorrect-return', name: 'Incorrect return in assembly', severity: 'High', recommendation:'Use the leave statement.' },
            { id: 'msg-value-loop', name: 'msg.value inside a loop', severity: 'High', recommendation:'Provide an explicit array of amounts alongside the receivers array, and check that the sum of all amounts matches msg.value.'},
            { id: 'return-leave', name: 'If a return is used instead of a leave.', severity: 'High', recommendation:'Use the leave statement.'},
            { id: 'storage-array', name: 'Signed storage integer array compiler bug', severity: 'High', recommendation:'Use a compiler version >= 0.5.10.'},
            { id: 'unchecked-transfer', name: 'Unchecked tokens transfer', severity: 'High', recommendation:'Use SafeERC20, or ensure that the transfer/transferFrom return value is checked.'},
            { id: 'weak-prng', name: 'Weak PRNG', severity: 'High', recommendation:'Do not use block.timestamp, now or blockhash as a source of randomness' },
            { id: 'domain-separator-collision', name: 'Domain separator collision', severity: 'Medium', recommendation: 'Remove or rename the function that collides with DOMAIN_SEPARATOR().' },
            { id: 'enum-conversion', name: 'Detect dangerous enum conversion', severity: 'Medium', recommendation:'Use a recent compiler version. If solc <0.4.5 is required, check the enum conversion range.' },
            { id: 'erc20-interface', name: 'Incorrect ERC20 interfaces', severity: 'Medium', recommendation: 'Set the appropriate return values and types for the defined ERC20 functions.' },
            { id: 'erc721-interface', name: 'Incorrect ERC721 interfaces', severity: 'Medium', recommendation:'Set the appropriate return values and vtypes for the defined ERC721 functions.' },
            { id: 'incorrect-equality', name: 'Dangerous strict equalities', severity: 'Medium', recommendation:'Do not use strict equality to determine if an account has enough Ether or tokens.' },
            { id: 'contracts-that-lock-ether', name: 'Contracts that lock ether', severity: 'Medium', recommendation: 'Remove the payable attribute or add a withdraw function.' },
            { id: 'mapping-deletion', name: 'Deletion on mapping containing a structure', severity: 'Medium', recommendation:'Use a lock mechanism instead of a deletion to disable structure containing a mapping.' },
            { id: 'shadowing-abstract', name: 'State variables shadowing from abstract contracts', severity: 'Medium', recommendation:'Remove the state variable shadowing.' },
            { id: 'tautological-compare', name: 'Comparing a variable to itself always returns true or false', severity: 'Medium', recommendation:'Remove comparison or compare to different value.' },
            { id: 'tautology', name: 'Tautology or contradiction', severity: 'Medium', recommendation:'Fix the incorrect comparison by changing the value type or the comparison.' },
            { id: 'write-after-write', name: 'Unused write', severity: 'Medium', recommendation:'Fix or remove the writes' },
            { id: 'boolean-cst', name: 'Misuse of Boolean constant', severity: 'Medium', recommendation:'Verify and simplify the condition.' },
            { id: 'constant-function-asm', name: 'Constant functions using assembly code', severity: 'Medium', recommendation:'Ensure the attributes of contracts compiled prior to Solidity 0.5.0 are correct.' },
            { id: 'constant-function-state', name: 'Constant functions changing the state', severity: 'Medium', recommendation:'Ensure that attributes of contracts compiled prior to Solidity 0.5.0 are correct.' },
            { id: 'divide-before-multiply', name: 'Imprecise arithmetic operations order', severity: 'Medium', recommendation:'Consider ordering multiplication before division.' },
            { id: 'out-of-order-retryable', name: 'Out-of-order retryable transactions', severity: 'Medium', recommendation:'Do not rely on the order or successful execution of retryable tickets.' },
            { id: 'reentrancy-vulnerabilities-1', name: 'Reentrancy vulnerabilities (no theft of ethers)', severity: 'Medium', recommendation:'Apply the check-effects-interactions pattern.' },
            { id: 'reused-constructor', name: 'Reused base constructor', severity: 'Medium', recommendation: 'Remove the duplicate constructor call.' },
            { id: 'tx-origin', name: 'Dangerous usage of tx.origin', severity: 'Medium', recommendation:'Do not use tx.origin for authorization.' },
            { id: 'unchecked-low-level-calls', name: 'Unchecked low-level calls', severity: 'Medium', recommendation:'Ensure that the return value of a low-level call is checked or logged.' },
            { id: 'unchecked-send', name: 'Unchecked send', severity: 'Medium', recommendation:'Ensure that the return value of send is checked or logged.' },
            { id: 'uninitialized-local', name: 'Uninitialized local variables', severity: 'Medium', recommendation:'Ensure that the return value of send is checked or logged.' },
            { id: 'unused-return', name: 'Unused Return Value', severity: 'Medium', recommendation:'Ensure that the return value of send is checked or logged.' },
            { id: 'shadowing-builtin', name: 'Builtin Symbol Shadowing', severity: 'Low', recommendation:'Rename the local variables, state variables, functions, modifiers, and events that shadow a builtin symbol.' },
            { id: 'missing-events-access-control', name: 'Missing Events Access Control', severity: 'Low', recommendation:'Emit an event for critical parameter changes.' },
            { id: 'events-maths', name: 'Missing events arithmetic', severity: 'Low', recommendation:'Emit an event for critical parameter changes.' },
            { id: 'calls-loop', name: 'Calls inside a loop', severity: 'Low', recommendation:'Favor pull over push strategy for external calls.' },
            { id: 'void-cst', name: 'Void constructor', severity: 'Low', recommendation:'Remove the constructor call.' },
            { id: 'variable-scope', name: 'Pre-declaration usage of local variables', severity: 'Low', recommendation:'Move all variable declarations prior to any usage of the variable, and ensure that reaching a variable declaration does not depend on some conditional if it is used unconditionally.'},
            { id: 'shadowing-local', name: 'Local variable shadowing', severity: 'Low', recommendation:'Rename the local variables that shadow another component.' },
            { id: 'uninitialized-fptr-cst', name: 'Uninitialized function pointers in constructors', severity: 'Low', recommendation:'Initialize function pointers before calling. Avoid function pointers if possible.' },
            { id: 'incorrect-unary', name: 'Dangerous unary expressions', severity: 'Low', recommendation:'Remove the unary expression.' },
            { id: 'missing-zero-address-validation', name: 'Missing Zero Address Validation', severity: 'Low', recommendation:'Check that the address is not zero.' },
            { id: 'reentrancy-vulnerabilities-2', name: 'Reentrancy Vulnerabilities (benign reentrancy)', severity: 'Low', recommendation:'Apply the check-effects-interactions pattern.' },
            { id: 'reentrancy-vulnerabilities-3', name: 'Reentrancy Vulnerabilities (events emitted incorrectly)', severity: 'Low', recommendation:'Apply the check-effects-interactions pattern.' },
            { id: 'return-bomb', name: 'Return Bomb', severity: 'Low', recommendation:'Avoid unlimited implicit decoding of returndata.' },
            { id: 'block-timestamp', name: 'Block timestamp', severity: 'Low', recommendation:'Avoid relying on block.timestamp.' },
            { id: 'incorrect-modifier', name: 'Incorrect modifier', severity: 'Low', recommendation:'All the paths in a modifier must execute _ or revert.' },
            { id: 'assembly-usage', name: 'Assembly usage', severity: 'Informational', recommendation:'Do not use evm assembly.' },
            { id: 'assert-state-change', name: 'Assert state change', severity: 'Informational', recommendation:'Use require for invariants modifying the state.' },
            { id: 'boolean-equal', name: 'Comparison to boolean constant', severity: 'Informational', recommendation:'Remove the equality to the boolean constant.' },
            { id: 'cyclomatic-complexity', name: 'High cyclomatic complexity', severity: 'Informational', recommendation:'Reduce cyclomatic complexity by splitting the function into several smaller subroutines.' },
            { id: 'deprecated-standards', name: 'Deprecated Solidity Standards', severity: 'Informational', recommendation:'Replace all uses of deprecated symbols.' },
            { id: 'erc20-indexed', name: 'Un-indexed ERC20 event parameters', severity: 'Informational', recommendation:'Add the indexed keyword to event parameters that should include it, according to the ERC20 specification.' },
            { id: 'function-init-state', name: 'Function initializing state variables', severity: 'Informational', recommendation:'Remove any initialization of state variables via non-constant state variables or function calls. If variables must be set upon contract deployment, locate initialization in the constructor instead.' },
            { id: 'incorrect-using-for', name: 'Incorrect using-for statement', severity: 'Informational', recommendation:'Make sure that the libraries used in using-for statements have at least one function matching a type used in these statements.' },
            { id: 'low-level-calls', name: 'Low-level calls', severity: 'Informational', recommendation:'Avoid low-level calls. Check the call success. If the call is meant for a contract, check for code existence.' },
            { id: 'missing-inheritance', name: 'Missing inheritance', severity: 'Informational', recommendation:'Inherit from the missing interface or contract.' },
            { id: 'pragma', name: 'Different pragma directives are used', severity: 'Informational', recommendation:'Use one Solidity version.' },
            { id: 'redundant-statements', name: 'Redundant statements', severity: 'Informational', recommendation:'Remove redundant statements if they congest code but offer no value.' },
            { id: 'incorrect-version', name: 'Incorrect versions of Solidity', severity: 'Informational', recommendation:'Deploy with a recent version of Solidity (at least 0.8.0) with no known severe issues. Use a simple pragma version that allows any of these versions. Consider using the latest version of Solidity for testing.' },
            { id: 'unimplemented-functions', name: 'Unimplemented functions', severity: 'Informational', recommendation:'Implement all unimplemented functions in any contract you intend to use directly (not simply inherit from).' },
            { id: 'unused-import', name: 'Unused Import', severity: 'Informational', recommendation:'Remove the unused import. If the import is needed later, it can be added back.' },
            { id: 'unused-state', name: 'Unused state variable', severity: 'Informational', recommendation:'Remove unused state variables.' },
            { id: 'costly-loop', name: 'Costly operations in a loop', severity: 'Informational', recommendation:'Use a local variable to hold the loop computation result.' },
            { id: 'dead-code', name: 'Dead code', severity: 'Informational', recommendation:'Remove unused functions.' },
            { id: 'similar-names', name: 'Variable names too similar', severity: 'Informational', recommendation:'Prevent variables from having similar names.' },
            { id: 'reentrancy-vulnerabilities-4', name: 'Reentrancy vulnerabilities (unlimited gas)', severity: 'Informational', recommendation:'Apply the check-effects-interactions pattern.' },
            { id: 'too-many-digits', name: 'Too many digits', severity: 'Informational', recommendation:'Use: Ether suffix, Time suffix, or The scientific notation' },
            { id: 'cache-array-length', name: 'Cache array length', severity: 'Optimization', recommendation:'Cache the lengths of storage arrays if they are used and not modified in for loops' },
            { id: 'constable-states', name: 'State variables that could be declared constant', severity: 'Optimization', recommendation:'Add the constant attribute to state variables that never change.' },
            { id: 'external-function', name: 'Public function that could be declared external', severity: 'Optimization', recommendation:'Use the external attribute for functions never called from the contract, and change the location of immutable parameters to calldata to save gas.' },
            { id: 'immutable-states', name: 'State variables that could be declared immutable', severity: 'Optimization', recommendation:'Add the immutable attribute to state variables that never change or are set only in the constructor.' },
            { id: 'var-read-using-this', name: 'Contract reads its own variable using this', severity: 'Optimization', recommendation:'Read the variable directly from storage instead of calling the contract.' },
            { id: 'conformance-to-solidity-naming-convention', name: 'Conformance to Solidity naming conventions', severity: 'Informational', recommendation:'Follow the Solidity naming convention.' },
            { id: 'reentrancy-vulnerabilities', name: 'Reentrancy vulnerabilities (theft of ethers)', severity: 'High', recommendation:'Apply the check-effects-interactions pattern.' },
        ];

        lines.forEach(line => {
            const found = vulnerabilityTypes.find(vuln => line.includes(vuln.id));
            if (found) {
                vulnsArray.push([found.name, found.severity, found.recommendation]);
            }
        });
    return vulnsArray;
}

async function getMarkdownContent(filePath) {
    try {
        // Generate the markdown file
        const resultPath = path.join(process.cwd(), 'app', 'api', 'result.md');
        
        try {
            const { stdout, stderr } = await execAsync(`slither "${filePath}" --checklist`);
            // Return the output directly instead of writing to file
            return stdout || '';
        } catch (execError) {
            // Even if there's an error, we might have useful output
            return execError.stdout || execError.stderr || '';
        }
    } catch (error) {
        console.error('Error generating markdown content:', error);
        throw error;
    }
}
// Main application setup
async function setupApplication() {
    try {
        // Initialize everything
        await ensureUploadsDirectory();
        const supabase = initializeSupabase();
        const { app, corsOptions } = initializeExpress();

        // Health check endpoint
        app.get('/health', (_req, res) => {
            res.json({ status: 'ok', message: 'Server is running' });
        });

        // File upload endpoint
        app.post('/contract-upload', upload.single('contractFile'), async (req, res) => {
            try {
                if (!req.file) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'No file uploaded'
                    });
                }

                res.status(200).json({
                    status: 'success',
                    message: 'File uploaded successfully',
                    data: {
                        filename: req.file.filename
                    }
                });
            } catch (error) {
                console.error('Upload error:', error);
                res.status(500).json({
                    status: 'error',
                    message: error.message || 'File upload failed'
                });
            }
        });

        // Contract analysis endpoint
        app.post('/contract-analyze', async (req, res) => {
            const sessionId = req.headers['x-session-id'];  // Get from request header
            const timer = new Timer();

          timer.start();
          let filePath;
      
          try {
              const { projectName, filename, version } = req.body;
              console.log('Analyzing:', { projectName, filename });
              if (!projectName || !filename) {
                  return res.status(400).json({
                      status: 'error',
                      message: 'Project name and filename are required'
                  });
              }
              const { stdout, stderr } = await execAsync(`solc-select use ${version}`);
                if (stderr) {
                    console.error('Error while selecting Solidity version:', stderr);
                    return res.status(500).json({
                        status: 'error',
                        message: `Error selecting Solidity version: ${stderr}`
                    });
                }
                console.log('Solidity version selected:', stdout);
              filePath = path.join(UPLOADS_DIR, filename);
              
              try {
                  await fs.access(filePath);
              } catch {
                  return res.status(404).json({
                      status: 'error',
                      message: 'Contract file not found'
                  });
              }
      
              // Execute Slither analysis with new implementation
              const analysisResult = await executeSlitherAnalysis(filePath);
              // Parse results
              const scanDuration = timer.stop();
              const metrics = parseSlitherOutput(analysisResult.overview, scanDuration);
              const vulnerabilities = parseSlitherVulns(analysisResult.vulns);
              const markdownContent = await getMarkdownContent(filePath);
              // Convert all numeric values explicitly for database

      
              // Save to database
            const { data: metricsData, error: metricsError } = await supabase
                .from('slither_metrics')
                .insert([{
                    project_name: projectName,
                    session_id: sessionId,
                    total_contracts: Number(metrics.total_contracts) || 0,
                    source_lines: Number(metrics.source_lines) || 0,
                    assembly_lines: Number(metrics.assembly_lines) || 0,
                    scan_duration: Number(scanDuration) || 0,
                    optimization_issues: Number(metrics.optimization_issues) || 0,
                    informational_issues: Number(metrics.informational_issues) || 0,
                    low_issues: Number(metrics.low_issues) || 0,
                    medium_issues: Number(metrics.medium_issues) || 0,
                    high_issues: Number(metrics.high_issues) || 0,
                    ercs: String(metrics.ercs || 'None'),
                    markdown_content: markdownContent || 'None',
                }])
                .select();
      
              if (metricsError) throw metricsError;
      
              // Save vulnerabilities
              if (vulnerabilities.length > 0) {
                  const vulnRecords = vulnerabilities.map(vuln => ({
                      metrics_id: metricsData[0].id,
                      vulnerability: vuln[0],
                      severity: vuln[1],
                      recommendation: vuln[2],
                  }));
      
                  const { error: vulnsError } = await supabase
                      .from('vulnerabilities')
                      .insert(vulnRecords);
      
                  if (vulnsError) throw vulnsError;
              }
      
              // Cleanup
              try {
                  await fs.unlink(filePath);
                  console.log('Cleaned up file:', filePath);
              } catch (cleanupError) {
                  console.error('Error cleaning up file:', cleanupError);
              }
      
              res.status(200).json({
                  status: 'success',
                  message: 'Analysis completed successfully',
                  data: {
                      projectName,
                      metrics: {
                          total_contracts: metrics.total_contracts,
                          source_lines: metrics.source_lines,
                          assembly_lines: metrics.assembly_lines,
                          scan_duration: metrics.scan_duration,
                          issues: {
                              optimization: metrics.optimization_issues,
                              informational: metrics.informational_issues,
                              low: metrics.low_issues,
                              medium: metrics.medium_issues,
                              high: metrics.high_issues,
                          },
                      },
                      vulnerabilities: vulnerabilities, //here I return the array of Vulnerabilities including names and severity
                      timestamp: new Date().toISOString(),
                      id: metricsData[0].id,
                      markdown_content: markdownContent,
                  }
              });

          } catch (error) {
              console.error('Analysis error:', error);
              if (filePath) {
                  try {
                      await fs.unlink(filePath);
                  } catch (cleanupError) {
                      console.error('Error cleaning up file:', cleanupError);
                  }
              }
              res.status(500).json({
                  status: 'error',
                  message: error.message || 'Analysis failed'
              });
          }
      });



        // Start server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Uploads directory: ${UPLOADS_DIR}`);
            console.log('CORS enabled for:', corsOptions.origin);
        });

        // Handle shutdown
        process.on('SIGTERM', async () => {
            console.log('SIGTERM received. Cleaning up...');
            try {
                const files = await fs.readdir(UPLOADS_DIR);
                await Promise.all(files.map(file => fs.unlink(path.join(UPLOADS_DIR, file))));
            } catch (error) {
                console.error('Cleanup error:', error);
            }
            process.exit(0);
        });

    } catch (error) {
        console.error('Application setup failed:', error);
        process.exit(1);
    }
}

// Start the application
setupApplication().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});