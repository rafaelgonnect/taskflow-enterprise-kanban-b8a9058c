
-- Corrigir políticas RLS para department_members
DROP POLICY IF EXISTS "Users can view department members of their company" ON public.department_members;
DROP POLICY IF EXISTS "Department managers can manage members" ON public.department_members;

-- Política para visualizar membros do departamento
CREATE POLICY "Users can view department members" 
ON public.department_members 
FOR SELECT 
USING (
  -- Usuários podem ver membros de departamentos de suas empresas
  EXISTS (
    SELECT 1 FROM public.departments d
    JOIN public.user_companies uc ON d.company_id = uc.company_id
    WHERE d.id = department_members.department_id 
    AND uc.user_id = auth.uid() 
    AND uc.is_active = true
  )
);

-- Política para adicionar membros (gerentes e admins)
CREATE POLICY "Managers and admins can add department members" 
ON public.department_members 
FOR INSERT 
WITH CHECK (
  -- Gerente do departamento pode adicionar
  EXISTS (
    SELECT 1 FROM public.departments d
    WHERE d.id = department_members.department_id 
    AND d.manager_id = auth.uid()
  ) OR
  -- Admin da empresa pode adicionar
  EXISTS (
    SELECT 1 FROM public.departments d
    JOIN public.user_roles ur ON d.company_id = ur.company_id
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE d.id = department_members.department_id
    AND ur.user_id = auth.uid()
    AND rp.permission = 'manage_company'
  )
);

-- Política para atualizar membros (remover/desativar)
CREATE POLICY "Managers and admins can update department members" 
ON public.department_members 
FOR UPDATE 
USING (
  -- Gerente do departamento pode atualizar
  EXISTS (
    SELECT 1 FROM public.departments d
    WHERE d.id = department_members.department_id 
    AND d.manager_id = auth.uid()
  ) OR
  -- Admin da empresa pode atualizar
  EXISTS (
    SELECT 1 FROM public.departments d
    JOIN public.user_roles ur ON d.company_id = ur.company_id
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE d.id = department_members.department_id
    AND ur.user_id = auth.uid()
    AND rp.permission = 'manage_company'
  )
);

-- Política para deletar membros (gerentes e admins)
CREATE POLICY "Managers and admins can delete department members" 
ON public.department_members 
FOR DELETE 
USING (
  -- Gerente do departamento pode deletar
  EXISTS (
    SELECT 1 FROM public.departments d
    WHERE d.id = department_members.department_id 
    AND d.manager_id = auth.uid()
  ) OR
  -- Admin da empresa pode deletar
  EXISTS (
    SELECT 1 FROM public.departments d
    JOIN public.user_roles ur ON d.company_id = ur.company_id
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    WHERE d.id = department_members.department_id
    AND ur.user_id = auth.uid()
    AND rp.permission = 'manage_company'
  )
);

-- Garantir que o usuário que está sendo adicionado faça parte da empresa
ALTER TABLE public.department_members 
DROP CONSTRAINT IF EXISTS department_members_user_company_check;

ALTER TABLE public.department_members 
ADD CONSTRAINT department_members_user_company_check 
CHECK (
  EXISTS (
    SELECT 1 FROM public.departments d
    JOIN public.user_companies uc ON d.company_id = uc.company_id
    WHERE d.id = department_id 
    AND uc.user_id = user_id 
    AND uc.is_active = true
  )
);
