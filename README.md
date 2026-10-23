# Meu Ritmo — landing page

Landing estática em HTML, CSS e JavaScript. Fahkwang e Livvic mantêm os pesos 400 e 500 da identidade aprovada.

## Desenvolvimento

Use Node.js 22 ou superior.

```sh
npm ci
npm run build
npm test
```

- Conteúdo e scripts de consentimento/checkout: `index.html`.
- Estilos: edite `src/styles.css`; o build sincroniza o bloco de CSS do HTML.
- Animações: `src/motion.js`, usando a API DOM do Framer Motion.
- Bundle público: `assets/site-motion.js`, incluído no Git para continuar permitindo hospedagem estática da raiz.
- Saída de publicação: `dist/`. O build copia somente HTML e assets públicos referenciados, além da imagem de compartilhamento.

O `vercel.json` configura `npm run build` e a pasta `dist`. A instalação de dependências usa `package-lock.json`.
Para visualizar, sirva `dist/` por HTTP; por exemplo, `python -m http.server 4174 --directory dist`.

## Comportamentos preservados

Somente o CTA de “Seu plano começa aqui” aponta para `https://pay.kiwify.com.br/NXZ0sjz`. O evento `InitiateCheckout` está associado apenas a esse botão e depende do consentimento de marketing. Os outros três CTAs avançam à seção seguinte: início → problema, apresentação do produto → como funciona, chamada final → contato no rodapé. O botão fixo foi removido.

O Meta Pixel `735853032032044` mantém a inicialização condicionada à autorização, a revogação e a sincronização entre abas. Os testes executam os scripts reais com uma simulação do navegador, sem transmitir eventos à Meta nem fazer compras.

A página apresenta todo o conteúdo essencial sem o módulo de animações. Sem JavaScript, as quatro capturas da galeria ficam disponíveis; com JavaScript, botões permitem alterná-las. `prefers-reduced-motion` elimina deslocamentos e transições de entrada.

## Auditoria visual

Veja `auditoria-visual/RELATORIO.md` para decisões, referências, capturas e limitações. Os scripts opcionais em `.taste-skill/` usam a skill `design-taste-frontend` instalada no perfil local; não são necessários para compilar ou publicar o site.
