
-- Revisar e melhorar políticas de tarefas
DROP POLICY IF EXISTS "Users can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;

-- Política para visualizar tarefas (mais restritiva)
CREATE POLICY "Users can view authorized tasks" 
ON public.tasks 
FOR SELECT 
USING (
  -- Tarefas pessoais atribuídas ao usuário
  (task_type = 'personal' AND assignee_id = auth.uid()) OR
  -- Tarefas criadas pelo usuário
  created_by = auth.uid() OR
  -- Tarefas departamentais públicas onde o usuário é membro ativo do departamento
  (task_type = 'department' AND is_public = true AND 
   department_id IN (
     SELECT dm.department_id FROM public.department_members dm 
     WHERE dm.user_id = auth.uid() AND dm.is_active = true
   )) OR
  -- Tarefas departamentais onde o usuário é gerente do departamento
  (task_type = 'department' AND 
   department_id IN (
     SELECT d.id FROM public.departments d 
     WHERE d.manager_id = auth.uid()
   )) OR
  -- Tarefas empresariais públicas onde o usuário é da empresa
  (task_type = 'company' AND is_public = true AND
   company_id IN (
     SELECT uc.company_id FROM public.user_companies uc 
     WHERE uc.user_id = auth.uid() AND uc.is_active = true
   )) OR
  -- Tarefas empresariais onde o usuário é admin da empresa
  (task_type = 'company' AND 
   EXISTS (
     SELECT 1 FROM public.user_roles ur 
     JOIN public.role_permissions rp ON ur.role_id = rp.role_id
     WHERE ur.user_id = auth.uid() 
     AND ur.company_id = company_id
     AND rp.permission = 'manage_company'
   ))
);

-- Política para criar tarefas (mais específica)
CREATE POLICY "Users can create authorized tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (
  -- Usuário deve ser da empresa
  company_id IN (
    SELECT uc.company_id FROM public.user_companies uc 
    WHERE uc.user_id = auth.uid() AND uc.is_active = true
  ) AND
  created_by = auth.uid() AND
  (
    -- Tarefas pessoais - qualquer usuário pode criar
    task_type = 'personal' OR
    -- Tarefas departamentais - apenas gerentes do departamento
    (task_type = 'department' AND 
     department_id IN (
       SELECT d.id FROM public.departments d 
       WHERE d.manager_id = auth.uid()
     )) OR
    -- Tarefas empresariais - apenas admins
    (task_type = 'company' AND 
     EXISTS (
       SELECT 1 FROM public.user_roles ur 
       JOIN public.role_permissions rp ON ur.role_id = rp.role_id
       WHERE ur.user_id = auth.uid() 
       AND ur.company_id = company_id
       AND rp.permission = 'manage_company'
     ))
  )
);

-- Política para atualizar tarefas
CREATE POLICY "Users can update authorized tasks" 
ON public.tasks 
FOR UPDATE 
USING (
  -- Criador da tarefa sempre pode atualizar
  created_by = auth.uid() OR
  -- Usuário assignado pode atualizar status/progresso
  assignee_id = auth.uid() OR
  -- Gerente do departamento pode atualizar tarefas departamentais
  (task_type = 'department' AND 
   department_id IN (
     SELECT d.id FROM public.departments d 
     WHERE d.manager_id = auth.uid()
   )) OR
  -- Admins podem atualizar tarefas empresariais
  (task_type = 'company' AND 
   EXISTS (
     SELECT 1 FROM public.user_roles ur 
     JOIN public.role_permissions rp ON ur.role_id = rp.role_id
     WHERE ur.user_id = auth.uid() 
     AND ur.company_id = company_id
     AND rp.permission = 'manage_company'
   ))
);

-- Política para deletar tarefas (mais restritiva)
CREATE POLICY "Users can delete authorized tasks" 
ON public.tasks 
FOR DELETE 
USING (
  -- Apenas criador da tarefa pode deletar tarefas pessoais
  (task_type = 'personal' AND created_by = auth.uid()) OR
  -- Gerente do departamento pode deletar tarefas departamentais
  (task_type = 'department' AND 
   department_id IN (
     SELECT d.id FROM public.departments d 
     WHERE d.manager_id = auth.uid()
   )) OR
  -- Admins podem deletar tarefas empresariais
  (task_type = 'company' AND 
   EXISTS (
     SELECT 1 FROM public.user_roles ur 
     JOIN public.role_permissions rp ON ur.role_id = rp.role_id
     WHERE ur.user_id = auth.uid() 
     AND ur.company_id = company_id
     AND rp.permission = 'manage_company'
   ))
);
