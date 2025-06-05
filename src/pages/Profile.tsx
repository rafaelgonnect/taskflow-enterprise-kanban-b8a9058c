
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Crown, User, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileFormData {
  full_name: string;
  experience: string;
}

export default function Profile() {
  const { profile, updateProfile } = useAuth();
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [languages, setLanguages] = useState<string[]>(profile?.languages || []);
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      full_name: profile?.full_name || '',
      experience: profile?.experience || '',
    }
  });

  // Função para obter o ícone e cor do tipo de usuário
  const getUserTypeConfig = (userType: string) => {
    switch (userType) {
      case 'admin':
        return {
          label: 'Administrador',
          icon: Crown,
          variant: 'default' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
      case 'manager':
        return {
          label: 'Gerente',
          icon: Settings,
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-300'
        };
      case 'employee':
      default:
        return {
          label: 'Funcionário',
          icon: User,
          variant: 'outline' as const,
          className: 'bg-green-100 text-green-800 border-green-300'
        };
    }
  };

  const userTypeConfig = getUserTypeConfig(profile?.user_type || 'employee');
  const IconComponent = userTypeConfig.icon;

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    setLanguages(languages.filter(language => language !== languageToRemove));
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      await updateProfile({
        full_name: data.full_name,
        experience: data.experience,
        skills,
        languages,
      });
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <Badge className={userTypeConfig.className}>
              <IconComponent className="w-3 h-3 mr-1" />
              {userTypeConfig.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e profissionais
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome Completo
                </label>
                <Input
                  {...register('full_name', { required: 'Nome é obrigatório' })}
                  placeholder="Seu nome completo"
                />
                {errors.full_name && (
                  <p className="text-sm text-red-600 mt-1">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <Input
                  value={profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  O email não pode ser alterado
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tipo de Usuário
                </label>
                <Badge className={userTypeConfig.className}>
                  <IconComponent className="w-3 h-3 mr-1" />
                  {userTypeConfig.label}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  O tipo de usuário é definido pela administração da empresa
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Habilidades</CardTitle>
              <CardDescription>
                Adicione suas principais habilidades técnicas e profissionais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Nova habilidade"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => removeSkill(skill)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Idiomas</CardTitle>
              <CardDescription>
                Informe os idiomas que você domina
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Novo idioma"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                />
                <Button type="button" onClick={addLanguage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {languages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {language}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => removeLanguage(language)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Experiência Profissional</CardTitle>
              <CardDescription>
                Descreva sua experiência e background profissional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                {...register('experience')}
                placeholder="Descreva sua experiência profissional, formação acadêmica e principais conquistas..."
                rows={6}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Perfil'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
