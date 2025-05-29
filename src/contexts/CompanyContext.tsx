
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Company } from '@/types/database';
import { useCompanies } from '@/hooks/useCompanies';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  const { data: companies = [], isLoading } = useCompanies();

  // Auto-selecionar primeira empresa disponível
  useEffect(() => {
    if (companies.length > 0 && !selectedCompany && user) {
      const savedCompanyId = localStorage.getItem('selectedCompanyId');
      
      let companyToSelect = companies[0];
      if (savedCompanyId) {
        const savedCompany = companies.find(c => c.id === savedCompanyId);
        if (savedCompany) {
          companyToSelect = savedCompany;
        }
      }
      
      setSelectedCompany(companyToSelect);
      localStorage.setItem('selectedCompanyId', companyToSelect.id);
      console.log('Empresa selecionada automaticamente:', companyToSelect.name);
    }
  }, [companies, selectedCompany, user]);

  const switchCompany = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setSelectedCompany(company);
      localStorage.setItem('selectedCompanyId', company.id);
      console.log('Trocando para empresa:', company.name);
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
