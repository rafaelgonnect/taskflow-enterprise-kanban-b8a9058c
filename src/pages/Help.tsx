import { Layout } from '@/components/Layout';

export default function Help() {
  return (
    <Layout>
      <div className="prose max-w-none space-y-4">
        <h1>Ajuda e Introdução</h1>
        <p>Bem-vindo ao TaskFlow! Siga estes passos para começar:</p>
        <ol className="list-decimal list-inside">
          <li>Crie sua empresa no primeiro acesso.</li>
          <li>Adicione departamentos e usuários.</li>
          <li>Crie tarefas pessoais, departamentais ou empresariais.</li>
          <li>Use as abas para alternar entre as categorias de tarefas.</li>
        </ol>
        <p>Se precisar de suporte adicional, contate o administrador do sistema.</p>
      </div>
    </Layout>
  );
}
