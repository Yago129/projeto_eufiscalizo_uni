import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInspections } from '@/contexts/InspectionContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { InspectionFormData } from '@/types/inspection';

const categories = [
  'Infraestrutura',
  'Mobiliário',
  'Climatização', 
  'Iluminação',
  'Limpeza',
  'Segurança',
  'Tecnologia',
  'Acessibilidade',
  'Outros'
];

export function NewInspectionForm() {
  const { user } = useAuth();
  const { createInspection } = useInspections();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Arquivo muito grande',
          description: 'O arquivo deve ter no máximo 5MB',
          variant: 'destructive'
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Apenas imagens e vídeos são permitidos',
          variant: 'destructive'
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const inspectionData: InspectionFormData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        location: formData.get('location') as string,
        imageFile: selectedFile || undefined
      };

      createInspection(inspectionData, user.id, user.name);
      
      toast({
        title: 'Fiscalização enviada!',
        description: 'Sua fiscalização foi registrada com sucesso.'
      });

      // Reset form
      e.currentTarget.reset();
      removeFile();
      
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao enviar a fiscalização',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título da Fiscalização *</Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="Ex: Goteira na sala de aula"
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Select name="category" required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local *</Label>
        <Input 
          id="location" 
          name="location" 
          placeholder="Ex: Bloco A - Sala 205"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição do Problema *</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="Descreva detalhadamente o problema encontrado..."
          className="min-h-[100px]"
          required 
        />
      </div>

      <div className="space-y-2">
        <Label>Evidência (Foto ou Vídeo)</Label>
        
        {!selectedFile ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                Clique para selecionar ou arraste um arquivo
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, MP4, MOV (máx. 5MB)
              </p>
            </label>
          </div>
        ) : (
          <div className="relative">
            {selectedFile.type.startsWith('image/') ? (
              <div className="relative rounded-lg overflow-hidden">
                <img 
                  src={previewUrl!} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Enviando...' : 'Enviar Fiscalização'}
        </Button>
      </div>
    </form>
  );
}