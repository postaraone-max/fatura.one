export type PricingPlanId = "starter" | "campaign" | "pro";

export type PricingPlan = {
  id: PricingPlanId;
  badge?: string;
  name: string;
  tagline: string;
  bullets: string[];
  cta?: string;
};

export type PricingFaqItem = {
  question: string;
  answer: string;
};

export type PricingContent = {
  sectionSubtitle: string;
  plans: PricingPlan[];
  faq: PricingFaqItem[];
};

export const pricingSv: PricingContent = {
  sectionSubtitle:
    "Börja enkelt och skala upp när din kommunikation, dina följare och dina kampanjer växer.",
  plans: [
    {
      id: "starter",
      badge: "För mindre team",
      name: "Starter",
      tagline:
        "För små företag och lokala kampanjer som vill samla allt postande på ett ställe.",
      bullets: [
        "Schemalägg inlägg till flera kanaler med ett klick",
        "AI-förslag på texter (beta) + enkel historik",
      ],
      cta: "Välj Starter",
    },
    {
      id: "campaign",
      name: "Campaign",
      tagline:
        "För kampanjer och växande varumärken som kommunicerar varje vecka.",
      bullets: [
        "Högre antal schemalagda inlägg per månad",
        "Spara och återanvänd dina viktigaste kampanjbudskap",
      ],
      cta: "Välj Campaign",
    },
    {
      id: "pro",
      badge: "För större organisationer",
      name: "Pro",
      tagline:
        "För byråer och organisationer som hanterar flera varumärken samtidigt.",
      bullets: [
        "Byggt för flera varumärken och projekt i samma konto",
        "Prioritet för input på nya analysfunktioner och features",
      ],
      cta: "Kontakta oss",
    },
  ],
  faq: [
    {
      question: "Kan jag avsluta när som helst?",
      answer:
        "Ja. Du kan avsluta när du vill och använder planen tills nuvarande betalperiod är slut.",
    },
    {
      question: "Behöver jag betalkort för att komma igång?",
      answer: "Ja. Betalningar hanteras säkert via Stripe.",
    },
    {
      question: "Finns det bindningstid?",
      answer:
        "Inte just nu. Du kan börja på den lägsta planen och uppgradera bara om Postara sparar tid åt dig.",
    },
    {
      question: "Kan jag byta plan senare?",
      answer:
        "Ja. Du kan upp- eller nedgradera mellan planer. Ändringen gäller från nästa faktureringsperiod.",
    },
    {
      question: "Vem äger innehållet vi publicerar?",
      answer:
        "Du äger allt innehåll. Postara hjälper bara till att schemalägga och publicera det.",
    },
  ],
};

export const pricingEn: PricingContent = {
  sectionSubtitle:
    "Start simple and scale up as your communication, followers, and campaigns grow.",
  plans: [
    {
      id: "starter",
      badge: "For smaller teams",
      name: "Starter",
      tagline:
        "For small businesses and local campaigns that want everything in one place.",
      bullets: [
        "Schedule posts to multiple channels with one click",
        "AI caption suggestions (beta) + simple history",
      ],
      cta: "Choose Starter",
    },
    {
      id: "campaign",
      name: "Campaign",
      tagline: "For campaigns and growing brands that post every week.",
      bullets: [
        "Higher number of scheduled posts per month",
        "Save and reuse your most important campaign messages",
      ],
      cta: "Choose Campaign",
    },
    {
      id: "pro",
      badge: "For larger organisations",
      name: "Pro",
      tagline:
        "For agencies and organisations managing multiple brands and projects.",
      bullets: [
        "Built for multiple brands and projects in one account",
        "Priority input on upcoming analytics and features",
      ],
      cta: "Contact us",
    },
  ],
  faq: [
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes. You can cancel whenever you want and keep access until the current billing period ends.",
    },
    {
      question: "Do I need a card to get started?",
      answer: "Yes. Payments are handled securely via Stripe.",
    },
    {
      question: "Is there a binding period?",
      answer:
        "Not right now. Start with the lowest plan and upgrade only if Postara saves you time.",
    },
    {
      question: "Can I change plan later?",
      answer:
        "Yes. You can upgrade or downgrade between plans. The change takes effect from the next billing period.",
    },
    {
      question: "Who owns the content we publish?",
     answer:
        "You own all content. Postara only helps schedule and publish it.",
    },
  ],
};
