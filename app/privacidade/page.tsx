import Link from 'next/link';

export const metadata = {title: 'Privacidade | Portal Prancha'};

export default function Privacy() {
  return <main className="shell"><section className="paper exercise">
    <p className="eyebrow">PORTAL PRANCHA · ATUALIZADO EM 21/09/2026</p>
    <h1>Seus dados de estudo</h1>
    <p>O Portal Prancha é uma iniciativa estudantil para organizar os estudos da turma de Medicina 2026.2. Esta página explica como a plataforma utiliza seus dados.</p>
    <h2>Login com Google</h2>
    <p>Ao entrar, o Google fornece seu identificador de conta, nome, e-mail verificado e imagem de perfil. Esses dados identificam sua sessão. O Portal não recebe sua senha Google e não solicita acesso a mensagens do Gmail, arquivos do Drive, contatos ou calendário.</p>
    <h2>O que fica salvo</h2>
    <p>Guardamos sua turma, grupo A/B e semestre letivo, além de leituras marcadas, respostas escritas, resultados de questões, uso declarado de ajuda, autoavaliações, datas das atividades e histórico das pranchas. Esses registros permitem retomar os estudos e consultar o próprio progresso. O identificador Google vincula os registros à sua conta; entrar em um novo semestre não apaga seu histórico.</p>
    <h2>Quem tem acesso</h2>
    <p>Cada aluno acessa o próprio histórico. O convite libera os materiais da turma e não libera respostas de colegas. A responsável pela plataforma pode administrar a base de dados para manter o serviço e atender solicitações dos usuários.</p>
    <p>Usamos Google para autenticação, Vercel para hospedagem e Neon para o banco de dados. Esses serviços processam os dados necessários ao funcionamento da plataforma e podem registrar informações técnicas de conexão conforme suas próprias políticas. O Portal não vende o histórico de estudo nem utiliza respostas para publicidade.</p>
    <h2>Sessão e preferências</h2>
    <p>Cookies de autenticação mantêm sua sessão por até sete dias. Você pode encerrar a sessão pelo botão “Sair da conta”. O histórico integrado é salvo no servidor; registros existentes em outros sites de estudo não são importados automaticamente.</p>
    <h2>Exportação, correção e exclusão</h2>
    <p>Na área “Meu progresso”, você pode exportar seu histórico. Para solicitar correção ou exclusão dos dados da conta, entre em contato com a responsável, Marjori Pomarole, pelo e-mail <a href="mailto:marjoripomarole@gmail.com">marjoripomarole@gmail.com</a>. Os registros ficam armazenados para permitir a continuidade dos estudos enquanto sua conta estiver ativa, salvo solicitação de exclusão.</p>
    <p>Evite inserir nas respostas informações pessoais de pacientes ou de terceiros. As atividades destinam-se ao estudo e não integram prontuários ou registros oficiais da faculdade.</p>
    <p><Link className="lightbutton" href="/">Voltar ao Portal</Link></p>
  </section></main>;
}
