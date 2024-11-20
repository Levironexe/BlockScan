'use client'
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Search, FilePlus} from 'lucide-react';
import {UploadForm} from '@/components/index'
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

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
  security_score?: number;
}

const calculateSafetyScore = (metrics: AnalysisMetrics): number => {
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

  return Number((Math.max(0, Math.min(100, baseScore - totalDeduction - (100*2.5*totalIssues/metrics.source_lines)))).toFixed(2));
};

const AllProjects = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<AnalysisMetrics[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<AnalysisMetrics[]>([]);
  const [isHover, setIsHover] = useState(false);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
        }
      }
    }
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const sessionId = localStorage.getItem('sessionId');
        
        if (!sessionId) {
          setError('No session ID found. Please log in again.');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('slither_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .eq('session_id', sessionId);

        if (fetchError) throw fetchError;

        if (data) {
          const projectsWithScores = data.map(project => ({
            ...project,
            security_score: calculateSafetyScore(project)
          }));
          setProjects(projectsWithScores);
          setFilteredProjects(projectsWithScores);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project =>
      project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white__bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-red border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white__bg flex items-center justify-center">
        <div className="text-primary-red font-bold text-xl text-center">
          {error}
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-8 w-full pt-24 px-16">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="items-center flex gap-2 text-2xl font-bold bg-gradient-to-r from-primary-red to-pink-600 text-transparent bg-clip-text">PROJECTS</h1>
          
          {/* Search and Filter Section */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Project name"
                className={`pl-10 pr-4 py-2 border rounded-xl w-[300px] placeholder-gray-400 focus:ring-0 focus:outline-2 transition-colors
                duration-200 ${isHover ? 'border-black':'border-gray-300'}`}
                value={searchTerm}
                onFocus={() => setIsHover(true)}
                onBlur={() => setIsHover(false)}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className={`absolute left-3 top-2.5 h-5 w-5  duration-100 transition-colors  ${isHover ? 'text-black': 'text-gray-400'}`} />
            </div>

            <UploadForm style='py-2 px-3 justify-center text-white/80 rounded-xl text-base sm:text-[14px] xl:text-[18px] font-normal w-full sm:w-auto hover:bg-white hover:text-white
                        bg-gradient-to-r from-primary-red to-pink-600
                        hover:bg-gradient-to-r  hover:from-primary-red hover:to-primary-red transition-all duration-300'
                        title={
                            <>
                              <FilePlus size={20} />
                              <span>New project</span>
                            </>}
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {filteredProjects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id} className="block h-full">
              <CardContainer className="h-full w-full">
                <CardBody className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl hover:border-2 hover:border-black transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <CardItem translateZ="90">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">{project.project_name}</h2>
                      <p className="text-sm text-gray-500">
                        Last scanned {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </CardItem>
                    <CardItem translateZ="90" className='text-right'>
                      <p className="text-right text-[20px] font-bold">{project.security_score}</p>
                      <p className="text-sm text-gray-500">Security score</p>
                    </CardItem>
                  </div>

                  {/* Metrics */}
                  <CardItem translateZ="120" className="grid grid-cols-5 gap-2 text-center text-sm mt-8 bg-black/20 rounded-xl py-2">
                    <div className="transform-style-3d">
                      <div className="font-medium">{project.high_issues}</div>
                      <div className="text-gray-500">High</div>
                      <div className="border-b-[4px] rounded-full w-1/2 mx-auto mt-2 border-red-600"></div>
                    </div>
                    <div className="transform-style-3d">
                      <div className="font-medium">{project.medium_issues}</div>
                      <div className="text-gray-500">Med</div>
                      <div className="border-b-[4px] rounded-full w-1/2 mx-auto mt-2 border-yellow-400"></div>
                    </div>
                    <div className="transform-style-3d">
                      <div className="font-medium">{project.low_issues}</div>
                      <div className="text-gray-500">Low</div>
                      <div className="border-b-[4px] rounded-full w-1/2 mx-auto mt-2 border-green-500"></div>
                    </div>
                    <div className="transform-style-3d">
                      <div className="font-medium">{project.informational_issues}</div>
                      <div className="text-gray-500">Info</div>
                      <div className="border-b-[4px] rounded-full w-1/2 mx-auto mt-2 border-gray-500"></div>
                    </div>
                    <div className="transform-style-3d">
                      <div className="font-medium">{project.optimization_issues}</div>
                      <div className="text-gray-500">Opti</div>
                      <div className="border-b-[4px] rounded-full w-1/2 mx-auto mt-2 border-blue-500"></div>
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            </Link>
          ))}
        </div>

        {filteredProjects.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProjects;