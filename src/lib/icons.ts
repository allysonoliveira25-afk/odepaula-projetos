// ------------------------------------------------------------------
// Biblioteca de ícones disponíveis para os links (Lucide Icons).
// Usado tanto no site público quanto no seletor de ícones do painel
// administrativo. Adicionar um novo ícone aqui o torna disponível em
// toda a aplicação — nada fica fixo no código dos links.
// ------------------------------------------------------------------
import {
  Instagram,
  Youtube,
  MessageCircle,
  Link as LinkIcon,
  Music2,
  Mail,
  Ticket,
  CalendarDays,
  Globe,
  MapPin,
  Phone,
  ShoppingBag,
  PlayCircle,
  Star,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export const ICON_LIBRARY: Record<string, LucideIcon> = {
  instagram: Instagram,
  youtube: Youtube,
  whatsapp: MessageCircle,
  tiktok: Music2,
  link: LinkIcon,
  mail: Mail,
  ticket: Ticket,
  calendar: CalendarDays,
  globe: Globe,
  map: MapPin,
  phone: Phone,
  shop: ShoppingBag,
  play: PlayCircle,
  star: Star,
  users: Users,
  sparkles: Sparkles,
};

export const ICON_OPTIONS = Object.keys(ICON_LIBRARY);

export function getIcon(name: string): LucideIcon {
  return ICON_LIBRARY[name] ?? LinkIcon;
}
