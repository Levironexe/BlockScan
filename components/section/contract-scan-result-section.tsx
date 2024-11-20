import React, { useState, useEffect } from 'react';
import { ResultBody, NoContractFound } from '@/components/index';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

// Types and Interfaces
interface AnalysisMetrics {
  id: string;
  project_name: string;
  created_at: string;
  total_contracts: number;
  source_lines: number;
  assembly_lines: number;
  scan_duration: number;
  optimization_issues: number;
  informational_issues: number;
  low_issues: number;
  medium_issues: number;
  high_issues: number;
  ercs: string;
  markdown_content: string;
}


interface AnalysisVulns {
  vulnerability: string;
  severity: string;
  recommendation: string;
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

// CircularProgress Component
const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 48,
  strokeWidth = 4,
  primaryColor = '#4F46E5',
  secondaryColor = '#E5E7EB'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={secondaryColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={primaryColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
          style={{ strokeLinecap: 'round' }}
        />
      </svg>
    </div>
  );
};

// Utility functions
const calculateSafetyScore = (metrics: AnalysisMetrics): number => {
  if (!metrics) return 0;
  
  const baseScore = 100;
  const deductions = {
    high: 5,
    medium: 2,
    low: 1,
    informational: 0.2,
    optimization: 0.1
  };

  const totalIssues = metrics.high_issues + metrics.medium_issues + 
  metrics.low_issues + metrics.informational_issues + 
  metrics.optimization_issues;

  const totalDeduction = 
    (metrics.high_issues * deductions.high) +
    (metrics.medium_issues * deductions.medium) +
    (metrics.low_issues * deductions.low) +
    (metrics.informational_issues * deductions.informational) +
    (metrics.optimization_issues * deductions.optimization);

  return Math.max(0, Math.min(100, baseScore - totalDeduction - (100*2.5*totalIssues/metrics.source_lines)));
};
const calculateRiskScore = (metrics: AnalysisMetrics): number => {
  if (!metrics) return 0;
  
  const baseScore = 0;
  const addUp = {
    high: 6,
    medium: 3,
    low: 1.5,
    informational: 0.3,
    optimization: 0.2
  };
  const totalIssues = metrics.high_issues + metrics.medium_issues + 
  metrics.low_issues + metrics.informational_issues + 
  metrics.optimization_issues;

  const totalAppUp = 
    (metrics.high_issues * addUp.high) +
    (metrics.medium_issues * addUp.medium) +
    (metrics.low_issues * addUp.low) +
    (metrics.informational_issues * addUp.informational) +
    (metrics.optimization_issues * addUp.optimization);

  return Math.max(0, Math.min(100, baseScore + totalAppUp + (100*2*totalIssues/metrics.source_lines)));
};
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
      }
    }
  }
);

// Main Component
const ContractScanResult: React.FC = () => {
  const params = useParams();
  const [metrics, setMetrics] = useState<AnalysisMetrics | null>(null);
  const [vulns, setVulns] = useState<AnalysisVulns[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawMarkdownContent, setRawMarkdownContent] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
     const sessionId = localStorage.getItem('sessionId');
      try {
        setLoading(true);

        // Fetch metrics
        const [metricsResponse, vulnsResponse] = await Promise.all([
          supabase
            .from('slither_metrics')
            .select('*, markdown_content')
            .order('created_at', { ascending: false })
            .eq('id', params.id)
            .eq('session_id', sessionId)
            .single(),
          
          supabase
            .from('vulnerabilities')
            .select('metrics_id, vulnerability, severity, recommendation')
            .eq('metrics_id', params.id)
            .limit(93)
        ]);
    
        if (metricsResponse.error || !metricsResponse.data) {
          throw new Error('No metrics data found');
        }
    
        setMetrics(metricsResponse.data);
        setVulns(vulnsResponse.data || []);
        setRawMarkdownContent(metricsResponse.data.markdown_content || '');
      } catch {
        setError(`The contract ${params.id} does not exist`);
      } finally {
        setLoading(false);
      }
    };
    

    if (params.id) {
      fetchResults();
    }
  }, [params.id]);



  if (loading) {
    return (
      <div className="min-h-screen bg-white__bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-red border-t-transparent"></div>
      </div>
    );
  }

  if (error || !metrics) {
    const contractId = params?.id?.toString() || '';
    return (
      <div>
        <NoContractFound error={contractId}/>
      </div>
    )
  }

  const safetyScore = calculateSafetyScore(metrics);
  const riskScore = calculateRiskScore(metrics);
  const totalIssues = metrics.high_issues + metrics.medium_issues + 
                     metrics.low_issues + metrics.informational_issues + 
                     metrics.optimization_issues;


                 
  return (
    <section className="bg-white__bg pb-20 w-full  px-16">
      <div className="max-w-screen-2xl mx-auto py-4 sm:py-6 lg:py-8">
        {/* Header section */}
        <div className="mb-12 bg-white rounded-xl p-6 shadow-sm">
          {/* Top section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <img 
                  src="/images/filescan.svg" 
                  alt="solidity file" 
                  className="w-16 h-16"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold ">{metrics.project_name}</h1>
                <p className="text-gray-500">File Scan</p>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Security Score */}
            <div className="flex items-center gap-3">
              <CircularProgress 
                value={safetyScore}
                size={40}
                primaryColor="#4F46E5"
                strokeWidth={4}
              />
              <div>
                <p className="text-gray-500 text-sm">Security Score</p>
                <p className="font-bold text-xl">
                  {safetyScore.toFixed(2)}
                  <span className="text-gray-500 text-base">/100</span>
                </p>
              </div>
            </div>

            {/* Scan Duration */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/scan_duration.svg" alt="scan duration"/>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Scan duration</p>
                <p className="font-bold text-xl">
                  {metrics.scan_duration}
                  <span className="ml-1">secs</span>
                </p>
              </div>
            </div>

            {/* Lines of Code */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/lineofcode.svg" alt="line of code"/>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Lines of code</p>
                <p className="font-bold text-xl">{metrics.source_lines}</p>
              </div>
            </div>

            {/* Issues Count */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/images/bug_icon.svg" alt="issues count"/>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Issues Count</p>
                <p className="font-bold text-xl">{totalIssues}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-[5] lg:w-1/3">
            <ResultBody metrics={metrics} vulns={vulns} riskScore={riskScore} raw_markdown_content={rawMarkdownContent}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContractScanResult;