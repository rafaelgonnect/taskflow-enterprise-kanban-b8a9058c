
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '@/types/database';
import { useCompanies } from '@/hooks/useCompanies';

interface CompanyContextType {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  companies: Company[];
  isLoading: boolean;
  switchCompany: (companyId: string) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { data: companies = [], isLoading } = useCompanies();

  // Auto-selecionar primeira empresa disponível
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany) {
      setSelectedCompany(companies[0]);
      // Salvar no localStorage para persistir entre sessões
      localStorage.setItem('selectedCompanyId', companies[0].id);
    }
  }, [companies, selectedCompany]);

  // Recuperar empresa selecionada do localStorage
  useEffect(() => {
    const savedCompanyId = localStorage.getItem('selectedCompanyId');
    if (savedCompanyId && companies.length > 0) {
      const savedCompany = companies.find(c => c.id === savedCompanyId);
      if (savedCompany) {
        setSelectedCompany(savedCompany);
      }
    }
  }, [companies]);

  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      localStorage.setItem('selectedCompanyId', company.id);
    }
  };

  return (
    <CompanyContext.Provider value={{
      selectedCompany,
      setSelectedCompany,
      companies,
      isLoading,
      switchCompany,
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompanyContext() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompanyContext deve ser usado dentro de um CompanyProvider');
  }
  return context;
}
