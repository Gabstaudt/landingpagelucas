export const siteUrl = new URL(process.env.SITE_URL || "https://lrferreira.adv.br").origin;
export const siteName = "L R Ferreira Advocacia";
export const siteTitle = "L R Ferreira Advocacia | Lucas Ruan Ferreira Gomes";
export const siteDescription = "Advocacia e consultoria jurídica para pessoas e empresas. Conheça Lucas Ruan Ferreira Gomes, OAB/PA 43.942, e agende seu atendimento.";

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#escritorio`,
      name: siteName,
      alternateName: "L R Ferreira",
      url: siteUrl,
      description: siteDescription,
      logo: { "@type": "ImageObject", url: `${siteUrl}/assets/brand/logo-seo.png`, width: 512, height: 512 },
      image: `${siteUrl}/og-image.png`,
      email: "lrferreira.adv@outlook.com",
      telephone: "+5591991831921",
      founder: { "@id": `${siteUrl}/#advogado` },
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "Atendimento jurídico",
        telephone: "+5591991831921",
        email: "lrferreira.adv@outlook.com",
        availableLanguage: "pt-BR",
        url: "https://wa.me/5591991831921"
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Áreas de atuação",
        itemListElement: ["Direito Civil", "Direito de Família e Sucessões", "Direito do Consumidor", "Direito do Trabalho", "Direito Empresarial", "Direito Tributário"].map(name => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, provider: { "@id": `${siteUrl}/#escritorio` } }
        }))
      }
    },
    {
      "@type": "Person",
      "@id": `${siteUrl}/#advogado`,
      name: "Lucas Ruan Ferreira Gomes",
      jobTitle: "Advogado",
      url: `${siteUrl}/#sobre`,
      image: `${siteUrl}/lucas/fotolucas.jpg`,
      alumniOf: { "@type": "EducationalOrganization", name: "UNAMA" },
      identifier: { "@type": "PropertyValue", propertyID: "OAB/PA", value: "43.942" },
      worksFor: { "@id": `${siteUrl}/#escritorio` }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      inLanguage: "pt-BR",
      publisher: { "@id": `${siteUrl}/#escritorio` }
    },
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      inLanguage: "pt-BR",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: [{ "@id": `${siteUrl}/#escritorio` }, { "@id": `${siteUrl}/#advogado` }],
      primaryImageOfPage: { "@type": "ImageObject", url: `${siteUrl}/og-image.png`, width: 1200, height: 630 }
    }
  ]
};
