import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Printer, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
  Building2,
  Plane,
  Globe,
  Server,
  Sparkles,
  Cookie,
  CreditCard,
  UserCheck
} from 'lucide-react';

export type LegalTab = 'privacidade' | 'beneficios' | 'termos';

interface LegalPageProps {
  initialTab?: LegalTab;
  onBackToHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ 
  initialTab = 'privacidade', 
  onBackToHome 
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const privacySections = [
    {
      id: 'sec-1',
      number: '01',
      title: 'Quem somos',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            A <strong className="text-white">N C TURISMO LTDA.</strong>, inscrita no CNPJ nº <strong className="text-white">81.102.709/0001-08</strong>, com endereço na Rua Dr. Faivre, 75, Loja 2, Centro, Curitiba/PR, CEP 80060-140, é responsável pelos serviços prestados sob a marca <strong className="text-nc-orange font-semibold">NC Turismo</strong>.
          </p>
          <p className="leading-relaxed">
            Esta Política se aplica aos ambientes digitais e canais operados pela NC Turismo, incluindo o site <code className="text-nc-orange bg-white/5 px-2 py-0.5 rounded text-xs">www.ncturismo.com.br</code>, o ambiente <code className="text-nc-orange bg-white/5 px-2 py-0.5 rounded text-xs">beneficios.ncturismo.com.br</code>, além de outros canais digitais utilizados para atendimento e contratação de serviços.
          </p>
        </div>
      )
    },
    {
      id: 'sec-2',
      number: '02',
      title: 'Quais dados podemos tratar',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Dependendo do serviço solicitado, podemos tratar dados como:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-nc-warm/90">
            {[
              'Nome completo;',
              'CPF e documentos de identificação;',
              'Data de nascimento;',
              'Telefone e e-mail;',
              'Endereço;',
              'Dados necessários à reserva e emissão de serviços de viagem;',
              'Dados de acompanhantes ou passageiros informados pelo responsável pela compra;',
              'Informações de pagamento necessárias à transação;',
              'Histórico de solicitações, reservas, compras e atendimentos;',
              'Informações técnicas de acesso, como endereço IP, dispositivo, navegador e registros de utilização;',
              'Preferências e informações fornecidas voluntariamente durante o atendimento.'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-nc-surface/40 p-2.5 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-nc-orange mt-2 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-nc-warm/70 italic pt-2">
            Determinados serviços de viagem podem exigir informações adicionais solicitadas por companhias aéreas, hotéis, seguradoras, locadoras, autoridades ou outros fornecedores. A NC Turismo procura limitar o tratamento aos dados efetivamente necessários para cada finalidade.
          </p>
        </div>
      )
    },
    {
      id: 'sec-3',
      number: '03',
      title: 'Como os dados são coletados',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Os dados podem ser fornecidos diretamente pelo usuário:
          </p>
          <div className="space-y-2">
            {[
              'Durante cadastro ou compra online;',
              'Durante solicitações de cotação ou reserva;',
              'Por telefone, WhatsApp, e-mail ou outros canais de atendimento;',
              'Durante atendimento presencial;',
              'Por meio de empresas, associações, federações, cooperativas ou outras organizações parceiras, quando aplicável e permitido pela legislação.'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-nc-surface border border-white/5 rounded-xl text-sm">
                <CheckCircle2 size={16} className="text-nc-orange shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="leading-relaxed text-sm text-nc-warm/70">
            Também podem ser geradas automaticamente determinadas informações técnicas durante a utilização de nossos ambientes digitais.
          </p>
        </div>
      )
    },
    {
      id: 'sec-4',
      number: '04',
      title: 'Para que utilizamos os dados',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">Podemos utilizar os dados pessoais para:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              'Pesquisar, reservar, emitir e administrar serviços de viagem;',
              'Processar pagamentos;',
              'Enviar confirmações, bilhetes, vouchers e informações relacionadas à viagem;',
              'Realizar alterações, cancelamentos, reembolsos e atendimento pós-venda;',
              'Prestar suporte antes, durante e depois da viagem;',
              'Prevenir fraudes e proteger a segurança das operações;',
              'Cumprir obrigações legais, regulatórias, fiscais e administrativas;',
              'Exercer ou defender direitos da NC Turismo;',
              'Aprimorar nossos serviços, atendimento e ambientes digitais;',
              'Manter contato com o usuário sobre solicitações ou serviços contratados;',
              'Enviar comunicações comerciais quando houver base legal adequada, respeitando as opções do usuário.'
            ].map((text, idx) => (
              <div key={idx} className="bg-nc-surface/60 border border-white/5 p-3 rounded-xl flex items-start gap-2.5">
                <span className="text-nc-orange font-bold text-xs mt-0.5">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
          <div className="p-4 bg-nc-orange/10 border border-nc-orange/20 rounded-xl text-xs md:text-sm text-nc-warm/90 leading-relaxed">
            <strong className="text-white block mb-1">Bases Legais de Tratamento:</strong>
            O tratamento poderá ocorrer, conforme o caso, para execução de contrato ou procedimentos relacionados à contratação, cumprimento de obrigações legais ou regulatórias, exercício regular de direitos, legítimo interesse ou consentimento, quando este for necessário.
          </div>
        </div>
      )
    },
    {
      id: 'sec-5',
      number: '05',
      title: 'Dados de crianças e adolescentes',
      content: (
        <div className="space-y-3">
          <p className="leading-relaxed">
            Serviços de viagem podem envolver passageiros menores de idade.
          </p>
          <p className="leading-relaxed">
            Quando necessário para realizar uma reserva ou prestar o serviço solicitado, dados de crianças e adolescentes poderão ser tratados observando seu <strong className="text-white">melhor interesse</strong> e a legislação aplicável.
          </p>
          <div className="p-3.5 bg-nc-surface border border-white/10 rounded-xl text-sm text-nc-warm/80">
            Quando exigido, as informações deverão ser fornecidas ou autorizadas pelos pais ou responsáveis legais.
          </div>
        </div>
      )
    },
    {
      id: 'sec-6',
      number: '06',
      title: 'Com quem podemos compartilhar dados',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Para executar os serviços contratados, poderá ser necessário compartilhar dados pessoais com terceiros envolvidos na viagem ou na operação, tais como:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs md:text-sm">
            {[
              'Companhias aéreas',
              'Hotéis e meios de hospedagem',
              'Locadoras de veículos',
              'Empresas rodoviárias',
              'Seguradoras e assistência',
              'Operadores e consolidadoras',
              'Transfers e receptivo',
              'Processadores de pagamento',
              'Fornecedores de tecnologia',
              'Autoridades públicas'
            ].map((partner, idx) => (
              <div key={idx} className="bg-nc-surface p-3 rounded-lg border border-white/5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nc-orange"></span>
                <span className="text-white font-medium">{partner}</span>
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-nc-warm/70 leading-relaxed">
            O compartilhamento é realizado de acordo com a finalidade do serviço e limitado às informações necessárias para sua execução. Alguns fornecedores poderão atuar como controladores independentes de dados pessoais e possuir suas próprias políticas de privacidade.
          </p>
        </div>
      )
    },
    {
      id: 'sec-7',
      number: '07',
      title: 'Benefícios e Parcerias',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            A NC Turismo poderá disponibilizar ambientes ou condições de viagem vinculados a empresas, associações, federações, cooperativas e outras organizações parceiras.
          </p>
          <p>
            Nesses casos, a organização parceira poderá disponibilizar aos seus colaboradores, associados, cooperados, membros ou outros públicos o acesso ao ambiente da NC Turismo.
          </p>
          <p>
            A contratação dos serviços de viagem será realizada pelo próprio usuário, salvo quando expressamente informado de forma diferente.
          </p>
          <p className="p-4 bg-nc-surface border border-white/5 rounded-xl text-sm">
            Eventuais informações compartilhadas com a organização parceira observarão a finalidade da parceria e a legislação de proteção de dados. Sempre que possível, relatórios gerenciais serão apresentados de forma agregada, sem exposição desnecessária de dados pessoais individualizados.
          </p>
        </div>
      )
    },
    {
      id: 'sec-8',
      number: '08',
      title: 'Transferência internacional de dados',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Alguns serviços turísticos envolvem fornecedores, sistemas ou operações localizados fora do Brasil.
          </p>
          <p>
            Quando necessário para executar uma viagem internacional ou utilizar fornecedores tecnológicos globais, dados pessoais poderão ser tratados ou transferidos internacionalmente, observadas as exigências previstas na legislação aplicável (LGPD).
          </p>
        </div>
      )
    },
    {
      id: 'sec-9',
      number: '09',
      title: 'Por quanto tempo mantemos os dados',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Os dados pessoais serão armazenados somente pelo período necessário ao cumprimento das finalidades para as quais foram coletados.
          </p>
          <p>Algumas informações poderão permanecer armazenadas por períodos adicionais quando necessárias para:</p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-nc-warm/80 pl-2">
            <li>Cumprimento de obrigações legais ou regulatórias;</li>
            <li>Obrigações fiscais e contábeis;</li>
            <li>Prevenção a fraudes;</li>
            <li>Exercício regular de direitos;</li>
            <li>Atendimento a determinações de autoridades competentes.</li>
          </ul>
          <p className="text-sm text-nc-warm/70 pt-1">
            Encerradas as finalidades e inexistindo necessidade legal de conservação, os dados poderão ser eliminados ou anonimizados.
          </p>
        </div>
      )
    },
    {
      id: 'sec-10',
      number: '10',
      title: 'Segurança das informações',
      content: (
        <div className="space-y-3 leading-relaxed">
          <div className="flex items-start gap-4 p-4 bg-nc-surface border border-white/5 rounded-2xl">
            <Lock className="text-nc-orange shrink-0 mt-1" size={24} />
            <div>
              <p className="text-white font-medium mb-1">Medidas Técnicas e Administrativas</p>
              <p className="text-sm text-nc-warm/80">
                A NC Turismo adota medidas técnicas e administrativas destinadas à proteção dos dados pessoais contra acesso não autorizado, perda, alteração, divulgação ou tratamento inadequado.
              </p>
            </div>
          </div>
          <p className="text-sm text-nc-warm/80">
            Também buscamos trabalhar com fornecedores tecnológicos que adotem práticas compatíveis com a segurança necessária aos serviços prestados.
          </p>
          <p className="text-xs text-nc-warm/60">
            Nenhum ambiente tecnológico é totalmente imune a riscos. Caso ocorra incidente de segurança com potencial de causar risco ou dano relevante aos titulares, serão adotadas as providências previstas na legislação aplicável.
          </p>
        </div>
      )
    },
    {
      id: 'sec-11',
      number: '11',
      title: 'Direitos do titular',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Nos termos da legislação de proteção de dados (LGPD - Lei nº 13.709/2018), o titular poderá solicitar, quando aplicável:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              'Confirmação da existência de tratamento;',
              'Acesso aos seus dados pessoais;',
              'Correção de dados incompletos, inexatos ou desatualizados;',
              'Informações sobre compartilhamento;',
              'Anonimização, bloqueio ou eliminação de dados tratados em desconformidade com a legislação;',
              'Portabilidade, quando aplicável e regulamentada;',
              'Eliminação dos dados tratados com base em consentimento, observadas as hipóteses legais de conservação;',
              'Informações sobre a possibilidade de não fornecer consentimento e suas consequências;',
              'Revogação do consentimento;',
              'Oposição ao tratamento, nas hipóteses previstas em lei.'
            ].map((right, idx) => (
              <div key={idx} className="p-3 bg-nc-surface/50 border border-white/5 rounded-xl flex items-center gap-2.5">
                <span className="text-nc-orange font-bold text-xs">{idx + 1}.</span>
                <span>{right}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-nc-warm/70 italic">
            As solicitações deverão permitir a identificação segura do titular ou de seu representante legal através dos nossos canais oficiais.
          </p>
        </div>
      )
    },
    {
      id: 'sec-12',
      number: '12',
      title: 'Cookies e tecnologias semelhantes',
      content: (
        <div className="space-y-3 leading-relaxed text-sm md:text-base">
          <p>
            Os ambientes digitais da NC Turismo poderão utilizar cookies, pixels, tags e tecnologias semelhantes para permitir seu funcionamento, manter sessões, proteger transações, compreender a utilização das páginas, melhorar a experiência dos usuários e, quando aplicável, apoiar ações de publicidade e mensuração de campanhas.
          </p>
          <div className="p-4 bg-nc-surface border border-white/5 rounded-xl space-y-2 text-sm">
            <strong className="text-white block">Ferramentas de Terceiros e Anúncios:</strong>
            <p className="text-nc-warm/80">
              Mediante as escolhas disponibilizadas ao usuário e quando exigido pela legislação aplicável, poderão ser utilizadas tecnologias de terceiros para análise, publicidade, mensuração e personalização de campanhas, incluindo serviços relacionados ao Google Ads e às plataformas de publicidade da Meta, como Meta Ads.
            </p>
            <p className="text-nc-warm/80">
              Essas tecnologias poderão coletar ou receber informações sobre a interação do usuário com os ambientes digitais da NC Turismo, como páginas acessadas, eventos de navegação, informações técnicas do dispositivo, navegador, endereço IP e identificadores associados a cookies.
            </p>
          </div>
          <p className="text-xs text-nc-warm/70">
            Cookies estritamente necessários poderão ser utilizados para viabilizar funcionalidades essenciais. Cookies e tecnologias não essenciais estarão sujeitos às opções disponibilizadas ao usuário em seu navegador e ambiente de preferências.
          </p>
        </div>
      )
    },
    {
      id: 'sec-13',
      number: '13',
      title: 'Comunicações e ofertas',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            A NC Turismo poderá enviar informações relacionadas aos serviços contratados independentemente de comunicações promocionais (como confirmações de voo, bilhetes e avisos de embarque).
          </p>
          <p>
            O envio de promoções, novidades e outras comunicações comerciais observará a legislação aplicável e os mecanismos disponibilizados para cancelamento (opt-out) ou alteração das preferências do usuário a qualquer momento.
          </p>
          <p className="text-sm text-nc-warm/70">
            Quando utilizadas ferramentas de publicidade digital, a NC Turismo poderá realizar ações de mensuração, remarketing ou criação de públicos, observadas as configurações adotadas, as escolhas de privacidade do usuário e a legislação aplicável.
          </p>
        </div>
      )
    },
    {
      id: 'sec-14',
      number: '14',
      title: 'Sites e serviços de terceiros',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Durante uma pesquisa ou contratação, o usuário poderá acessar conteúdos, sistemas ou serviços de terceiros (como portais de companhias aéreas, sistemas de hotéis ou gateways de pagamento).
          </p>
          <p className="text-sm text-nc-warm/70">
            Esses ambientes poderão possuir suas próprias regras de privacidade e segurança, pelas quais os respectivos responsáveis responderão de acordo com sua atuação independente.
          </p>
        </div>
      )
    },
    {
      id: 'sec-15',
      number: '15',
      title: 'Atualizações desta Política',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Esta Política poderá ser atualizada para refletir alterações legais, regulatórias, tecnológicas ou operacionais.
          </p>
          <p>
            A versão vigente estará sempre disponível nos ambientes oficiais da NC Turismo, acompanhada da respectiva data de atualização.
          </p>
          <div className="p-3 bg-white/5 rounded-lg text-xs text-nc-orange font-mono">
            Versão 1.1 — Atualizada e em vigor desde 21 de setembro de 2026.
          </div>
        </div>
      )
    },
    {
      id: 'sec-16',
      number: '16',
      title: 'Como falar conosco sobre seus dados',
      content: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Solicitações relacionadas à privacidade e proteção de dados pessoais podem ser encaminhadas diretamente para os canais oficiais da NC Turismo:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-nc-surface border border-white/10 p-5 rounded-2xl">
              <MapPin className="text-nc-orange mb-3" size={22} />
              <p className="text-xs uppercase text-nc-warm/50 font-bold tracking-wider mb-1">Endereço Físico</p>
              <p className="text-white font-medium text-sm leading-snug">
                Rua Dr. Faivre, 75<br />
                Loja 2 — Centro<br />
                Curitiba/PR — CEP 80060-140
              </p>
            </div>

            <div className="bg-nc-surface border border-white/10 p-5 rounded-2xl">
              <Phone className="text-nc-orange mb-3" size={22} />
              <p className="text-xs uppercase text-nc-warm/50 font-bold tracking-wider mb-1">Telefone</p>
              <p className="text-white font-medium text-lg mb-1">
                (41) 3281-1167
              </p>
              <p className="text-xs text-nc-warm/60">Horário comercial</p>
            </div>

            <div className="bg-nc-surface border border-white/10 p-5 rounded-2xl">
              <Mail className="text-nc-orange mb-3" size={22} />
              <p className="text-xs uppercase text-nc-warm/50 font-bold tracking-wider mb-1">Canal de Privacidade</p>
              <a 
                href="mailto:atendimento@ncturismo.com.br" 
                className="text-nc-orange hover:underline font-medium text-sm block mb-1 break-all"
              >
                atendimento@ncturismo.com.br
              </a>
              <p className="text-xs text-nc-warm/60">Direcionar para Encarregado de Dados (DPO)</p>
            </div>
          </div>

          <p className="text-xs text-nc-warm/60 leading-relaxed">
            A identificação e o contato do encarregado pelo tratamento de dados pessoais (DPO), quando aplicável, serão disponibilizados pela NC Turismo nos termos da legislação vigente.
          </p>
        </div>
      )
    }
  ];

  const termsSections = [
    {
      id: 'terms-1',
      number: '01',
      title: 'Objeto e Âmbito de Aplicação',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Estes Termos e Condições de Uso regulam o acesso e a utilização dos websites, plataformas digitais, portais corporativos e canais de atendimento disponibilizados pela <strong className="text-white">N C TURISMO LTDA.</strong>, inscrita no CNPJ nº <strong className="text-white">81.102.709/0001-08</strong>, com sede na Rua Dr. Faivre, 75, Loja 2, Centro, Curitiba/PR.
          </p>
          <p className="text-sm text-nc-warm/80">
            Ao navegar, cadastrar-se ou contratar serviços através de nossos ambientes, o usuário declara ter lido, compreendido e aceito integralmente as condições aqui estipuladas.
          </p>
        </div>
      )
    },
    {
      id: 'terms-2',
      number: '02',
      title: 'Natureza dos Serviços e Intermediação Turística',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            A NC Turismo atua como agência de viagens corporativas e de lazer, intermediando a contratação de serviços turísticos prestados por terceiros independentes, tais como companhias aéreas nacionais e internacionais, redes hoteleiras, locadoras de veículos, empresas de transporte terrestre, operadoras receptivas e seguradoras de viagem.
          </p>
          <div className="p-4 bg-nc-surface border border-white/5 rounded-xl text-sm">
            <strong className="text-white block mb-1">Regras dos Fornecedores Finais:</strong>
            A emissão de bilhetes, vouchers e reservas vincula-se às condições gerais, políticas de cancelamento, regras tarifárias e normas de conduta estipuladas por cada fornecedor final e pelos órgãos reguladores competentes (ex.: ANAC, Embratur, Ministério do Turismo).
          </div>
        </div>
      )
    },
    {
      id: 'terms-3',
      number: '03',
      title: 'Cadastro, Acesso e Responsabilidades do Usuário',
      content: (
        <div className="space-y-3 leading-relaxed text-sm md:text-base">
          <p>
            O usuário se compromete a fornecer informações verídicas, completas e atualizadas no momento de suas cotações, cadastros ou reservas. A precisão dos dados de passageiros (nome civil idêntico ao documento oficial de identificação, datas de nascimento e documentos de viagem) é de exclusiva responsabilidade do contratante/solicitante.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-nc-warm/80 pl-2">
            <li>Guardar com sigilo suas credenciais de login e senhas dos ambientes corporativos;</li>
            <li>Apresentar tempestivamente toda a documentação necessária para embarque e viagens (vistos, passaportes válidos, autorizações de menores e vacinas);</li>
            <li>Não utilizar as plataformas para fins ilícitos ou para reservas fraudulentas/especulativas.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'terms-4',
      number: '04',
      title: 'Políticas de Emissão, Pagamento e Tarifas',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            As tarifas, disponibilidade de assentos e condições de hospedagem são dinâmicas e sujeitas a variação até o momento de sua efetiva confirmação e emissão.
          </p>
          <p className="text-sm text-nc-warm/80">
            Formas de pagamento, prazos de faturamento corporativo e aprovações orçamentárias seguirão as condições comerciais contratadas individualmente entre a empresa cliente e a NC Turismo, ou aprovadas em checkout online.
          </p>
        </div>
      )
    },
    {
      id: 'terms-5',
      number: '05',
      title: 'Alterações, Cancelamentos e Reembolsos',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Solicitações de cancelamento, alteração de datas, rotas ou nomes dependem expressamente das normas da tarifa contratada (incluindo multas contratuais, taxas administrativas e eventuais diferenças tarifárias).
          </p>
          <div className="p-3.5 bg-nc-surface border border-white/10 rounded-xl text-xs md:text-sm text-nc-warm/80">
            Prazos de processamento e repasse de reembolsos observarão os cronogramas estabelecidos pelas companhias aéreas, operadoras e fornecedores correspondentes, além das disposições da legislação vigente.
          </div>
        </div>
      )
    },
    {
      id: 'terms-6',
      number: '06',
      title: 'Ambientes de Benefícios e Convênios',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Condições especiais disponibilizadas em canais de benefícios corporativos, parcerias associativas ou cooperativas são destinadas exclusivamente aos membros elegíveis da respectiva organização conveniada, estando sujeitas a validação de vínculo e regras específicas do convênio.
          </p>
        </div>
      )
    },
    {
      id: 'terms-7',
      number: '07',
      title: 'Propriedade Intelectual',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Todas as marcas, logotipos, layouts, sistemas, textos e elementos visuais da NC Turismo são de sua propriedade exclusiva ou licenciados, sendo vedada a reprodução total ou parcial sem prévia e expressa autorização.
          </p>
        </div>
      )
    },
    {
      id: 'terms-8',
      number: '08',
      title: 'Foro e Legislação Aplicável',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p>
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Para dirimir quaisquer controvérsias decorrentes deste instrumento, fica eleito o Foro Central da Comarca de Curitiba, Estado do Paraná, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
          </p>
        </div>
      )
    }
  ];

  const beneficiosSections = [
    {
      id: 'ben-1',
      number: '01',
      title: 'NC Turismo e o Ambiente de Benefícios',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            A <strong className="text-white">N C TURISMO LTDA.</strong>, inscrita no CNPJ sob o nº <strong className="text-white">81.102.709/0001-08</strong>, é responsável pela relação com seus clientes e usuários nos serviços oferecidos pela NC Turismo através do portal <code className="text-nc-orange bg-white/5 px-2 py-0.5 rounded text-xs">beneficios.ncturismo.com.br</code>.
          </p>
          <p className="leading-relaxed">
            No contexto das pesquisas, reservas e serviços de viagem neste ambiente corporativo e de parcerias, poderão ser necessários dados pessoais para:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-nc-warm/90">
            {[
              'Identificar o viajante ou colaborador beneficiário;',
              'Realizar pesquisas dinâmicas e reservas;',
              'Emitir passagens, hospedagens e outros serviços turísticos;',
              'Prestar atendimento antes, durante e depois da viagem;',
              'Processar alterações, cancelamentos e reembolsos;',
              'Cumprir obrigações legais, regulatórias, fiscais e administrativas;',
              'Prevenir fraudes e proteger a segurança das operações.'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 p-2.5 bg-nc-surface/50 border border-white/5 rounded-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-nc-orange shrink-0"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-nc-warm/70 italic pt-1">
            A utilização dos dados pela NC Turismo está sujeita à sua <strong>Política de Privacidade e Proteção de Dados Geral</strong>, disponível no site oficial da empresa.
          </p>
        </div>
      )
    },
    {
      id: 'ben-2',
      number: '02',
      title: 'Tecnologia InfoTravel / Infotera',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-nc-surface border border-white/10 rounded-2xl flex items-start gap-3.5">
            <Server className="text-nc-orange shrink-0 mt-1" size={22} />
            <div className="space-y-1.5 text-sm">
              <p className="text-white font-medium">Parceria Tecnológica de Motor de Reservas</p>
              <p className="text-nc-warm/80 leading-relaxed">
                O ambiente de reservas utiliza a plataforma de motor turístico <strong className="text-white">InfoTravel</strong>, fornecida pela <strong className="text-white">Infotera Tecnologia de Informática Ltda.</strong>
              </p>
            </div>
          </div>
          <p className="leading-relaxed text-sm md:text-base">
            Durante a utilização dessa plataforma, a Infotera poderá realizar tratamentos de dados pessoais estritamente necessários ao funcionamento do ambiente e à execução dos serviços tecnológicos envolvidos.
          </p>
          <p className="leading-relaxed text-sm text-nc-warm/80">
            Segundo sua Política de Privacidade, a Infotera informa que utiliza apenas os dados necessários à execução dos serviços solicitados ou contratados, e que poderá compartilhar dados pessoais com outras organizações quando esse compartilhamento for necessário para a prestação do serviço, observada a legislação aplicável.
          </p>
        </div>
      )
    },
    {
      id: 'ben-3',
      number: '03',
      title: 'Dados tratados durante a reserva',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Dependendo do produto ou serviço contratado no ambiente <code className="text-nc-orange bg-white/5 px-1.5 py-0.5 rounded text-xs">beneficios.ncturismo.com.br</code>, poderão ser necessários dados como:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-nc-warm/90">
            {[
              'Nome completo;',
              'CPF ou documento de identificação (RG, Passaporte);',
              'Data de nascimento;',
              'Telefone e e-mail corporativo ou pessoal;',
              'Dados dos passageiros acompanhantes;',
              'Informações necessárias à emissão ou reserva (assentos, fidelidade);',
              'Dados relacionados à contratação e ao atendimento;',
              'Informações técnicas geradas durante a utilização da plataforma.'
            ].map((d, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-nc-surface/40 border border-white/5 rounded-lg">
                <CheckCircle2 size={16} className="text-nc-orange shrink-0 mt-0.5" />
                <span>{d}</span>
              </div>
            ))}
          </div>
          <p className="text-xs md:text-sm text-nc-warm/70 italic">
            Determinados serviços poderão exigir informações adicionais em razão das regras de companhias aéreas, hotéis, seguradoras, locadoras, autoridades migratórias ou outros fornecedores envolvidos na viagem.
          </p>
        </div>
      )
    },
    {
      id: 'ben-4',
      number: '04',
      title: 'Compartilhamento com fornecedores de viagem',
      content: (
        <div className="space-y-4">
          <p className="leading-relaxed">
            Para realizar uma reserva ou prestar o serviço solicitado através do portal de benefícios, poderá ser necessário compartilhar dados com fornecedores envolvidos na jornada:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs md:text-sm">
            {[
              'Companhias aéreas',
              'Hotéis e hospedagens',
              'Locadoras de veículos',
              'Seguradoras de viagem',
              'Operadoras turísticas',
              'Consolidadoras',
              'Meios de pagamento',
              'Transfers e receptivos'
            ].map((partner, idx) => (
              <div key={idx} className="bg-nc-surface p-3 rounded-xl border border-white/5 text-center">
                <span className="text-white font-medium block">{partner}</span>
              </div>
            ))}
          </div>
          <div className="p-3.5 bg-nc-surface border border-white/5 rounded-xl text-xs md:text-sm text-nc-warm/80">
            Cada fornecedor parceiro atua de acordo com suas atribuições técnicas e poderá realizar tratamentos de dados segundo suas próprias políticas de privacidade e termos específicos.
          </div>
        </div>
      )
    },
    {
      id: 'ben-5',
      number: '05',
      title: 'Pagamentos e Transações',
      content: (
        <div className="space-y-3 leading-relaxed">
          <div className="flex items-start gap-3.5 p-4 bg-nc-surface border border-white/10 rounded-2xl">
            <CreditCard className="text-nc-orange shrink-0 mt-1" size={22} />
            <div className="space-y-1 text-sm">
              <strong className="text-white block">Arquitetura Segura de Cobrança:</strong>
              <p className="text-nc-warm/80">
                Os pagamentos realizados no ambiente de reservas poderão envolver fornecedores e processadores de pagamento integrados de forma segura e tokenizada à plataforma.
              </p>
            </div>
          </div>
          <p className="text-sm text-nc-warm/80">
            As informações relacionadas à forma de processamento e eventual armazenamento dos dados de pagamento observarão a arquitetura tecnológica e certificações de segurança (PCI-DSS) efetivamente adotadas no ambiente.
          </p>
          <div className="p-3 bg-nc-orange/10 border border-nc-orange/20 rounded-xl text-xs md:text-sm text-nc-warm/90">
            <strong className="text-white">Diretriz da NC Turismo:</strong> Recomendamos expressamente que dados completos e sensíveis de cartão de crédito não sejam armazenados no site institucional da NC.
          </div>
        </div>
      )
    },
    {
      id: 'ben-6',
      number: '06',
      title: 'Cookies do ambiente InfoTravel',
      content: (
        <div className="space-y-3 leading-relaxed">
          <div className="flex items-start gap-3.5 p-4 bg-nc-surface border border-white/10 rounded-2xl">
            <Cookie className="text-nc-orange shrink-0 mt-1" size={22} />
            <div className="space-y-1.5 text-sm">
              <p className="text-white font-medium">Cookies Essenciais e de Desempenho</p>
              <p className="text-nc-warm/80">
                A plataforma InfoTravel utiliza cookies necessários ao funcionamento, estabilidade e ao desempenho do ambiente de reservas.
              </p>
            </div>
          </div>
          <p className="text-sm text-nc-warm/80">
            Cookies são pequenos arquivos armazenados no navegador do usuário e são utilizados para manter sessões seguras ativas, permitir funcionalidades do fluxo de busca e reserva e melhorar a experiência de navegação.
          </p>
          <p className="text-xs text-nc-warm/70 italic">
            A Infotera informa formalmente que a utilização desses cookies é indispensável ao correto funcionamento da sua plataforma e motor de tarifas.
          </p>
        </div>
      )
    },
    {
      id: 'ben-7',
      number: '07',
      title: 'Armazenamento e Eliminação dos Dados',
      content: (
        <div className="space-y-3 leading-relaxed">
          <p className="text-sm md:text-base">
            Segundo sua Política de Privacidade, a Infotera mantém somente os dados necessários à execução de suas atividades e ao estrito cumprimento de obrigações legais ou regulatórias.
          </p>
          <p className="text-sm text-white font-medium">Os dados poderão ser eliminados quando:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-nc-warm/90">
            {[
              'A finalidade do tratamento tiver sido alcançada;',
              'Deixarem de ser necessários para a prestação do serviço;',
              'Terminar o período de tratamento legal;',
              'Houver solicitação válida do titular de dados;',
              'Houver determinação da autoridade competente (ANPD).'
            ].map((condition, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-nc-surface/50 p-2.5 rounded-lg border border-white/5">
                <span className="text-nc-orange font-bold text-xs mt-0.5">•</span>
                <span>{condition}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-nc-warm/60">
            Sempre observadas as hipóteses legais que expressamente permitam ou exijam sua conservação (ex.: legislação fiscal e contábil).
          </p>
        </div>
      )
    },
    {
      id: 'ben-8',
      number: '08',
      title: 'Segurança da Informação',
      content: (
        <div className="space-y-3 leading-relaxed">
          <div className="flex items-start gap-4 p-4 bg-nc-surface border border-white/5 rounded-2xl">
            <Lock className="text-nc-orange shrink-0 mt-1" size={24} />
            <div>
              <p className="text-white font-medium mb-1">Proteção Contínua e Confidencialidade</p>
              <p className="text-sm text-nc-warm/80">
                A NC Turismo adota medidas destinadas à proteção dos dados pessoais tratados no âmbito de seus serviços e parcerias corporativas.
              </p>
            </div>
          </div>
          <p className="text-sm text-nc-warm/80">
            A Infotera informa que também utiliza medidas técnicas e administrativas destinadas a manter os dados pessoais de forma segura, íntegra e confidencial em sua infraestrutura tecnológica.
          </p>
        </div>
      )
    },
    {
      id: 'ben-9',
      number: '09',
      title: 'Direitos do Titular e Contatos dos Encarregados (DPO)',
      content: (
        <div className="space-y-6">
          <p className="leading-relaxed text-sm md:text-base">
            O titular poderá exercer os direitos previstos na Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018), incluindo confirmação de tratamento, acesso, correção, eliminação, oposição e revogação do consentimento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box NC Turismo */}
            <div className="bg-nc-surface border border-white/10 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-nc-orange">
                <Building2 size={20} />
                <h4 className="text-white font-bold text-base">Para assuntos da NC Turismo</h4>
              </div>
              <p className="text-xs text-nc-warm/60">
                Responsável pela relação contratual, emissão e suporte ao cliente:
              </p>
              <div className="space-y-1.5 text-xs md:text-sm pt-2">
                <p className="text-white font-medium">NC Turismo Ltda.</p>
                <p className="text-nc-warm/70">Rua Dr. Faivre, 75 — Loja 2, Centro</p>
                <p className="text-nc-warm/70">Curitiba/PR — CEP 80060-140</p>
                <p className="pt-2">
                  <span className="text-nc-warm/50 block text-xs">E-mail de Atendimento e DPO:</span>
                  <a href="mailto:atendimento@ncturismo.com.br" className="text-nc-orange hover:underline font-medium">
                    atendimento@ncturismo.com.br
                  </a>
                </p>
              </div>
            </div>

            {/* Box Infotera */}
            <div className="bg-nc-surface border border-white/10 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-nc-orange">
                <Server size={20} />
                <h4 className="text-white font-bold text-base">Para assuntos da plataforma Infotera</h4>
              </div>
              <p className="text-xs text-nc-warm/60">
                Responsável pela infraestrutura do sistema InfoTravel:
              </p>
              <div className="space-y-1.5 text-xs md:text-sm pt-2">
                <p className="text-white font-medium">Infotera Tecnologia de Informática Ltda.</p>
                <p className="text-nc-warm/70">
                  <strong className="text-white">Encarregado (DPO):</strong> Daniel Borges
                </p>
                <p className="text-nc-warm/70">Rua Padre Adelino, 2074 — 5º andar</p>
                <p className="text-nc-warm/70">São Paulo/SP — CEP 03303-000</p>
                <p className="pt-2">
                  <span className="text-nc-warm/50 block text-xs">E-mail do Encarregado:</span>
                  <a href="mailto:encarregado@infotera.com.br" className="text-nc-orange hover:underline font-medium">
                    encarregado@infotera.com.br
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ben-10',
      number: '10',
      title: 'Políticas Aplicáveis e Termos Conexos',
      content: (
        <div className="space-y-4 leading-relaxed">
          <p className="text-sm md:text-base">
            Antes de utilizar o ambiente de reservas e benefícios corporativos, recomendamos expressamente a leitura de todos os instrumentos reguladores:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => { setActiveTab('privacidade'); setSearchQuery(''); }}
              className="p-4 bg-nc-surface border border-white/10 hover:border-nc-orange/50 rounded-xl text-left transition-colors group"
            >
              <span className="text-nc-orange font-bold text-xs uppercase tracking-wider block mb-1">Documento 1</span>
              <span className="text-white font-semibold text-sm group-hover:text-nc-orange transition-colors">
                Política de Privacidade Geral NC &rarr;
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('termos'); setSearchQuery(''); }}
              className="p-4 bg-nc-surface border border-white/10 hover:border-nc-orange/50 rounded-xl text-left transition-colors group"
            >
              <span className="text-nc-orange font-bold text-xs uppercase tracking-wider block mb-1">Documento 2</span>
              <span className="text-white font-semibold text-sm group-hover:text-nc-orange transition-colors">
                Termos de Uso da NC Turismo &rarr;
              </span>
            </button>

            <div className="p-4 bg-nc-surface border border-white/10 rounded-xl text-left">
              <span className="text-nc-warm/40 font-bold text-xs uppercase tracking-wider block mb-1">Documento 3</span>
              <span className="text-white font-semibold text-sm block">
                Política de Privacidade Infotera
              </span>
              <span className="text-xs text-nc-warm/50 block mt-1">
                Disponível na plataforma InfoTravel
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-nc-surface border border-white/5 rounded-xl text-xs text-nc-warm/70">
            A utilização do ambiente NC Benefícios em Viagens implica na concordância plena com as condições e políticas supracitadas.
          </div>
        </div>
      )
    }
  ];

  const currentList = activeTab === 'privacidade' 
    ? privacySections 
    : activeTab === 'beneficios' 
      ? beneficiosSections 
      : termsSections;
      
  const filteredSections = searchQuery.trim() === '' 
    ? currentList 
    : currentList.filter(sec => 
        sec.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        sec.number.includes(searchQuery)
      );

  return (
    <div className="min-h-screen bg-[#0c0e12] text-nc-warm pt-28 pb-20 selection:bg-nc-orange selection:text-white">
      {/* Top Floating / Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
          <button 
            onClick={onBackToHome}
            className="group flex items-center gap-2.5 text-nc-warm/70 hover:text-white text-xs md:text-sm uppercase tracking-wider font-semibold transition-colors py-2 px-3 rounded-full hover:bg-white/5"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-nc-orange" />
            Voltar para o site principal
          </button>

          {/* Quick Tab Switcher */}
          <div className="flex flex-wrap items-center bg-nc-surface border border-white/10 p-1.5 rounded-2xl md:rounded-full gap-1">
            <button
              onClick={() => { setActiveTab('privacidade'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl md:rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'privacidade' 
                  ? 'bg-nc-orange text-nc-space shadow-md font-bold' 
                  : 'text-nc-warm/70 hover:text-white'
              }`}
            >
              <ShieldCheck size={16} />
              Política de Privacidade
            </button>
            <button
              onClick={() => { setActiveTab('beneficios'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl md:rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'beneficios' 
                  ? 'bg-nc-orange text-nc-space shadow-md font-bold' 
                  : 'text-nc-warm/70 hover:text-white'
              }`}
            >
              <Sparkles size={16} />
              Benefícios em Viagens
            </button>
            <button
              onClick={() => { setActiveTab('termos'); setSearchQuery(''); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl md:rounded-full text-xs md:text-sm font-semibold transition-all ${
                activeTab === 'termos' 
                  ? 'bg-nc-orange text-nc-space shadow-md font-bold' 
                  : 'text-nc-warm/70 hover:text-white'
              }`}
            >
              <FileText size={16} />
              Termos de Uso
            </button>
          </div>

          <button 
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider text-nc-warm/50 hover:text-white transition-colors py-2 px-4 rounded-full border border-white/5 hover:border-white/20"
            title="Imprimir ou salvar PDF desta versão"
          >
            <Printer size={15} />
            Imprimir versão oficial
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 mb-12">
        <div className="bg-gradient-to-b from-nc-surface to-nc-space border border-white/10 rounded-3xl p-8 md:p-14 relative overflow-hidden shadow-2xl">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-nc-orange/5 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-nc-orange text-xs font-semibold uppercase tracking-[0.15em] mb-6">
              <Building2 size={14} />
              {activeTab === 'beneficios' 
                ? 'NC Benefícios / Portal InfoTravel (Infotera)' 
                : 'NC / Jurídico, Privacidade & Compliance'}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-[52px] font-bold text-white tracking-tight leading-[1.1] mb-6">
              {activeTab === 'privacidade' && (
                <>Política de Privacidade e <span className="text-nc-orange">Proteção de Dados</span></>
              )}
              {activeTab === 'beneficios' && (
                <>Privacidade no ambiente <span className="text-nc-orange">NC Benefícios em Viagens</span></>
              )}
              {activeTab === 'termos' && (
                <>Termos e Condições <span className="text-nc-orange">de Uso</span></>
              )}
            </h1>

            <p className="text-nc-warm/80 text-base md:text-lg leading-relaxed mb-6 font-light">
              {activeTab === 'privacidade' && (
                'A NC Turismo valoriza a privacidade e a proteção dos dados pessoais de seus clientes, parceiros, viajantes e usuários de nossas plataformas e canais de atendimento corporativo.'
              )}
              {activeTab === 'beneficios' && (
                'O ambiente NC Benefícios em Viagens (beneficios.ncturismo.com.br) é viabilizado com tecnologia InfoTravel, fornecida pela Infotera Tecnologia de Informática Ltda. Conheça as diretrizes de tratamento durante a jornada de reserva.'
              )}
              {activeTab === 'termos' && (
                'Condições gerais que disciplinam o acesso, a navegação, as solicitações e a contratação de serviços de intermediação turística através de nossos canais digitais e corporativos.'
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-nc-warm/60">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-white font-medium">
                  {activeTab === 'beneficios' ? 'Ambiente benefícios.ncturismo.com.br' : 'Versão 1.1 Vigente'}
                </span>
              </div>
              <span>Última atualização: Setembro de 2026</span>
              <span>•</span>
              <span>N C TURISMO LTDA. — CNPJ 81.102.709/0001-08</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Sidebar Index + Sections) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sticky Left Sidebar Index */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {/* Search filter */}
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-nc-warm/40" />
                <input 
                  type="text"
                  placeholder="Pesquisar tópico ou artigo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-nc-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-nc-orange/50 transition-colors"
                />
              </div>

              {/* Navigation tree */}
              <div className="bg-nc-surface/60 border border-white/5 rounded-2xl p-5 max-h-[calc(100vh-280px)] overflow-y-auto space-y-1 text-sm custom-scrollbar">
                <p className="text-[11px] uppercase tracking-widest text-nc-warm/40 font-bold mb-3 px-2">
                  Índice das seções ({filteredSections.length})
                </p>
                {filteredSections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs md:text-[13px] flex items-center justify-between transition-all ${
                      activeSection === sec.id 
                        ? 'bg-nc-orange/15 text-nc-orange font-semibold border-l-2 border-nc-orange pl-3' 
                        : 'text-nc-warm/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate pr-2">
                      <span className="opacity-50 mr-1.5 font-mono">{sec.number}.</span>
                      {sec.title}
                    </span>
                    <ChevronRight size={13} className="shrink-0 opacity-40" />
                  </button>
                ))}
              </div>

              {/* Quick Contact Card */}
              <div className="bg-nc-surface border border-white/10 p-5 rounded-2xl">
                <h4 className="text-white text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail size={16} className="text-nc-orange" />
                  Dúvidas sobre seus dados?
                </h4>
                <p className="text-xs text-nc-warm/60 leading-relaxed mb-3">
                  Nossa equipe de privacidade e governança está à disposição para esclarecimentos.
                </p>
                <a 
                  href="mailto:atendimento@ncturismo.com.br"
                  className="text-xs text-nc-orange hover:underline font-semibold block"
                >
                  atendimento@ncturismo.com.br &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Right Main Content Stream */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search query feedback */}
            {searchQuery && (
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl flex items-center justify-between text-xs text-nc-warm/80">
                <span>Filtrando por: <strong className="text-white">"{searchQuery}"</strong> ({filteredSections.length} resultado(s))</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-nc-orange hover:underline font-semibold"
                >
                  Limpar filtro
                </button>
              </div>
            )}

            {filteredSections.length === 0 ? (
              <div className="bg-nc-surface border border-white/10 rounded-2xl p-12 text-center">
                <p className="text-lg font-semibold text-white mb-2">Nenhum tópico encontrado</p>
                <p className="text-sm text-nc-warm/60 mb-6">Tente pesquisar por outro termo ou limpe o campo de busca.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-nc-orange text-nc-space font-bold text-xs uppercase tracking-wider rounded-full hover:bg-opacity-90"
                >
                  Ver todas as seções
                </button>
              </div>
            ) : (
              filteredSections.map((section) => (
                <section 
                  key={section.id} 
                  id={section.id}
                  className="bg-nc-surface/40 hover:bg-nc-surface/60 transition-colors border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 scroll-mt-28"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <span className="text-xs font-mono font-bold text-nc-orange bg-nc-orange/10 px-2.5 py-1 rounded-md border border-nc-orange/20">
                      {section.number}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                      {section.title}
                    </h2>
                  </div>

                  <div className="text-nc-warm/80 text-sm md:text-base">
                    {section.content}
                  </div>
                </section>
              ))
            )}

            {/* End of Document Footer Notice */}
            <div className="bg-nc-space border border-white/10 rounded-2xl p-6 md:p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-nc-orange/10 text-nc-orange mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-white font-bold text-lg">Documentação Oficial da NC Turismo</h3>
              <p className="text-xs md:text-sm text-nc-warm/60 max-w-xl mx-auto leading-relaxed">
                Nossos termos e políticas foram elaborados em estrita conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), o Marco Civil da Internet (Lei nº 12.965/2014) e as normas regulamentadoras do setor de turismo.
              </p>
              <div className="pt-2">
                <button 
                  onClick={onBackToHome}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-nc-orange text-nc-space rounded-full font-bold text-xs uppercase tracking-wider hover:bg-opacity-90 transition-all shadow-lg"
                >
                  <ArrowLeft size={16} />
                  Retornar ao início do site
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
