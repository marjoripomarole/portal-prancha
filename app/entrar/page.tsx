import Link from 'next/link';
export default function LoginError() {
  return <main className="shell"><section className="paper exercise"><p className="eyebrow">PORTAL PRANCHA</p><h1>Login não concluído</h1><p>Não foi possível concluir o login com Google. Volte ao início e escolha uma conta Google com e-mail verificado.</p><Link className="lightbutton" href="/">Voltar ao início</Link></section></main>;
}
