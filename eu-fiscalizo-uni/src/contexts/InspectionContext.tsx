import React, { createContext, useContext, useState } from 'react';
import { Inspection, InspectionFormData, InspectionStatus } from '@/types/inspection';

interface InspectionContextType {
  inspections: Inspection[];
  createInspection: (data: InspectionFormData, studentId: string, studentName: string) => void;
  updateInspectionStatus: (id: string, status: InspectionStatus, adminResponse?: string) => void;
  addFeedback: (id: string, rating: number, comment: string) => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

// Mock data
const mockInspections: Inspection[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'João Silva',
    title: 'Goteira na sala de aula',
    description: 'Goteira no teto da sala 205, pingando água constantemente durante as aulas',
    category: 'Infraestrutura',
    location: 'Bloco A - Sala 205',
    status: 'em_processo',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-16'),
    adminResponse: 'Equipe de manutenção foi acionada. Previsão de reparo: 3 dias úteis.'
  },
  {
    id: '2',
    studentId: '1',
    studentName: 'João Silva',
    title: 'Cadeiras quebradas',
    description: 'Várias cadeiras com problemas estruturais na sala 102',
    category: 'Mobiliário',
    location: 'Bloco B - Sala 102',
    status: 'concluida',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-14'),
    adminResponse: 'Cadeiras foram substituídas por novas.',
    feedback: {
      rating: 5,
      comment: 'Problema resolvido rapidamente, muito obrigado!',
      createdAt: new Date('2024-01-14')
    }
  },
  {
    id: '3',
    studentId: '1',
    studentName: 'João Silva',
    title: 'Ventilador sem funcionar',
    description: 'Ventilador da sala 301 não está funcionando, sala muito quente',
    category: 'Climatização',
    location: 'Bloco C - Sala 301',
    status: 'recebida',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
  }
];

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [inspections, setInspections] = useState<Inspection[]>(mockInspections);

  const createInspection = (data: InspectionFormData, studentId: string, studentName: string) => {
    const newInspection: Inspection = {
      id: Date.now().toString(),
      studentId,
      studentName,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      status: 'recebida',
      createdAt: new Date(),
      updatedAt: new Date(),
      imageUrl: data.imageFile ? URL.createObjectURL(data.imageFile) : undefined
    };

    setInspections(prev => [newInspection, ...prev]);
  };

  const updateInspectionStatus = (id: string, status: InspectionStatus, adminResponse?: string) => {
    setInspections(prev => 
      prev.map(inspection => 
        inspection.id === id 
          ? { 
              ...inspection, 
              status, 
              updatedAt: new Date(), 
              adminResponse: adminResponse || inspection.adminResponse 
            }
          : inspection
      )
    );
  };

  const addFeedback = (id: string, rating: number, comment: string) => {
    setInspections(prev => 
      prev.map(inspection => 
        inspection.id === id 
          ? { 
              ...inspection, 
              feedback: { rating, comment, createdAt: new Date() }
            }
          : inspection
      )
    );
  };

  return (
    <InspectionContext.Provider value={{ 
      inspections, 
      createInspection, 
      updateInspectionStatus, 
      addFeedback 
    }}>
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspections() {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspections must be used within an InspectionProvider');
  }
  return context;
}