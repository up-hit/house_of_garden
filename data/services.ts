import { ROUTES } from "@/lib/routes";
import type { ImageKey } from "./images";

export type IconName = "leaf" | "sprout" | "drop" | "wall" | "pot" | "home" | "building" | "tree" | "sun";

export type Faq = { q: string; a: string };
export type Offering = { title: string; text: string; icon: IconName };
export type Benefit = { title: string; text: string };

export type ServiceKey = "maintenance" | "landscaping" | "vertical" | "plants";

export type Service = {
  key: ServiceKey;
  path: string;
  /** Short label for navigation menus. */
  navLabel: string;
  /** Title and blurb for the homepage service card. */
  cardTitle: string;
  cardBlurb: string;
  /** <title> (the site name is appended by the layout template) and meta description. */
  metaTitle: string;
  metaDescription: string;
  /** Short name used in breadcrumbs and structured data. */
  serviceName: string;
  eyebrow: string;
  h1: string;
  intro: string;
  image: ImageKey;
  /** Extra image shown further down the page. */
  secondaryImage: ImageKey;
  /** Pre-filled WhatsApp message for this page. */
  waMessage: string;
  offerings: Offering[];
  benefits: Benefit[];
  faqs: Faq[];
  related: ServiceKey[];
};

export const services: Record<ServiceKey, Service> = {
  maintenance: {
    key: "maintenance",
    path: ROUTES.maintenance,
    navLabel: "Garden maintenance",
    cardTitle: "Garden maintenance & gardeners",
    cardBlurb: "Regular care for home, society, bungalow, office and hotel gardens.",
    metaTitle: "Garden Maintenance & Gardeners in Mumbai",
    metaDescription:
      "Gardener and mali services in Mumbai for homes, societies, bungalows, offices and hotels: regular maintenance, pruning, lawn and plant care.",
    serviceName: "Garden maintenance and gardener services",
    eyebrow: "Gardeners & mali services",
    h1: "Garden Maintenance & Gardener Services in Mumbai",
    intro:
      "Reliable, regular care for gardens of every size: a balcony or terrace, a society compound, a bungalow lawn, an office frontage or a hotel garden. Tell us about your space on WhatsApp and we'll suggest a maintenance routine that suits it.",
    image: "maintenance",
    secondaryImage: "residential",
    waMessage:
      "Hello House of Garden, I'd like to enquire about garden maintenance / gardener services in Mumbai.",
    offerings: [
      {
        title: "Gardener & mali services",
        text: "Dedicated gardener visits for watering, weeding, pruning, trimming and day-to-day upkeep of your plants and lawn.",
        icon: "sprout",
      },
      {
        title: "Home gardening",
        text: "Care for terrace, balcony and compound gardens, including potting and repotting, feeding, seasonal planting and replacing tired plants.",
        icon: "home",
      },
      {
        title: "Society & residential complexes",
        text: "Upkeep of common gardens, podium and entrance planting, lawns and hedges for housing societies and apartment complexes.",
        icon: "building",
      },
      {
        title: "Bungalow & villa gardens",
        text: "Lawn mowing, hedge shaping, and tree and shrub care for larger private gardens.",
        icon: "tree",
      },
      {
        title: "Office & hotel gardens",
        text: "Neat, well-kept planting for reception areas, courtyards, lobbies and hospitality spaces.",
        icon: "leaf",
      },
      {
        title: "Monsoon & seasonal care",
        text: "Care routines that allow for Mumbai's humid coastal climate and heavy monsoon: drainage checks, pruning and replacing plants that struggle.",
        icon: "drop",
      },
    ],
    benefits: [
      {
        title: "Consistent upkeep",
        text: "A regular visiting routine keeps lawns, hedges and plants looking their best through the year.",
      },
      {
        title: "Suited to Mumbai",
        text: "Plant care that takes humidity, coastal air and monsoon rain into account.",
      },
      {
        title: "One team for everything",
        text: "Maintenance, replacement plants, pots, soil and irrigation from a single provider.",
      },
      {
        title: "Planned around your space",
        text: "Visit schedules and scope are discussed around your garden rather than forced into a fixed package.",
      },
    ],
    faqs: [
      {
        q: "What kinds of gardens do you maintain?",
        a: "We look after home and terrace gardens, society and apartment-complex gardens, bungalow lawns, and office and hotel gardens across Mumbai.",
      },
      {
        q: "How often will a gardener visit?",
        a: "It depends on the size of the garden, the plants and the season. We agree a visit schedule with you after understanding your space.",
      },
      {
        q: "Can you replace plants or supply pots and soil?",
        a: "Yes. We also supply plants, pots, soil, cocopeat and compost, so replacements and refills can be handled together with maintenance.",
      },
      {
        q: "Do you look after irrigation systems?",
        a: "We install and service irrigation systems, including drip and sprinkler setups, so watering can be part of the same routine.",
      },
      {
        q: "How do I get started?",
        a: "Send us a WhatsApp message with your location and a few photos of the garden. We'll reply with the next steps.",
      },
    ],
    related: ["landscaping", "plants"],
  },

  landscaping: {
    key: "landscaping",
    path: ROUTES.landscaping,
    navLabel: "Landscaping & lawns",
    cardTitle: "Landscaping & lawns",
    cardBlurb: "Garden development, lawn installation and complete garden makeovers.",
    metaTitle: "Landscaping & Garden Development in Mumbai",
    metaDescription:
      "Landscaping contractors in Mumbai for garden development, lawn development and garden makeovers, with artificial grass, pebbles and planting.",
    serviceName: "Landscaping and garden development",
    eyebrow: "Landscaping contractors",
    h1: "Landscaping & Garden Development in Mumbai",
    intro:
      "From a bare plot to a finished garden: we plan, build and plant gardens for homes, societies, bungalows, offices and hotels. Share your space and your ideas on WhatsApp and we'll talk through what's possible.",
    image: "landscaping",
    secondaryImage: "makeover",
    waMessage:
      "Hello House of Garden, I'd like to enquire about landscaping / garden development in Mumbai.",
    offerings: [
      {
        title: "Garden development",
        text: "Layout, levelling, planting beds, paths and planting for new gardens and open plots.",
        icon: "tree",
      },
      {
        title: "Landscaping for societies & businesses",
        text: "Landscaping work for housing societies, offices and hospitality spaces, from podium gardens to entrance frontages.",
        icon: "building",
      },
      {
        title: "Lawn development",
        text: "Natural lawn laying and levelling, edging and establishment for gardens and compounds.",
        icon: "leaf",
      },
      {
        title: "Garden makeovers",
        text: "Refreshing tired or overgrown gardens with new planting, lawn repair, paths and finishing touches.",
        icon: "sprout",
      },
      {
        title: "Artificial grass & decorative pebbles",
        text: "Artificial grass for low-maintenance areas, and decorative pebbles for paths, borders and planters.",
        icon: "sun",
      },
      {
        title: "Irrigation for new gardens",
        text: "Drip and sprinkler irrigation planned in alongside the garden so new planting settles in well.",
        icon: "drop",
      },
    ],
    benefits: [
      {
        title: "Built around how you use the space",
        text: "Paths, seating areas and planting are arranged around the way you actually live in the garden.",
      },
      {
        title: "Plants chosen for Mumbai",
        text: "Planting that copes with humidity, coastal air and heavy monsoon rain.",
      },
      {
        title: "Low-maintenance options",
        text: "Artificial grass, pebbles and hardy planting for areas that need less upkeep.",
      },
      {
        title: "Ongoing care available",
        text: "Once the garden is built, our maintenance service can keep it looking its best.",
      },
    ],
    faqs: [
      {
        q: "Do you work on small gardens and terraces?",
        a: "Yes, we take on projects of different sizes, from home terraces to larger compounds. Send photos and the approximate area and we'll advise.",
      },
      {
        q: "Natural lawn or artificial grass: which is better?",
        a: "It depends on sunlight, how the space is used and how much upkeep you want. Natural lawns suit sunny, open areas; artificial grass suits shaded or low-use areas. We can advise once we see the space.",
      },
      {
        q: "Can you refresh an existing garden instead of rebuilding it?",
        a: "Yes. A makeover can keep what already works and renew the rest with new planting, lawn repair and finishing touches.",
      },
      {
        q: "Will you look after the garden once it's built?",
        a: "We offer regular garden maintenance for homes, societies, bungalows, offices and hotels, so the garden can stay in good shape.",
      },
      {
        q: "How do I get a quote?",
        a: "Message us on WhatsApp with your location, the size of the space and a few photos. We'll reply with the next steps.",
      },
    ],
    related: ["maintenance", "vertical"],
  },

  vertical: {
    key: "vertical",
    path: ROUTES.vertical,
    navLabel: "Vertical gardens & irrigation",
    cardTitle: "Vertical gardens & irrigation",
    cardBlurb: "Real and artificial green walls, hanging frames and irrigation systems.",
    metaTitle: "Vertical Gardens & Green Walls in Mumbai",
    metaDescription:
      "Vertical garden installation in Mumbai: real and artificial green walls, wall-mounted hanging plant frames, irrigation and self-watering systems.",
    serviceName: "Vertical gardens, green walls and irrigation",
    eyebrow: "Vertical gardens & irrigation",
    h1: "Vertical Gardens & Green Walls in Mumbai",
    intro:
      "Turn a blank wall into a green feature. We install real and artificial green walls, wooden hanging plant frames and the irrigation that keeps them thriving, for homes, balconies, offices, hotels and society entrances.",
    image: "vertical",
    secondaryImage: "irrigation",
    waMessage:
      "Hello House of Garden, I'd like to enquire about a vertical garden / green wall or irrigation in Mumbai.",
    offerings: [
      {
        title: "Real vertical gardens",
        text: "Living green walls with plants chosen for the light and exposure of your wall, set up with a suitable watering system.",
        icon: "wall",
      },
      {
        title: "Artificial green walls",
        text: "Low-maintenance, evergreen wall coverings for areas with little light or where regular watering isn't practical.",
        icon: "leaf",
      },
      {
        title: "Wooden hanging plant frames",
        text: "Wall-mounted wooden frames that hold a display of small potted and trailing plants, a compact option for balconies and small spaces.",
        icon: "pot",
      },
      {
        title: "Irrigation installation & servicing",
        text: "Drip and sprinkler irrigation for gardens, planters and green walls, plus servicing of existing systems.",
        icon: "drop",
      },
      {
        title: "Self-watering systems",
        text: "Self-watering pots and systems that keep plants evenly watered between visits.",
        icon: "drop",
      },
      {
        title: "Care for existing green walls",
        text: "Trimming, replacing plants and checking the irrigation on living walls that are already installed.",
        icon: "sprout",
      },
    ],
    benefits: [
      {
        title: "Greenery without floor space",
        text: "Walls, balconies and entrances become planted features without using up the floor.",
      },
      {
        title: "Real or artificial: your choice",
        text: "Pick living plants or a low-maintenance artificial finish depending on light, budget and upkeep.",
      },
      {
        title: "Irrigation designed in",
        text: "Watering is planned together with the wall, rather than added as an afterthought.",
      },
      {
        title: "A feature that stands out",
        text: "A green wall or hanging frame gives entrances, reception areas and balconies a distinctive look.",
      },
    ],
    faqs: [
      {
        q: "Should I choose a real or an artificial green wall?",
        a: "Real walls bring living plants and need regular watering and care. Artificial walls stay green with minimal upkeep and suit spots with little light. We can help you decide once we know the location.",
      },
      {
        q: "Does a real vertical garden need irrigation?",
        a: "Usually, yes. Plants on a wall dry out faster than plants in the ground, so a drip irrigation or self-watering setup is normally recommended.",
      },
      {
        q: "Can a vertical garden go on a balcony or terrace wall?",
        a: "Often it can. It depends on sunlight, wind and the wall itself, so send us photos and measurements and we'll advise.",
      },
      {
        q: "Do you service irrigation systems?",
        a: "We install and service irrigation systems. If yours was installed elsewhere, send us the details on WhatsApp and we'll advise what's needed.",
      },
      {
        q: "What are wooden hanging plant frames?",
        a: "Wall-mounted wooden frames with space for several small pots, a compact way to create a plant display on a balcony or interior wall.",
      },
    ],
    related: ["landscaping", "plants"],
  },

  plants: {
    key: "plants",
    path: ROUTES.plants,
    navLabel: "Plants, pots & soil",
    cardTitle: "Plants, pots & soil",
    cardBlurb: "Plant nursery supply, pots, soil, cocopeat, compost and potting mix.",
    metaTitle: "Plant Nursery, Pots & Soil in Mumbai",
    metaDescription:
      "Plant nursery supply in Mumbai: plants, fibre and plastic pots, soil, cocopeat, compost, cow dung manure and potting mix. Check availability on WhatsApp.",
    serviceName: "Plant nursery, pots and gardening supplies",
    eyebrow: "Plant nursery & supplies",
    h1: "Plants, Pots & Soil Supplies in Mumbai",
    intro:
      "Everything to start or refresh a garden: healthy plants, pots and planters, and the soil, cocopeat, compost and manures that help them grow. Stock varies, so message us on WhatsApp to check availability.",
    image: "pots",
    secondaryImage: "soil",
    waMessage:
      "Hello House of Garden, I'd like to check availability of plants, pots or soil supplies in Mumbai.",
    offerings: [
      {
        title: "Plant nursery & plant supply",
        text: "Indoor and outdoor plants for homes, balconies, offices and gardens, subject to availability.",
        icon: "sprout",
      },
      {
        title: "Fibre & fibreglass pots",
        text: "Lightweight, durable fibre and fiberglass pots and planters in a range of shapes and sizes.",
        icon: "pot",
      },
      {
        title: "Plastic & other pots",
        text: "Plastic pots and other available planters for everyday planting and balconies.",
        icon: "pot",
      },
      {
        title: "Soil & potting mix",
        text: "Garden soil and ready-to-use potting mix for pots, planters and raised beds.",
        icon: "leaf",
      },
      {
        title: "Cocopeat, compost & cow dung manure",
        text: "Cocopeat, compost and cow dung manure to improve soil structure and feed plants.",
        icon: "leaf",
      },
      {
        title: "Organic bio inputs",
        text: "Organic bio inputs for soil health and plant care.",
        icon: "sprout",
      },
      {
        title: "Self-watering pots & systems",
        text: "Self-watering options that help keep plants watered when you're busy or away.",
        icon: "drop",
      },
    ],
    benefits: [
      {
        title: "Plants and supplies together",
        text: "Pick up plants, pots, soil and feed in one place instead of sourcing them separately.",
      },
      {
        title: "Matched to your space",
        text: "Tell us about the light, space and pots you have and we'll suggest suitable options.",
      },
      {
        title: "For new and existing gardens",
        text: "Supplies for starting a balcony garden, refilling pots or topping up large garden beds.",
      },
      {
        title: "Backed by our garden team",
        text: "Need help planting or arranging? Our gardening services can take care of it.",
      },
    ],
    faqs: [
      {
        q: "Can I check stock and prices before ordering?",
        a: "Yes. Message us on WhatsApp with what you need and we'll confirm availability and pricing.",
      },
      {
        q: "Which soil or potting mix should I use?",
        a: "It depends on the plant and the pot. Potting mix, cocopeat and compost do different jobs, so tell us what you're growing and we'll suggest a mix.",
      },
      {
        q: "Do you supply cow dung manure and compost?",
        a: "Yes, we supply compost, cow dung manure, cocopeat and organic bio inputs. Availability varies, so check with us on WhatsApp.",
      },
      {
        q: "Can you supply plants for societies and offices?",
        a: "Yes. For larger quantities or planting schemes, message us with the details and we'll advise.",
      },
      {
        q: "Can you pot and arrange plants for me?",
        a: "Our gardening team can handle potting, arranging and ongoing care. See our garden maintenance services for details.",
      },
    ],
    related: ["maintenance", "vertical"],
  },
};

export const serviceList: Service[] = [
  services.maintenance,
  services.landscaping,
  services.vertical,
  services.plants,
];

export function getRelated(service: Service): Service[] {
  return service.related.map((k) => services[k]);
}
