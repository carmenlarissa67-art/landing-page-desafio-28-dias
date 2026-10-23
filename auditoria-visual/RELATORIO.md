# Refinamento visual do Meu Ritmo

Data: 23/10/2026. Escopo: melhoria da landing existente, preservando identidade, informações da oferta, Pixel e checkout.

Atualização solicitada após a revisão: removido o botão fixo e seu listener de rolagem. O checkout permanece exclusivamente no botão de “Seu plano começa aqui”; os outros CTAs avançam à seção seguinte, com textos adequados à navegação. Onze testes cobrem a versão final. As capturas e estados desta pasta foram atualizados. As referências abaixo a cinco links e scripts idênticos registram a auditoria anterior a essa solicitação; a lógica do Pixel e do consentimento continua preservada, enquanto o código da barra foi removido.

## Direção e referências

Uma jornada pessoal em quatro fases: círculos e recortes curvos acompanham as telas reais do produto. A composição dá destaque ao aplicativo e alterna introdução, narrativa, comparação, etapas, entregas, galeria, oferta e FAQ.

Referência consultada: [21st.dev — componentes da comunidade](https://21st.dev/community/components), especialmente apresentações de produto e seletores de conteúdo. Inspiração aplicada na composição do hero e na galeria com botões; nenhum componente externo foi copiado.

Skills aplicadas: design-taste-frontend, ui-ux-pro-max, impeccable, animate, animation-performance, apple-design e mobile-native. animate-expo foi considerada conforme solicitado; sua implementação Reanimated é exclusiva de React Native/Expo, portanto a implementação web usa animate e Framer Motion. A landing continua HTML estático, sem migração para React.

Sorteio de direção: seed `71979296`, `one-motif`, sem novo sorteio. Paleta e tipografia preservadas por decisão já aprovada. A sugestão de shutter foi adaptada para translação/escala e opacidade, evitando máscaras e pintura por quadro. Não foram utilizados números comerciais, depoimentos, fotos ou informações empresariais inventadas.

## Inventário preservado

1. Nome Meu Ritmo e proposta de organização pessoal com IA.
2. Jornada personalizada de 28 dias.
3. Mapeamento inicial da vida e prioridades.
4. Plano diário e registros de execução.
5. Quatro fases: Reflexiva, Dinâmica, Expressiva e Criativa.
6. Relatório e planner ao final da jornada.
7. Capturas reais, inclusive IMG_4719.PNG, IMG_4720.PNG e IMG_4722.PNG.
8. Vídeo demonstrativo existente com controles nativos.
9. Preço de R$ 37, pagamento único e acesso vitalício.
10. Cinco links de compra Kiwify e garantia informada na página.
11. FAQ, documentos legais e atendimento existente.
12. Pixel 735853032032044 e preferências de privacidade.

## Hierarquia e texto

Promessa principal: “Organize no seu ritmo”. A explicação imediatamente seguinte identifica o aplicativo, a IA e os 28 dias. A sequência trata do problema, explica a personalização, mostra o produto e as etapas, apresenta entregas e fases, oferece exploração interativa e conclui com preço, FAQ e chamada final. Títulos foram encurtados para facilitar leitura; as condições comerciais permanecem.

Fahkwang nos títulos e Livvic no corpo, pesos regulares/médios. Creme, lavanda, ameixa e sálvia preservados. Margens compartilhadas, blocos menos repetitivos, telas maiores e reflow próprio no celular. A oferta coloca preço e CTA antes da lista de benefícios na ordem de leitura móvel.

O aviso de privacidade agora ocupa espaço próprio no início da página, sem sobrepor títulos durante a rolagem. As três opções e seus handlers permanecem. O rodapé continua permitindo reabrir as preferências.

## Movimento

Framer Motion instalado, compilado localmente, sem CDN para o código de animação. Entradas únicas de títulos e imagens usam transform/opacity, 400–500 ms e curva de desaceleração. A galeria usa spring de 300 ms sem bounce e interrompe a animação anterior quando a seleção muda. Feedback de pressão: 140 ms. Conteúdo nunca depende de uma animação terminar para ser lido.

Preferência de movimento reduzido respeitada, inclusive ao mudar durante a sessão. Vídeo sem autoplay e pausado ao sair da área visível ou ao ocultar a aba. Sem captura de rolagem, loops decorativos ou atualizações de estado React a cada quadro.

## Validação

- `npm run build`: saída estática em `dist` e bundle gerado.
- Dez testes de regressão: consentimento novo/salvo/recusado/revogado, armazenamento indisponível, sincronização entre abas, arquivos locais/Git, contraste e cinco links de compra.
- Comparação com HEAD: os dois blocos originais de JavaScript inline são idênticos, desconsiderando apenas quebra de linha CRLF/LF.
- Medidas no navegador: 320, 360, 390, 768, 1024 e 1440 px sem rolagem horizontal.
- Galeria testada por clique e teclado; FAQ abre a resposta; preferências abrem, fecham com Escape e devolvem o foco ao botão de origem.
- Inspeção da skill em 1440, 768 e 390 px: **0 FAIL e 1 WARN**. Título principal em duas linhas nas três larguras; imagens carregadas.
- Exceção de marca explícita: `palette-cream`. Nenhum outro bloqueio visual foi ignorado.
- Aviso restante `size-count`: a contagem inclui variações responsivas, preço, wordmark e controles legais, além das funções principais de texto. Mantido para preservar a hierarquia e a identidade; não representa corte ou ilegibilidade.

O Windows estava com movimento reduzido ativo. O adaptador `normal-motion.mjs` configura somente o navegador descartável de auditoria para testar o modo normal, mantendo o teste separado de movimento reduzido. O inspetor registrou movimento nos elementos após essa configuração; as preferências do computador não foram alteradas.

Capturas finais e resultado dos testes de estados estão nesta pasta. Os contatos com Meta e pagamento não foram acionados para uma compra real. Testes em Chromium com larguras simuladas; não houve teste físico em iPhone/Android nem auditoria de FPS em aparelho de baixo desempenho.

## Crítica das rodadas

ROUND 1
Seen in one second: título e telas reais do aplicativo substituem a apresentação longa e uniforme.
Idea (one sentence): organização que acompanha fases, expressa em formas curvas e um conjunto de telas reais.
Live thing: galeria planejada; ainda estática nesta rodada.
Layout words by section: hero=colagem / dor=narrativa / métodos=comparação / produto=demonstração / etapas=sequência / entregas=lista / fases=progressão / galeria=grade / oferta=duas colunas / FAQ=acordeão.
Scores: design 7 · usability 7 · creativity 6.5 · content 8 → overall 6.0.
Caps applied: falhas de inspeção antes das correções.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Tablet-fold: título quebrava em três linhas; ajustado tamanho fluido no breakpoint.
2. Mobile-page-02: entregas apertadas em colunas internas; título e descrição passaram a empilhar.
3. Desktop-page-03: galeria precisava de interação; implementado seletor acessível.

ROUND 2
Seen in one second: identidade coesa, com excesso de espaço coberto pelo aviso fixo.
Idea (one sentence): uma sequência de telas guia a visitante pela organização em fases.
Live thing: galeria de quatro telas, navegável por teclado.
Layout words by section: mantidos os papéis da rodada 1, galeria=seletor de produto.
Scores: design 7.5 · usability 6 · creativity 6.5 · content 8 → overall 6.0.
Caps applied: sobreposição do aviso de cookies e resultados de inspeção ainda pendentes.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. Mobile-fold e todas as folhas: aviso cobria grande área de leitura; movido para o fluxo no início.
2. Oferta móvel: preço aparecia depois de oito benefícios; preço e CTA antecipados.
3. Auditoria de movimento: preferência do sistema desativava as animações; execução normal testada separadamente sem desrespeitar a preferência do usuário.

ROUND 3
Seen in one second: título marcante, aplicativo real e ação de compra clara.
Idea (one sentence): curvas e mudanças de composição acompanham a ideia de um plano que respeita o ritmo pessoal.
Live thing: galeria permite conhecer mapeamento, plano, jornada e matriz sem sair da página.
Layout words by section: hero=colagem / dor=narrativa / métodos=comparação / produto=vídeo / etapas=sequência / entregas=lista / fases=progressão / diferencial=comparação / galeria=exploração / oferta=duas colunas / FAQ=acordeão / final=chamada / rodapé=assinatura.
Scores: design 8 · usability 8 · creativity 7 · content 8 → overall 7.8.
Caps applied: criatividade limitada a 7 porque o motivo cíclico também poderia servir a outro produto da categoria.
Top three problems (most visible first), each with the screenshot it shows in and the fix:
1. A narrativa permanece longa no celular; preservada por conter o conteúdo comercial existente. Uma edição de copy pode ser uma etapa futura.
2. A primeira visita mostra o aviso de cookies antes do hero; escolha explícita para manter controles acessíveis sem cobrir o conteúdo.
3. Há variantes tipográficas adicionais para marca/preço/modais; mantidas com a justificativa acima. Nenhuma colisão ou corte observado nas telas revisadas.

## Publicação e manutenção

`vercel.json` aponta para `dist`, que contém apenas os arquivos públicos necessários. O CSS de origem está em `src/styles.css`; execute o build após editar estilos ou animações. O bundle deve acompanhar a publicação para a galeria interativa funcionar; sem ele, as capturas permanecem em grade.

Informações de razão social, CNPJ, endereço e responsável por privacidade continuam sem preenchimento, conforme decisão anterior da usuária. Os arquivos não relacionados IMG_4721.PNG e IMG_4723.PNG e backups existentes não foram incorporados à atualização.
