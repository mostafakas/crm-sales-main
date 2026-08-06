import {
  type LucideIcon,
  type LucideProps,
  Home,
  Users,
  MessageSquare,
  Briefcase,
  FileText,
  ShieldCheck,
  Settings,
  Activity,
  LogOut,
  Plus,
  UserPlus,
  BarChart3,
  Eye,
  EyeOff,
  Search,
  ChevronDown,
  X,
  Download,
  ArrowUpRight,
  Palette,
  Edit2,
  PartyPopper,
  Trash2,
  Clock,
  Bell,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Check,
  Shield,
  Phone,
  Video,
  Building2,
  Megaphone,
  User,
  Mail,
  Smile,
  Paperclip,
  Send,
  AlertCircle,
  Calendar,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  logo: (props: LucideProps) => (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="40" rx="8" fill="#0047FF" />
      <path
        d="M8 30L20 10L32 30"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13 23H27" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  authBrand: (props: LucideProps) => (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="40" height="40" rx="8" fill="#0047FF" />
      <path d="M12 28V12H16L22 22V12H26V28H22L16 18V28H12Z" fill="white" />
    </svg>
  ),
  home: Home,
  users: Users,
  messages: MessageSquare,
  departments: Briefcase,
  documents: FileText,
  roles: ShieldCheck,
  settings: Settings,
  activity: Activity,
  logout: LogOut,
  plus: Plus,
  userPlus: UserPlus,
  chart: BarChart3,
  eye: Eye,
  eyeOff: EyeOff,
  search: Search,
  chevronDown: ChevronDown,
  close: X,
  download: Download,
  arrowUpRight: ArrowUpRight,
  palette: Palette,
  edit: Edit2,
  party: PartyPopper,
  trash: Trash2,
  clock: Clock,
  bell: Bell,
  cpu: Cpu,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  maximize: Maximize2,
  check: Check,
  shield: Shield,
  phone: Phone,
  video: Video,
  building: Building2,
  megaphone: Megaphone,
  user: User,
  mail: Mail,
  smile: Smile,
  paperclip: Paperclip,
  send: Send,
  alert: AlertCircle,
  calendar: Calendar,
};
