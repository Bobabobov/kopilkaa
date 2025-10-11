// components/ui/LucideIcons.tsx
"use client";
import {
  FileText,
  Shield,
  Heart,
  Users,
  DollarSign,
  BarChart3,
  Star,
  TrendingUp,
  Home,
  User,
  LogOut,
  Settings,
  Search,
  Menu,
  X,
  HelpCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Upload,
  Share2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Save,
  AlertCircle,
  Info,
  Check,
  XCircle,
  MessageCircle,
  CreditCard,
  Image,
  Send,
  BookOpen,
  ZoomIn,
  Edit3,
  Coins,
} from "lucide-react";

interface IconProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export const LucideIcons = {
  // Основные иконки для сайта
  Document: ({ className = "", size = "md" }: IconProps) => (
    <FileText className={`${sizeClasses[size]} ${className}`} />
  ),

  Money: ({ className = "", size = "md" }: IconProps) => (
    <DollarSign className={`${sizeClasses[size]} ${className}`} />
  ),

  DollarSign: ({ className = "", size = "md" }: IconProps) => (
    <DollarSign className={`${sizeClasses[size]} ${className}`} />
  ),

  Help: ({ className = "", size = "md" }: IconProps) => (
    <HelpCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  Friends: ({ className = "", size = "md" }: IconProps) => (
    <Users className={`${sizeClasses[size]} ${className}`} />
  ),

  Users: ({ className = "", size = "md" }: IconProps) => (
    <Users className={`${sizeClasses[size]} ${className}`} />
  ),

  Stats: ({ className = "", size = "md" }: IconProps) => (
    <BarChart3 className={`${sizeClasses[size]} ${className}`} />
  ),

  Heart: ({ className = "", size = "md" }: IconProps) => (
    <Heart className={`${sizeClasses[size]} ${className}`} />
  ),

  TrendingUp: ({ className = "", size = "md" }: IconProps) => (
    <TrendingUp className={`${sizeClasses[size]} ${className}`} />
  ),

  Shield: ({ className = "", size = "md" }: IconProps) => (
    <Shield className={`${sizeClasses[size]} ${className}`} />
  ),

  Star: ({ className = "", size = "md" }: IconProps) => (
    <Star className={`${sizeClasses[size]} ${className}`} />
  ),

  Home: ({ className = "", size = "md" }: IconProps) => (
    <Home className={`${sizeClasses[size]} ${className}`} />
  ),

  User: ({ className = "", size = "md" }: IconProps) => (
    <User className={`${sizeClasses[size]} ${className}`} />
  ),

  Logout: ({ className = "", size = "md" }: IconProps) => (
    <LogOut className={`${sizeClasses[size]} ${className}`} />
  ),

  Settings: ({ className = "", size = "md" }: IconProps) => (
    <Settings className={`${sizeClasses[size]} ${className}`} />
  ),

  Search: ({ className = "", size = "md" }: IconProps) => (
    <Search className={`${sizeClasses[size]} ${className}`} />
  ),

  Menu: ({ className = "", size = "md" }: IconProps) => (
    <Menu className={`${sizeClasses[size]} ${className}`} />
  ),

  Close: ({ className = "", size = "md" }: IconProps) => (
    <X className={`${sizeClasses[size]} ${className}`} />
  ),

  X: ({ className = "", size = "md" }: IconProps) => (
    <X className={`${sizeClasses[size]} ${className}`} />
  ),

  // Дополнительные иконки
  Check: ({ className = "", size = "md" }: IconProps) => (
    <Check className={`${sizeClasses[size]} ${className}`} />
  ),

  // Список
  List: ({ className = "", size = "md" }: IconProps) => (
    <FileText className={`${sizeClasses[size]} ${className}`} />
  ),

  // Файл
  File: ({ className = "", size = "md" }: IconProps) => (
    <FileText className={`${sizeClasses[size]} ${className}`} />
  ),

  // Сообщение
  MessageCircle: ({ className = "", size = "md" }: IconProps) => (
    <MessageCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  // Награда/трофей
  Award: ({ className = "", size = "md" }: IconProps) => (
    <Star className={`${sizeClasses[size]} ${className}`} />
  ),

  // Трофей
  Trophy: ({ className = "", size = "md" }: IconProps) => (
    <Star className={`${sizeClasses[size]} ${className}`} />
  ),

  // Медаль
  Medal: ({ className = "", size = "md" }: IconProps) => (
    <Star className={`${sizeClasses[size]} ${className}`} />
  ),

  // Бизнес/портфель
  Briefcase: ({ className = "", size = "md" }: IconProps) => (
    <FileText className={`${sizeClasses[size]} ${className}`} />
  ),

  // Реклама/мегафон
  Megaphone: ({ className = "", size = "md" }: IconProps) => (
    <HelpCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  // Целевая аудитория
  Target: ({ className = "", size = "md" }: IconProps) => (
    <Star className={`${sizeClasses[size]} ${className}`} />
  ),

  // Тренд/рост
  Trending: ({ className = "", size = "md" }: IconProps) => (
    <TrendingUp className={`${sizeClasses[size]} ${className}`} />
  ),

  CheckCircle: ({ className = "", size = "md" }: IconProps) => (
    <CheckCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  Clock: ({ className = "", size = "md" }: IconProps) => (
    <Clock className={`${sizeClasses[size]} ${className}`} />
  ),

  ArrowRight: ({ className = "", size = "md" }: IconProps) => (
    <ArrowRight className={`${sizeClasses[size]} ${className}`} />
  ),

  Plus: ({ className = "", size = "md" }: IconProps) => (
    <Plus className={`${sizeClasses[size]} ${className}`} />
  ),

  Minus: ({ className = "", size = "md" }: IconProps) => (
    <Minus className={`${sizeClasses[size]} ${className}`} />
  ),

  Edit: ({ className = "", size = "md" }: IconProps) => (
    <Edit className={`${sizeClasses[size]} ${className}`} />
  ),

  Edit3: ({ className = "", size = "md" }: IconProps) => (
    <Edit3 className={`${sizeClasses[size]} ${className}`} />
  ),

  Coin: ({ className = "", size = "md" }: IconProps) => (
    <Coins className={`${sizeClasses[size]} ${className}`} />
  ),

  Trash: ({ className = "", size = "md" }: IconProps) => (
    <Trash2 className={`${sizeClasses[size]} ${className}`} />
  ),

  Trash2: ({ className = "", size = "md" }: IconProps) => (
    <Trash2 className={`${sizeClasses[size]} ${className}`} />
  ),

  Eye: ({ className = "", size = "md" }: IconProps) => (
    <Eye className={`${sizeClasses[size]} ${className}`} />
  ),

  EyeOff: ({ className = "", size = "md" }: IconProps) => (
    <EyeOff className={`${sizeClasses[size]} ${className}`} />
  ),

  Mail: ({ className = "", size = "md" }: IconProps) => (
    <Mail className={`${sizeClasses[size]} ${className}`} />
  ),

  Phone: ({ className = "", size = "md" }: IconProps) => (
    <Phone className={`${sizeClasses[size]} ${className}`} />
  ),

  MapPin: ({ className = "", size = "md" }: IconProps) => (
    <MapPin className={`${sizeClasses[size]} ${className}`} />
  ),

  Calendar: ({ className = "", size = "md" }: IconProps) => (
    <Calendar className={`${sizeClasses[size]} ${className}`} />
  ),

  Download: ({ className = "", size = "md" }: IconProps) => (
    <Download className={`${sizeClasses[size]} ${className}`} />
  ),

  Upload: ({ className = "", size = "md" }: IconProps) => (
    <Upload className={`${sizeClasses[size]} ${className}`} />
  ),

  Share: ({ className = "", size = "md" }: IconProps) => (
    <Share2 className={`${sizeClasses[size]} ${className}`} />
  ),

  Copy: ({ className = "", size = "md" }: IconProps) => (
    <Copy className={`${sizeClasses[size]} ${className}`} />
  ),

  ExternalLink: ({ className = "", size = "md" }: IconProps) => (
    <ExternalLink className={`${sizeClasses[size]} ${className}`} />
  ),

  ChevronDown: ({ className = "", size = "md" }: IconProps) => (
    <ChevronDown className={`${sizeClasses[size]} ${className}`} />
  ),

  ChevronUp: ({ className = "", size = "md" }: IconProps) => (
    <ChevronUp className={`${sizeClasses[size]} ${className}`} />
  ),

  ChevronLeft: ({ className = "", size = "md" }: IconProps) => (
    <ChevronLeft className={`${sizeClasses[size]} ${className}`} />
  ),

  ChevronRight: ({ className = "", size = "md" }: IconProps) => (
    <ChevronRight className={`${sizeClasses[size]} ${className}`} />
  ),

  Filter: ({ className = "", size = "md" }: IconProps) => (
    <Filter className={`${sizeClasses[size]} ${className}`} />
  ),

  SortAsc: ({ className = "", size = "md" }: IconProps) => (
    <SortAsc className={`${sizeClasses[size]} ${className}`} />
  ),

  SortDesc: ({ className = "", size = "md" }: IconProps) => (
    <SortDesc className={`${sizeClasses[size]} ${className}`} />
  ),

  Refresh: ({ className = "", size = "md" }: IconProps) => (
    <RefreshCw className={`${sizeClasses[size]} ${className}`} />
  ),

  Save: ({ className = "", size = "md" }: IconProps) => (
    <Save className={`${sizeClasses[size]} ${className}`} />
  ),

  Alert: ({ className = "", size = "md" }: IconProps) => (
    <AlertCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  AlertCircle: ({ className = "", size = "md" }: IconProps) => (
    <AlertCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  Info: ({ className = "", size = "md" }: IconProps) => (
    <Info className={`${sizeClasses[size]} ${className}`} />
  ),

  XCircle: ({ className = "", size = "md" }: IconProps) => (
    <XCircle className={`${sizeClasses[size]} ${className}`} />
  ),

  CreditCard: ({ className = "", size = "md" }: IconProps) => (
    <CreditCard className={`${sizeClasses[size]} ${className}`} />
  ),

  Image: ({ className = "", size = "md" }: IconProps) => (
    <Image className={`${sizeClasses[size]} ${className}`} />
  ),

  Send: ({ className = "", size = "md" }: IconProps) => (
    <Send className={`${sizeClasses[size]} ${className}`} />
  ),

  BookOpen: ({ className = "", size = "md" }: IconProps) => (
    <BookOpen className={`${sizeClasses[size]} ${className}`} />
  ),

  ArrowLeft: ({ className = "", size = "md" }: IconProps) => (
    <ArrowLeft className={`${sizeClasses[size]} ${className}`} />
  ),

  ZoomIn: ({ className = "", size = "md" }: IconProps) => (
    <ZoomIn className={`${sizeClasses[size]} ${className}`} />
  ),

  FileText: ({ className = "", size = "md" }: IconProps) => (
    <FileText className={`${sizeClasses[size]} ${className}`} />
  ),

  HelpCircle: ({ className = "", size = "md" }: IconProps) => (
    <HelpCircle className={`${sizeClasses[size]} ${className}`} />
  ),
};
