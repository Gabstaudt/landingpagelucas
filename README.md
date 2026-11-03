# L R Ferreira — Landing Page

Projeto em Next.js + Tailwind CSS + Framer Motion.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Build

```bash
npm run build
npm start
```

## Estrutura
- `app/page.tsx`: landing page
- `app/globals.css`: estilos globais
- `components/AnimatedLogo.tsx`: animação de entrada da marca
- `components/LogoMark.tsx`: símbolo vetorial em React
- `public/assets/meeting.png`: fotografia editorial

## SEO e compartilhamento

- `lib/seo.ts`: domínio, textos e dados estruturados do escritório, advogado e site.
- `app/layout.tsx`: título, descrição, canonical, indexação, Open Graph e Twitter Card.
- `app/robots.ts`: publica `/robots.txt` com referência ao sitemap.
- `app/sitemap.ts`: publica `/sitemap.xml` com a página pública. Seções com `#` não são páginas separadas.
- `public/og-image.png`: prévia de compartilhamento (1200 × 630).
- `public/assets/brand/logo-seo.png`: símbolo oficial em PNG para os dados estruturados.

O endereço padrão é `https://lrferreiraadv.netlify.app`. Nos builds do Netlify, a variável automática `URL` fornece o endereço público do site. `SITE_URL`, quando definida, tem prioridade; use-a apenas com um domínio já conectado e acessível (consulte `.env.example`). Canonical, imagem de compartilhamento, sitemap e dados estruturados usam essa mesma origem.

Se a prévia de compartilhamento apontar para um domínio antigo, remova ou corrija `SITE_URL` no painel do Netlify e faça um novo deploy. A imagem deve responder em `https://SEU-DOMINIO/og-image.png` com status 200 e tipo `image/png`.

Após publicar, cadastre o domínio no Google Search Console e envie `/sitemap.xml`. Caso utilize verificação por metatag, defina `GOOGLE_SITE_VERIFICATION` com o token fornecido pelo Google e refaça o build. Nenhum token fictício é incluído.

Os dados estruturados usam `Organization` e `Person`, sem inventar endereço comercial, horários, avaliações ou perfis sociais. A naturalidade do advogado não é utilizada como endereço de atendimento. Quando houver endereço comercial confirmado e publicado no site, será possível complementar a marcação local.

Indexação e posição nos resultados dependem do Google. Não foram adicionadas metatags de palavras-chave nem marcações de avaliações ou resultados garantidos.
