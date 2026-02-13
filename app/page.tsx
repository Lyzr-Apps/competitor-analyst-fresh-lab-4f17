'use client'

import { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  RiDashboardLine,
  RiFileTextLine,
  RiGroupLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiAddLine,
  RiCloseLine,
  RiSendPlaneLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiBarChartLine,
  RiTrendingUpLine,
  RiLightbulbLine,
  RiTimeLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiMailLine,
  RiChat3Line,
  RiArrowLeftLine,
  RiRefreshLine,
  RiEyeLine,
  RiCompassLine,
  RiArrowRightSLine,
  RiPulseLine,
  RiStackLine,
  RiDeleteBinLine,
} from 'react-icons/ri'

const MANAGER_AGENT_ID = '698f04b7e3e5b5e3c4815d1e'
const DISTRIBUTION_AGENT_ID = '698f04d629d2085311337211'

// --- TypeScript Interfaces ---

interface CompetitorActivity {
  category: string
  title: string
  description: string
  date: string
  impact: string
  source: string
  confidence: number
}

interface Competitor {
  name: string
  activities: CompetitorActivity[]
  threat_level: string
  summary: string
}

interface MetricComparison {
  metric_name: string
  our_value: string
  competitor_values: { competitor: string; value: string; variance: string }[]
  gap_level: string
  trend: string
}

interface BenchmarkingRecommendation {
  priority: string
  action: string
  expected_impact: string
  timeframe: string
}

interface Benchmarking {
  competitive_position_score: number
  metrics_comparison: MetricComparison[]
  strengths: string[]
  weaknesses: string[]
  recommendations: BenchmarkingRecommendation[]
  summary: string
}

interface Trend {
  name: string
  category: string
  description: string
  maturity: string
  impact: string
  time_horizon: string
  confidence: number
  implications: string
  opportunities: string
}

interface ConvergencePattern {
  pattern: string
  involved_trends: string[]
  strategic_implication: string
}

interface TrendAnalysis {
  trends: Trend[]
  convergence_patterns: ConvergencePattern[]
  disruptive_forces: string[]
  strategic_summary: string
}

interface StrategicRecommendation {
  priority: string
  action: string
  rationale: string
  expected_impact: string
  timeframe: string
}

interface ReportData {
  executive_summary: string
  overall_position: string
  urgency_level: string
  confidence_score: number
  market_intelligence: {
    competitors: Competitor[]
    market_overview: string
    key_trends: string[]
  }
  benchmarking: Benchmarking
  trend_analysis: TrendAnalysis
  strategic_recommendations: StrategicRecommendation[]
  generated_date: string
  competitors_analyzed: string[]
}

interface DistributionResult {
  email_status: string
  slack_status: string
  recipients: string[]
  slack_channel: string
  timestamp: string
  summary: string
}

interface StoredReport {
  id: string
  data: ReportData
  createdAt: string
  competitors: string[]
}

// --- Sample Data ---

const SAMPLE_REPORT: ReportData = {
  executive_summary: 'The competitive landscape in the enterprise SaaS market shows increasing consolidation among top players. Our market position remains strong but faces growing pressure from emerging AI-native competitors. Key areas requiring immediate attention include product differentiation in AI capabilities and expansion into adjacent verticals. Overall market growth of 18% YoY presents opportunities for strategic repositioning.',
  overall_position: 'Strong Challenger',
  urgency_level: 'High',
  confidence_score: 82,
  market_intelligence: {
    competitors: [
      {
        name: 'TechCorp AI',
        activities: [
          {
            category: 'Product Launch',
            title: 'AI Assistant Suite Release',
            description: 'TechCorp launched an integrated AI assistant platform targeting enterprise workflows with automated task management and predictive analytics.',
            date: '2025-01-15',
            impact: 'High',
            source: 'Press Release',
            confidence: 95,
          },
          {
            category: 'Partnership',
            title: 'Strategic Cloud Partnership',
            description: 'Signed multi-year partnership with major cloud provider for native integration.',
            date: '2025-01-10',
            impact: 'Medium',
            source: 'Industry Report',
            confidence: 88,
          },
        ],
        threat_level: 'High',
        summary: 'TechCorp continues aggressive expansion with AI-first strategy. Recent product launches and partnerships signal intent to dominate enterprise AI market.',
      },
      {
        name: 'DataFlow Inc',
        activities: [
          {
            category: 'Acquisition',
            title: 'Analytics Startup Acquisition',
            description: 'Acquired real-time analytics startup for $120M to enhance data processing capabilities.',
            date: '2025-01-08',
            impact: 'High',
            source: 'SEC Filing',
            confidence: 100,
          },
        ],
        threat_level: 'Medium',
        summary: 'DataFlow is building capabilities through acquisitions. Focus remains on data infrastructure rather than direct competition in our core market.',
      },
      {
        name: 'CloudNext Solutions',
        activities: [
          {
            category: 'Market Expansion',
            title: 'APAC Market Entry',
            description: 'Opened offices in Singapore and Tokyo, targeting enterprise clients in the APAC region.',
            date: '2025-01-12',
            impact: 'Medium',
            source: 'News Article',
            confidence: 85,
          },
        ],
        threat_level: 'Low',
        summary: 'CloudNext is expanding geographically but not yet a direct threat in our primary markets. Monitor for potential overlap in APAC.',
      },
    ],
    market_overview: 'The enterprise SaaS market continues to grow at 18% annually, driven primarily by AI integration demand and cloud migration. Key themes include AI-native workflows, vertical-specific solutions, and consolidated platforms. The market is seeing increased M&A activity with 23 significant acquisitions in Q4 alone.',
    key_trends: [
      'AI-native product design becoming table stakes',
      'Vertical SaaS solutions gaining traction over horizontal platforms',
      'Platform consolidation driving bundled pricing strategies',
      'Data privacy regulations influencing product architecture',
      'Open-source alternatives creating downward pricing pressure',
    ],
  },
  benchmarking: {
    competitive_position_score: 72,
    metrics_comparison: [
      {
        metric_name: 'Revenue Growth',
        our_value: '22%',
        competitor_values: [
          { competitor: 'TechCorp AI', value: '35%', variance: '-13%' },
          { competitor: 'DataFlow Inc', value: '18%', variance: '+4%' },
          { competitor: 'CloudNext Solutions', value: '25%', variance: '-3%' },
        ],
        gap_level: 'Moderate',
        trend: 'improving',
      },
      {
        metric_name: 'Market Share',
        our_value: '12%',
        competitor_values: [
          { competitor: 'TechCorp AI', value: '24%', variance: '-12%' },
          { competitor: 'DataFlow Inc', value: '15%', variance: '-3%' },
          { competitor: 'CloudNext Solutions', value: '8%', variance: '+4%' },
        ],
        gap_level: 'Significant',
        trend: 'stable',
      },
      {
        metric_name: 'NPS Score',
        our_value: '68',
        competitor_values: [
          { competitor: 'TechCorp AI', value: '72', variance: '-4' },
          { competitor: 'DataFlow Inc', value: '61', variance: '+7' },
          { competitor: 'CloudNext Solutions', value: '65', variance: '+3' },
        ],
        gap_level: 'Minor',
        trend: 'improving',
      },
      {
        metric_name: 'User Growth',
        our_value: '30%',
        competitor_values: [
          { competitor: 'TechCorp AI', value: '42%', variance: '-12%' },
          { competitor: 'DataFlow Inc', value: '20%', variance: '+10%' },
          { competitor: 'CloudNext Solutions', value: '28%', variance: '+2%' },
        ],
        gap_level: 'Moderate',
        trend: 'improving',
      },
    ],
    strengths: [
      'Superior customer support with 98% satisfaction rating',
      'Strong developer ecosystem with 5,000+ integrations',
      'Market-leading uptime of 99.99%',
      'Competitive pricing for mid-market segment',
    ],
    weaknesses: [
      'AI capabilities lagging behind TechCorp by 6-12 months',
      'Limited presence in APAC markets',
      'Enterprise sales cycle 20% longer than industry average',
      'Brand awareness gap in emerging markets',
    ],
    recommendations: [
      {
        priority: 'Critical',
        action: 'Accelerate AI feature roadmap',
        expected_impact: 'Close competitive gap with TechCorp within 6 months',
        timeframe: 'Q1-Q2 2025',
      },
      {
        priority: 'High',
        action: 'Establish APAC partnerships',
        expected_impact: 'Capture 5% APAC market share within 12 months',
        timeframe: 'Q2 2025',
      },
    ],
    summary: 'Our competitive position is solid in core markets but faces erosion from AI-native competitors. Immediate action needed on AI capabilities and geographic expansion to maintain trajectory.',
  },
  trend_analysis: {
    trends: [
      {
        name: 'AI-Native Workflows',
        category: 'Technology',
        description: 'Enterprise software shifting from AI-augmented to AI-native design, where AI is the primary interface rather than an add-on.',
        maturity: 'Growth',
        impact: 'Transformational',
        time_horizon: '1-2 years',
        confidence: 90,
        implications: 'Requires fundamental rethinking of product architecture. Companies that delay risk becoming legacy.',
        opportunities: 'First-mover advantage in AI-native enterprise workflows could capture significant market share.',
      },
      {
        name: 'Vertical SaaS Specialization',
        category: 'Market',
        description: 'Growing preference for industry-specific solutions over general-purpose platforms.',
        maturity: 'Mature',
        impact: 'High',
        time_horizon: '0-1 years',
        confidence: 85,
        implications: 'Horizontal platforms must develop vertical capabilities or partner with specialists.',
        opportunities: 'Vertical-specific modules could increase average deal size by 40%.',
      },
      {
        name: 'Composable Architecture',
        category: 'Technology',
        description: 'Move towards modular, API-first architectures that allow customers to compose their own solutions.',
        maturity: 'Emerging',
        impact: 'Medium',
        time_horizon: '2-3 years',
        confidence: 75,
        implications: 'Monolithic platforms will lose ground to composable alternatives.',
        opportunities: 'Building a composable platform could attract developer-led adoption.',
      },
    ],
    convergence_patterns: [
      {
        pattern: 'AI + Vertical Specialization',
        involved_trends: ['AI-Native Workflows', 'Vertical SaaS Specialization'],
        strategic_implication: 'AI capabilities tailored to specific industries will command premium pricing and create strong moats.',
      },
      {
        pattern: 'Composable + AI Infrastructure',
        involved_trends: ['Composable Architecture', 'AI-Native Workflows'],
        strategic_implication: 'Modular AI components that can be assembled into industry-specific workflows represent the next platform paradigm.',
      },
    ],
    disruptive_forces: [
      'Open-source AI models reducing barriers to entry',
      'Regulatory changes in EU and APAC affecting data handling',
      'Economic uncertainty driving demand for consolidated, cost-effective solutions',
    ],
    strategic_summary: 'The convergence of AI-native design and vertical specialization represents the dominant market direction. Companies must invest in both simultaneously to remain competitive. The composable architecture trend provides a strategic framework for delivering vertical AI solutions at scale.',
  },
  strategic_recommendations: [
    {
      priority: 'Critical',
      action: 'Launch AI-native product tier',
      rationale: 'TechCorp\'s AI suite is gaining rapid adoption. Delay beyond Q2 risks permanent market share loss.',
      expected_impact: 'Retain existing enterprise clients and capture 8% new market share in AI-native segment.',
      timeframe: 'Q1-Q2 2025',
    },
    {
      priority: 'High',
      action: 'Develop healthcare and fintech vertical modules',
      rationale: 'Vertical SaaS trend is mature. These verticals show highest willingness to pay for specialized solutions.',
      expected_impact: 'Increase average deal size by 35% in target verticals.',
      timeframe: 'Q2-Q3 2025',
    },
    {
      priority: 'Medium',
      action: 'Establish strategic partnerships in APAC',
      rationale: 'CloudNext\'s APAC expansion creates urgency. Local partners can accelerate market entry.',
      expected_impact: 'Establish presence in 3 key APAC markets within 12 months.',
      timeframe: 'Q2-Q4 2025',
    },
    {
      priority: 'Medium',
      action: 'Open-source developer tools program',
      rationale: 'Counter open-source disruption by embracing community-driven development for non-core features.',
      expected_impact: 'Grow developer community by 150% and reduce build costs by 20%.',
      timeframe: 'Q3-Q4 2025',
    },
  ],
  generated_date: '2025-01-20T14:30:00Z',
  competitors_analyzed: ['TechCorp AI', 'DataFlow Inc', 'CloudNext Solutions'],
}

// --- Utility Functions ---

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## '))
          return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# '))
          return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line))
          return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm leading-relaxed">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

function getThreatColor(level: string): string {
  const l = (level ?? '').toLowerCase()
  if (l === 'high' || l === 'critical') return 'bg-red-100 text-red-800 border-red-200'
  if (l === 'medium' || l === 'moderate') return 'bg-amber-100 text-amber-800 border-amber-200'
  if (l === 'low' || l === 'minor') return 'bg-emerald-100 text-emerald-800 border-emerald-200'
  return 'bg-secondary text-secondary-foreground'
}

function getPriorityColor(priority: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p === 'critical') return 'bg-red-600 text-white'
  if (p === 'high') return 'bg-orange-500 text-white'
  if (p === 'medium') return 'bg-amber-500 text-white'
  if (p === 'low') return 'bg-emerald-500 text-white'
  return 'bg-primary text-primary-foreground'
}

function getGapColor(level: string): string {
  const g = (level ?? '').toLowerCase()
  if (g === 'significant' || g === 'critical') return 'text-red-600'
  if (g === 'moderate' || g === 'medium') return 'text-amber-600'
  if (g === 'minor' || g === 'low') return 'text-emerald-600'
  return 'text-foreground'
}

function getVarianceDisplay(variance: string) {
  if (!variance) return { color: 'text-muted-foreground', isPositive: false }
  const v = variance.replace('%', '')
  const num = parseFloat(v)
  if (isNaN(num)) return { color: 'text-muted-foreground', isPositive: false }
  if (num > 0) return { color: 'text-emerald-600', isPositive: true }
  if (num < 0) return { color: 'text-red-600', isPositive: false }
  return { color: 'text-muted-foreground', isPositive: false }
}

function getImpactColor(impact: string): string {
  const i = (impact ?? '').toLowerCase()
  if (i === 'transformational' || i === 'high') return 'bg-purple-100 text-purple-800 border-purple-200'
  if (i === 'medium') return 'bg-blue-100 text-blue-800 border-blue-200'
  if (i === 'low') return 'bg-slate-100 text-slate-800 border-slate-200'
  return 'bg-secondary text-secondary-foreground'
}

// --- Sub-Components ---

function SidebarNav({ activeView, onNavigate }: { activeView: string; onNavigate: (v: 'dashboard' | 'report' | 'library') => void }) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: RiDashboardLine },
    { id: 'report' as const, label: 'Report View', icon: RiFileTextLine },
    { id: 'library' as const, label: 'Reports Library', icon: RiStackLine },
  ]

  return (
    <div className="w-64 min-h-screen bg-card/80 backdrop-blur-xl border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <RiCompassLine className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-lg tracking-tight text-foreground">CI Hub</h1>
            <p className="text-xs text-muted-foreground">Competitive Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="p-3 rounded-xl bg-secondary/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">Powered by AI Agents</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-foreground">Intelligence Manager</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-foreground">Report Distribution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompetitorCard({ competitor }: { competitor: Competitor }) {
  const activities = Array.isArray(competitor?.activities) ? competitor.activities : []
  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold font-serif">{competitor?.name ?? 'Unknown'}</CardTitle>
          <Badge className={`text-xs ${getThreatColor(competitor?.threat_level ?? '')}`}>
            {competitor?.threat_level ?? 'N/A'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{competitor?.summary ?? ''}</p>
        {activities.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Recent Activity</p>
            {activities.slice(0, 2).map((act, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs">
                <Badge variant="outline" className="text-xs shrink-0">{act?.category ?? ''}</Badge>
                <span className="text-muted-foreground">{act?.title ?? ''}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MetricCard({ metric }: { metric: MetricComparison }) {
  const competitorValues = Array.isArray(metric?.competitor_values) ? metric.competitor_values : []
  const trendVal = (metric?.trend ?? '').toLowerCase()
  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold font-serif">{metric?.metric_name ?? ''}</CardTitle>
          <div className="flex items-center gap-1">
            {trendVal === 'improving' && <RiArrowUpLine className="w-4 h-4 text-emerald-600" />}
            {trendVal === 'declining' && <RiArrowDownLine className="w-4 h-4 text-red-600" />}
            {trendVal === 'stable' && <RiArrowRightSLine className="w-4 h-4 text-amber-600" />}
            <span className={`text-xs font-medium ${getGapColor(metric?.gap_level ?? '')}`}>{metric?.gap_level ?? ''}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <span className="text-xs text-muted-foreground">Our Value</span>
          <p className="text-xl font-bold text-primary">{metric?.our_value ?? '-'}</p>
        </div>
        <div className="space-y-1.5">
          {competitorValues.map((cv, idx) => {
            const vd = getVarianceDisplay(cv?.variance ?? '')
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{cv?.competitor ?? ''}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{cv?.value ?? '-'}</span>
                  <span className={`font-medium ${vd.color}`}>
                    {vd.isPositive && <RiArrowUpLine className="inline w-3 h-3" />}
                    {!vd.isPositive && cv?.variance && <RiArrowDownLine className="inline w-3 h-3" />}
                    {cv?.variance ?? ''}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function InsightItem({ text, index }: { text: string; index: number }) {
  const categories = ['Market', 'Technology', 'Strategy', 'Operations', 'Finance']
  const cat = categories[index % categories.length]
  return (
    <div className="p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-2">
        <RiLightbulbLine className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <div className="flex-1">
          <Badge variant="secondary" className="text-xs mb-1.5">{cat}</Badge>
          <p className="text-xs text-foreground leading-relaxed">{text ?? ''}</p>
        </div>
      </div>
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-96 bg-card/90 backdrop-blur-xl shadow-2xl border-border/60">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Spinner className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h3 className="font-serif font-semibold text-lg mb-2">Analyzing Competitive Landscape</h3>
          <p className="text-sm text-muted-foreground mb-4">Our AI agents are gathering market intelligence, benchmarking metrics, and identifying trends...</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Spinner className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Collecting market data</span>
            </div>
            <div className="flex items-center gap-3">
              <Spinner className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Benchmarking performance</span>
            </div>
            <div className="flex items-center gap-3">
              <Spinner className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Identifying trends</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardView({
  report,
  competitors,
  setCompetitors,
  metrics,
  setMetrics,
  context,
  setContext,
  onGenerate,
  isAnalyzing,
  showSample,
  competitorInput,
  setCompetitorInput,
  error,
}: {
  report: ReportData | null
  competitors: string[]
  setCompetitors: (c: string[]) => void
  metrics: { revenue: string; marketShare: string; nps: string; userGrowth: string }
  setMetrics: React.Dispatch<React.SetStateAction<{ revenue: string; marketShare: string; nps: string; userGrowth: string }>>
  context: string
  setContext: (c: string) => void
  onGenerate: () => void
  isAnalyzing: boolean
  showSample: boolean
  competitorInput: string
  setCompetitorInput: (v: string) => void
  error: string | null
}) {
  const displayData = showSample ? SAMPLE_REPORT : report
  const displayCompetitors = showSample && competitors.length === 0 ? SAMPLE_REPORT.competitors_analyzed : competitors

  const competitorsArr = Array.isArray(displayData?.market_intelligence?.competitors) ? displayData.market_intelligence.competitors : []
  const metricsArr = Array.isArray(displayData?.benchmarking?.metrics_comparison) ? displayData.benchmarking.metrics_comparison : []
  const keyTrends = Array.isArray(displayData?.market_intelligence?.key_trends) ? displayData.market_intelligence.key_trends : []

  const handleAddCompetitor = () => {
    const trimmed = competitorInput.trim()
    if (trimmed && !competitors.includes(trimmed)) {
      setCompetitors([...competitors, trimmed])
      setCompetitorInput('')
    }
  }

  const handleRemoveCompetitor = (name: string) => {
    setCompetitors(competitors.filter((c) => c !== name))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddCompetitor()
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 pb-28 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">Central command for competitive intelligence</p>
          </div>
          {displayData && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1.5">
                <RiShieldCheckLine className="w-3.5 h-3.5" />
                Confidence: {displayData?.confidence_score ?? 0}%
              </Badge>
              <Badge className={getThreatColor(displayData?.urgency_level ?? '')}>
                Urgency: {displayData?.urgency_level ?? 'N/A'}
              </Badge>
            </div>
          )}
        </div>

        {/* Executive Summary Banner */}
        {displayData?.executive_summary && (
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-md">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <RiPulseLine className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-serif font-semibold text-sm mb-1">Executive Summary</h3>
                  <div className="text-sm text-foreground leading-relaxed">{renderMarkdown(displayData.executive_summary)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Three-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Competitor Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RiGroupLine className="w-4 h-4 text-primary" />
              <h3 className="font-serif font-semibold text-sm">Competitor Overview</h3>
            </div>
            {competitorsArr.length > 0 ? (
              competitorsArr.map((comp, idx) => (
                <CompetitorCard key={idx} competitor={comp} />
              ))
            ) : (
              <Card className="bg-card/40 border-dashed border-border">
                <CardContent className="p-6 text-center">
                  <RiGroupLine className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No competitor data yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Add competitors below and generate an analysis</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center Column - Metrics Comparison */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RiBarChartLine className="w-4 h-4 text-primary" />
              <h3 className="font-serif font-semibold text-sm">Metrics Comparison</h3>
            </div>
            {metricsArr.length > 0 ? (
              metricsArr.map((m, idx) => (
                <MetricCard key={idx} metric={m} />
              ))
            ) : (
              <Card className="bg-card/40 border-dashed border-border">
                <CardContent className="p-6 text-center">
                  <RiBarChartLine className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No benchmarking data yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Metrics will appear after analysis</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Insights Feed */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <RiLightbulbLine className="w-4 h-4 text-primary" />
              <h3 className="font-serif font-semibold text-sm">Insights Feed</h3>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3 pr-3">
                {keyTrends.length > 0 ? (
                  keyTrends.map((trend, idx) => (
                    <InsightItem key={idx} text={trend} index={idx} />
                  ))
                ) : (
                  <Card className="bg-card/40 border-dashed border-border">
                    <CardContent className="p-6 text-center">
                      <RiLightbulbLine className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No insights yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Key trends and insights will appear here</p>
                    </CardContent>
                  </Card>
                )}

                {/* Market Overview as insight */}
                {displayData?.market_intelligence?.market_overview && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <RiTrendingUpLine className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">Market Overview</p>
                        <p className="text-xs text-foreground leading-relaxed">{displayData.market_intelligence.market_overview}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overall Position */}
                {displayData?.overall_position && (
                  <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                    <div className="flex items-start gap-2">
                      <RiShieldCheckLine className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium text-accent mb-1">Market Position</p>
                        <p className="text-xs text-foreground font-medium">{displayData.overall_position}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Configuration Section */}
        <Separator />
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg">Analysis Configuration</CardTitle>
            <CardDescription>Configure competitors and product metrics to generate a comprehensive competitive analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Competitor Input */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Competitors</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter competitor name..."
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={handleAddCompetitor} className="gap-1.5">
                  <RiAddLine className="w-4 h-4" /> Add
                </Button>
              </div>
              {competitors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {competitors.map((c) => (
                    <Badge key={c} variant="secondary" className="gap-1.5 pl-3 pr-1.5 py-1">
                      {c}
                      <button type="button" onClick={() => handleRemoveCompetitor(c)} className="hover:bg-destructive/20 rounded-full p-0.5 transition-colors">
                        <RiCloseLine className="w-3.5 h-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              {showSample && competitors.length === 0 && (
                <div className="flex flex-wrap gap-2">
                  {displayCompetitors.map((c) => (
                    <Badge key={c} variant="outline" className="text-xs opacity-60">{c} (sample)</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Product Metrics */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Product Metrics</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Revenue</Label>
                  <Input
                    placeholder={showSample ? '$10M' : 'e.g. $10M'}
                    value={metrics.revenue}
                    onChange={(e) => setMetrics((prev) => ({ ...prev, revenue: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Market Share</Label>
                  <Input
                    placeholder={showSample ? '12%' : 'e.g. 12%'}
                    value={metrics.marketShare}
                    onChange={(e) => setMetrics((prev) => ({ ...prev, marketShare: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">NPS Score</Label>
                  <Input
                    placeholder={showSample ? '68' : 'e.g. 68'}
                    value={metrics.nps}
                    onChange={(e) => setMetrics((prev) => ({ ...prev, nps: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">User Growth</Label>
                  <Input
                    placeholder={showSample ? '30%' : 'e.g. 30%'}
                    value={metrics.userGrowth}
                    onChange={(e) => setMetrics((prev) => ({ ...prev, userGrowth: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Industry Context */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Industry / Market Context</Label>
              <Textarea
                placeholder={showSample ? 'Enterprise SaaS market focused on AI-powered workflow automation...' : 'Describe your industry, market, and any specific areas of focus...'}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={3}
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <RiErrorWarningLine className="w-4 h-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <Button
              type="button"
              onClick={onGenerate}
              disabled={isAnalyzing || competitors.length === 0}
              className="w-full h-12 text-base font-semibold gap-2 bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              {isAnalyzing ? (
                <>
                  <Spinner className="w-5 h-5" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RiSearchLine className="w-5 h-5" />
                  Generate Competitive Analysis
                </>
              )}
            </Button>
            {competitors.length === 0 && !showSample && (
              <p className="text-xs text-muted-foreground text-center">Add at least one competitor to begin analysis</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReportView({
  report,
  onBack,
  showSample,
  onDistribute,
  isDistributing,
  distributionResult,
  emailInput,
  setEmailInput,
  slackInput,
  setSlackInput,
}: {
  report: ReportData | null
  onBack: () => void
  showSample: boolean
  onDistribute: () => void
  isDistributing: boolean
  distributionResult: DistributionResult | null
  emailInput: string
  setEmailInput: (v: string) => void
  slackInput: string
  setSlackInput: (v: string) => void
}) {
  const displayData = showSample ? SAMPLE_REPORT : report

  if (!displayData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-96 bg-card/60 backdrop-blur-md border-border/60">
          <CardContent className="p-8 text-center">
            <RiFileTextLine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-serif font-semibold text-lg mb-2">No Report Available</h3>
            <p className="text-sm text-muted-foreground mb-4">Generate a competitive analysis from the Dashboard first, or enable Sample Data to preview.</p>
            <Button variant="outline" onClick={onBack} className="gap-2">
              <RiArrowLeftLine className="w-4 h-4" /> Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const competitorsAnalyzed = Array.isArray(displayData?.competitors_analyzed) ? displayData.competitors_analyzed : []
  const competitorsArr = Array.isArray(displayData?.market_intelligence?.competitors) ? displayData.market_intelligence.competitors : []
  const metricsArr = Array.isArray(displayData?.benchmarking?.metrics_comparison) ? displayData.benchmarking.metrics_comparison : []
  const strengths = Array.isArray(displayData?.benchmarking?.strengths) ? displayData.benchmarking.strengths : []
  const weaknesses = Array.isArray(displayData?.benchmarking?.weaknesses) ? displayData.benchmarking.weaknesses : []
  const benchRecs = Array.isArray(displayData?.benchmarking?.recommendations) ? displayData.benchmarking.recommendations : []
  const trends = Array.isArray(displayData?.trend_analysis?.trends) ? displayData.trend_analysis.trends : []
  const convergence = Array.isArray(displayData?.trend_analysis?.convergence_patterns) ? displayData.trend_analysis.convergence_patterns : []
  const disruptive = Array.isArray(displayData?.trend_analysis?.disruptive_forces) ? displayData.trend_analysis.disruptive_forces : []
  const stratRecs = Array.isArray(displayData?.strategic_recommendations) ? displayData.strategic_recommendations : []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 pb-28 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={onBack} className="gap-1.5">
              <RiArrowLeftLine className="w-4 h-4" /> Back
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h2 className="text-2xl font-serif font-semibold tracking-tight">Competitive Analysis Report</h2>
          </div>
        </div>

        {/* Report Header Card */}
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RiTimeLine className="w-4 h-4" />
                {displayData?.generated_date ? new Date(displayData.generated_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
              </div>
              <Badge variant="outline" className="gap-1">
                <RiShieldCheckLine className="w-3 h-3" />
                Position: {displayData?.overall_position ?? 'N/A'}
              </Badge>
              <Badge className={getThreatColor(displayData?.urgency_level ?? '')}>
                Urgency: {displayData?.urgency_level ?? 'N/A'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Competitors:</span>
                {competitorsAnalyzed.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                <div className="w-32">
                  <Progress value={displayData?.confidence_score ?? 0} className="h-2" />
                </div>
                <span className="text-xs font-medium">{displayData?.confidence_score ?? 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="bg-primary/5 border-primary/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <RiPulseLine className="w-5 h-5 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-foreground leading-relaxed">{renderMarkdown(displayData?.executive_summary ?? '')}</div>
          </CardContent>
        </Card>

        {/* Market Intelligence */}
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <RiSearchLine className="w-5 h-5 text-primary" />
              Market Intelligence
            </CardTitle>
            {displayData?.market_intelligence?.market_overview && (
              <CardDescription className="text-sm leading-relaxed mt-2">
                {displayData.market_intelligence.market_overview}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {competitorsArr.map((comp, idx) => {
              const activities = Array.isArray(comp?.activities) ? comp.activities : []
              return (
                <Card key={idx} className="bg-card/40 border-border/40">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-serif">{comp?.name ?? 'Unknown'}</CardTitle>
                      <Badge className={getThreatColor(comp?.threat_level ?? '')}>
                        Threat: {comp?.threat_level ?? 'N/A'}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm">{comp?.summary ?? ''}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {activities.map((act, aidx) => (
                        <div key={aidx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">{act?.category ?? ''}</Badge>
                              <Badge className={getImpactColor(act?.impact ?? '')} >{act?.impact ?? ''} Impact</Badge>
                            </div>
                            <h4 className="text-sm font-semibold mb-1">{act?.title ?? ''}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{act?.description ?? ''}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {act?.date && <span className="flex items-center gap-1"><RiTimeLine className="w-3 h-3" /> {act.date}</span>}
                              {act?.source && <span>Source: {act.source}</span>}
                              {typeof act?.confidence === 'number' && <span>Confidence: {act.confidence}%</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Key Trends */}
            {Array.isArray(displayData?.market_intelligence?.key_trends) && displayData.market_intelligence.key_trends.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <RiTrendingUpLine className="w-4 h-4 text-primary" /> Key Trends
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {displayData.market_intelligence.key_trends.map((t, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30">
                      <RiArrowRightSLine className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-xs text-foreground">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benchmarking Section */}
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <RiBarChartLine className="w-5 h-5 text-primary" />
              Benchmarking Analysis
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Position Score:</span>
                <div className="w-32">
                  <Progress value={displayData?.benchmarking?.competitive_position_score ?? 0} className="h-2" />
                </div>
                <span className="text-sm font-semibold">{displayData?.benchmarking?.competitive_position_score ?? 0}/100</span>
              </div>
            </div>
            {displayData?.benchmarking?.summary && (
              <CardDescription className="text-sm leading-relaxed mt-2">{displayData.benchmarking.summary}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics Table */}
            {metricsArr.length > 0 && (
              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead className="text-xs font-semibold">Metric</TableHead>
                      <TableHead className="text-xs font-semibold">Our Value</TableHead>
                      {metricsArr[0]?.competitor_values && Array.isArray(metricsArr[0].competitor_values) && metricsArr[0].competitor_values.map((cv, idx) => (
                        <TableHead key={idx} className="text-xs font-semibold">{cv?.competitor ?? ''}</TableHead>
                      ))}
                      <TableHead className="text-xs font-semibold">Gap</TableHead>
                      <TableHead className="text-xs font-semibold">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metricsArr.map((m, idx) => {
                      const cvs = Array.isArray(m?.competitor_values) ? m.competitor_values : []
                      return (
                        <TableRow key={idx}>
                          <TableCell className="text-xs font-medium">{m?.metric_name ?? ''}</TableCell>
                          <TableCell className="text-xs font-bold text-primary">{m?.our_value ?? '-'}</TableCell>
                          {cvs.map((cv, cidx) => {
                            const vd = getVarianceDisplay(cv?.variance ?? '')
                            return (
                              <TableCell key={cidx} className="text-xs">
                                <span>{cv?.value ?? '-'}</span>
                                <span className={`ml-1.5 ${vd.color}`}>({cv?.variance ?? ''})</span>
                              </TableCell>
                            )
                          })}
                          <TableCell>
                            <Badge className={`text-xs ${getThreatColor(m?.gap_level ?? '')}`}>{m?.gap_level ?? ''}</Badge>
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="flex items-center gap-1">
                              {(m?.trend ?? '').toLowerCase() === 'improving' && <RiArrowUpLine className="w-3 h-3 text-emerald-600" />}
                              {(m?.trend ?? '').toLowerCase() === 'declining' && <RiArrowDownLine className="w-3 h-3 text-red-600" />}
                              {(m?.trend ?? '').toLowerCase() === 'stable' && <RiArrowRightSLine className="w-3 h-3 text-amber-600" />}
                              <span className="capitalize">{m?.trend ?? ''}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-emerald-50/50 border-emerald-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                    <RiCheckLine className="w-4 h-4" /> Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-emerald-900">
                        <RiCheckLine className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-600" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-red-50/50 border-red-200/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-red-800 flex items-center gap-2">
                    <RiAlertLine className="w-4 h-4" /> Weaknesses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-red-900">
                        <RiAlertLine className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-600" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Benchmarking Recommendations */}
            {benchRecs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Benchmarking Recommendations</h4>
                <div className="space-y-2">
                  {benchRecs.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/30">
                      <Badge className={`text-xs shrink-0 ${getPriorityColor(rec?.priority ?? '')}`}>{rec?.priority ?? ''}</Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rec?.action ?? ''}</p>
                        <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
                          <span>Impact: {rec?.expected_impact ?? 'N/A'}</span>
                          <span>Timeline: {rec?.timeframe ?? 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <RiTrendingUpLine className="w-5 h-5 text-primary" />
              Trend Analysis
            </CardTitle>
            {displayData?.trend_analysis?.strategic_summary && (
              <CardDescription className="text-sm leading-relaxed mt-2">{displayData.trend_analysis.strategic_summary}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Trends Grid */}
            {trends.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trends.map((trend, idx) => (
                  <Card key={idx} className="bg-card/40 border-border/40">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-sm font-serif">{trend?.name ?? ''}</CardTitle>
                        <Badge variant="outline" className="text-xs">{trend?.category ?? ''}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge className={getImpactColor(trend?.impact ?? '')}>{trend?.impact ?? ''} Impact</Badge>
                        <Badge variant="secondary" className="text-xs">{trend?.maturity ?? ''}</Badge>
                        <Badge variant="outline" className="text-xs">{trend?.time_horizon ?? ''}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-xs text-foreground leading-relaxed">{trend?.description ?? ''}</p>
                      {typeof trend?.confidence === 'number' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Confidence:</span>
                          <Progress value={trend.confidence} className="h-1.5 flex-1" />
                          <span className="text-xs font-medium">{trend.confidence}%</span>
                        </div>
                      )}
                      {trend?.implications && (
                        <div className="text-xs">
                          <span className="font-medium text-foreground">Implications: </span>
                          <span className="text-muted-foreground">{trend.implications}</span>
                        </div>
                      )}
                      {trend?.opportunities && (
                        <div className="text-xs">
                          <span className="font-medium text-emerald-700">Opportunities: </span>
                          <span className="text-muted-foreground">{trend.opportunities}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Convergence Patterns */}
            {convergence.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <RiRefreshLine className="w-4 h-4 text-primary" /> Convergence Patterns
                </h4>
                <div className="space-y-3">
                  {convergence.map((cp, idx) => {
                    const involvedTrends = Array.isArray(cp?.involved_trends) ? cp.involved_trends : []
                    return (
                      <div key={idx} className="p-3 rounded-lg bg-background/50 border border-border/30">
                        <h5 className="text-sm font-semibold mb-1">{cp?.pattern ?? ''}</h5>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {involvedTrends.map((t, tidx) => (
                            <Badge key={tidx} variant="outline" className="text-xs">{t}</Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">{cp?.strategic_implication ?? ''}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Disruptive Forces */}
            {disruptive.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <RiAlertLine className="w-4 h-4 text-destructive" /> Disruptive Forces
                </h4>
                <div className="space-y-2">
                  {disruptive.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-red-50/30 border border-red-200/30">
                      <RiErrorWarningLine className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                      <span className="text-xs text-foreground">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategic Recommendations */}
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <RiLightbulbLine className="w-5 h-5 text-primary" />
              Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stratRecs.map((rec, idx) => (
                <Card key={idx} className="bg-card/40 border-border/40">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <Badge className={`text-xs ${getPriorityColor(rec?.priority ?? '')}`}>{rec?.priority ?? ''}</Badge>
                        <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold mb-1">{rec?.action ?? ''}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">{rec?.rationale ?? ''}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <RiTrendingUpLine className="w-3 h-3 text-primary" />
                            <span className="font-medium">Impact:</span> {rec?.expected_impact ?? 'N/A'}
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <RiTimeLine className="w-3 h-3 text-primary" />
                            <span className="font-medium">Timeline:</span> {rec?.timeframe ?? 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribution Bar */}
        <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <RiSendPlaneLine className="w-5 h-5 text-primary" />
              Share Report
            </CardTitle>
            <CardDescription>Distribute this report via email and Slack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <RiMailLine className="w-4 h-4" /> Email Recipients
                </Label>
                <Input
                  placeholder="Enter emails (comma-separated)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <RiChat3Line className="w-4 h-4" /> Slack Channel
                </Label>
                <Input
                  placeholder="#channel-name"
                  value={slackInput}
                  onChange={(e) => setSlackInput(e.target.value)}
                />
              </div>
            </div>

            {/* Distribution Result */}
            {distributionResult && (
              <Card className="bg-emerald-50/50 border-emerald-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <RiCheckLine className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-800">Report Distributed Successfully</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Email Status:</span>
                      <p className="font-medium">{distributionResult?.email_status ?? 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Slack Status:</span>
                      <p className="font-medium">{distributionResult?.slack_status ?? 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recipients:</span>
                      <p className="font-medium">{Array.isArray(distributionResult?.recipients) ? distributionResult.recipients.join(', ') : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Channel:</span>
                      <p className="font-medium">{distributionResult?.slack_channel ?? 'N/A'}</p>
                    </div>
                    {distributionResult?.timestamp && (
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>
                        <p className="font-medium">{distributionResult.timestamp}</p>
                      </div>
                    )}
                    {distributionResult?.summary && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Summary:</span>
                        <p className="font-medium">{distributionResult.summary}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={onDistribute}
              disabled={isDistributing || (!emailInput.trim() && !slackInput.trim())}
              className="w-full gap-2"
            >
              {isDistributing ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Distributing...
                </>
              ) : (
                <>
                  <RiSendPlaneLine className="w-4 h-4" />
                  Share Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function LibraryView({
  reports,
  onViewReport,
  onDeleteReport,
}: {
  reports: StoredReport[]
  onViewReport: (report: StoredReport) => void
  onDeleteReport: (id: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReports = reports.filter((r) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const compMatch = Array.isArray(r?.competitors) && r.competitors.some((c) => c.toLowerCase().includes(term))
    const summaryMatch = (r?.data?.executive_summary ?? '').toLowerCase().includes(term)
    return compMatch || summaryMatch
  })

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 pb-28 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-serif font-semibold tracking-tight">Reports Library</h2>
          <p className="text-sm text-muted-foreground mt-1">Access and manage your competitive analysis reports</p>
        </div>

        {/* Search / Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by competitor or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="secondary" className="text-xs">{filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}</Badge>
        </div>

        {/* Reports Table */}
        {filteredReports.length > 0 ? (
          <Card className="bg-card/60 backdrop-blur-md border-border/60 shadow-sm overflow-hidden">
            <div className="rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead className="text-xs font-semibold">Date</TableHead>
                    <TableHead className="text-xs font-semibold">Competitors</TableHead>
                    <TableHead className="text-xs font-semibold">Position</TableHead>
                    <TableHead className="text-xs font-semibold">Urgency</TableHead>
                    <TableHead className="text-xs font-semibold">Confidence</TableHead>
                    <TableHead className="text-xs font-semibold">Key Highlights</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => {
                    const comps = Array.isArray(report?.competitors) ? report.competitors : []
                    return (
                      <TableRow key={report.id} className="cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => onViewReport(report)}>
                        <TableCell className="text-xs">
                          {report?.createdAt ? new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {comps.slice(0, 3).map((c) => (
                              <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                            ))}
                            {comps.length > 3 && <Badge variant="outline" className="text-xs">+{comps.length - 3}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{report?.data?.overall_position ?? 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getThreatColor(report?.data?.urgency_level ?? '')}`}>
                            {report?.data?.urgency_level ?? 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          <div className="flex items-center gap-1.5">
                            <Progress value={report?.data?.confidence_score ?? 0} className="h-1.5 w-16" />
                            <span>{report?.data?.confidence_score ?? 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                          {(report?.data?.executive_summary ?? '').slice(0, 100)}...
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewReport(report); }} className="h-8 w-8 p-0">
                              <RiEyeLine className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onDeleteReport(report.id); }} className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                              <RiDeleteBinLine className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <Card className="bg-card/40 border-dashed border-border">
            <CardContent className="p-12 text-center">
              <RiStackLine className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif font-semibold text-lg mb-2">No Reports Yet</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? 'No reports match your search criteria.' : 'Generate your first competitive analysis from the Dashboard to see it here.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// --- Main Page ---

export default function Page() {
  const [activeView, setActiveView] = useState<'dashboard' | 'report' | 'library'>('dashboard')
  const [competitors, setCompetitors] = useState<string[]>([])
  const [competitorInput, setCompetitorInput] = useState('')
  const [metrics, setMetrics] = useState({ revenue: '', marketShare: '', nps: '', userGrowth: '' })
  const [context, setContext] = useState('')
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null)
  const [reportHistory, setReportHistory] = useState<StoredReport[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDistributing, setIsDistributing] = useState(false)
  const [showSample, setShowSample] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [distributionResult, setDistributionResult] = useState<DistributionResult | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [slackInput, setSlackInput] = useState('')

  // Load report history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ci_hub_reports')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setReportHistory(parsed)
        }
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  // Save report history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ci_hub_reports', JSON.stringify(reportHistory))
    } catch {
      // ignore storage errors
    }
  }, [reportHistory])

  const handleGenerate = useCallback(async () => {
    if (competitors.length === 0) return
    setIsAnalyzing(true)
    setError(null)
    setActiveAgentId(MANAGER_AGENT_ID)

    const metricsSection = [
      metrics.revenue ? `- Revenue: ${metrics.revenue}` : '',
      metrics.marketShare ? `- Market Share: ${metrics.marketShare}` : '',
      metrics.nps ? `- NPS: ${metrics.nps}` : '',
      metrics.userGrowth ? `- User Growth: ${metrics.userGrowth}` : '',
    ].filter(Boolean).join('\n')

    const message = `Analyze the competitive landscape for the following competitors: ${competitors.join(', ')}.

${metricsSection ? `Our product metrics:\n${metricsSection}` : ''}

${context ? `Additional context: ${context}` : ''}

Please provide comprehensive competitive intelligence including market research, benchmarking analysis, and trend identification.`

    try {
      const result = await callAIAgent(message, MANAGER_AGENT_ID)
      if (result.success) {
        let parsed = result?.response?.result
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { /* use as-is */ }
        }

        const reportData: ReportData = {
          executive_summary: parsed?.executive_summary ?? '',
          overall_position: parsed?.overall_position ?? '',
          urgency_level: parsed?.urgency_level ?? '',
          confidence_score: typeof parsed?.confidence_score === 'number' ? parsed.confidence_score : 0,
          market_intelligence: {
            competitors: Array.isArray(parsed?.market_intelligence?.competitors) ? parsed.market_intelligence.competitors : [],
            market_overview: parsed?.market_intelligence?.market_overview ?? '',
            key_trends: Array.isArray(parsed?.market_intelligence?.key_trends) ? parsed.market_intelligence.key_trends : [],
          },
          benchmarking: {
            competitive_position_score: typeof parsed?.benchmarking?.competitive_position_score === 'number' ? parsed.benchmarking.competitive_position_score : 0,
            metrics_comparison: Array.isArray(parsed?.benchmarking?.metrics_comparison) ? parsed.benchmarking.metrics_comparison : [],
            strengths: Array.isArray(parsed?.benchmarking?.strengths) ? parsed.benchmarking.strengths : [],
            weaknesses: Array.isArray(parsed?.benchmarking?.weaknesses) ? parsed.benchmarking.weaknesses : [],
            recommendations: Array.isArray(parsed?.benchmarking?.recommendations) ? parsed.benchmarking.recommendations : [],
            summary: parsed?.benchmarking?.summary ?? '',
          },
          trend_analysis: {
            trends: Array.isArray(parsed?.trend_analysis?.trends) ? parsed.trend_analysis.trends : [],
            convergence_patterns: Array.isArray(parsed?.trend_analysis?.convergence_patterns) ? parsed.trend_analysis.convergence_patterns : [],
            disruptive_forces: Array.isArray(parsed?.trend_analysis?.disruptive_forces) ? parsed.trend_analysis.disruptive_forces : [],
            strategic_summary: parsed?.trend_analysis?.strategic_summary ?? '',
          },
          strategic_recommendations: Array.isArray(parsed?.strategic_recommendations) ? parsed.strategic_recommendations : [],
          generated_date: parsed?.generated_date ?? new Date().toISOString(),
          competitors_analyzed: Array.isArray(parsed?.competitors_analyzed) ? parsed.competitors_analyzed : competitors,
        }

        setCurrentReport(reportData)

        const storedReport: StoredReport = {
          id: `report_${Date.now()}`,
          data: reportData,
          createdAt: new Date().toISOString(),
          competitors: [...competitors],
        }
        setReportHistory((prev) => [storedReport, ...prev])
      } else {
        setError(result?.error ?? 'Failed to generate analysis. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setActiveAgentId(null)
    }
  }, [competitors, metrics, context])

  const handleDistribute = useCallback(async () => {
    if (!emailInput.trim() && !slackInput.trim()) return
    const reportData = showSample ? SAMPLE_REPORT : currentReport
    if (!reportData) return

    setIsDistributing(true)
    setDistributionResult(null)
    setActiveAgentId(DISTRIBUTION_AGENT_ID)

    const emails = emailInput.split(',').map((e) => e.trim()).filter(Boolean)

    const message = `Please distribute this competitive analysis report.

Recipients: ${emails.join(', ')}
Slack Channel: ${slackInput.trim()}

Report Summary:
${reportData?.executive_summary ?? ''}

Full Report Data:
${JSON.stringify(reportData, null, 2)}`

    try {
      const result = await callAIAgent(message, DISTRIBUTION_AGENT_ID)
      if (result.success) {
        let parsed = result?.response?.result
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed) } catch { /* use as-is */ }
        }

        setDistributionResult({
          email_status: parsed?.email_status ?? 'Unknown',
          slack_status: parsed?.slack_status ?? 'Unknown',
          recipients: Array.isArray(parsed?.recipients) ? parsed.recipients : emails,
          slack_channel: parsed?.slack_channel ?? slackInput,
          timestamp: parsed?.timestamp ?? new Date().toISOString(),
          summary: parsed?.summary ?? '',
        })
      } else {
        setError(result?.error ?? 'Distribution failed. Please try again.')
      }
    } catch {
      setError('An unexpected error occurred during distribution.')
    } finally {
      setIsDistributing(false)
      setActiveAgentId(null)
    }
  }, [emailInput, slackInput, currentReport, showSample])

  const handleViewLibraryReport = useCallback((report: StoredReport) => {
    setCurrentReport(report.data)
    setActiveView('report')
  }, [])

  const handleDeleteReport = useCallback((id: string) => {
    setReportHistory((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const handleNavigate = useCallback((view: 'dashboard' | 'report' | 'library') => {
    setActiveView(view)
    setDistributionResult(null)
  }, [])

  return (
    <div className="min-h-screen bg-background" style={{ background: 'linear-gradient(135deg, hsl(120 25% 96%) 0%, hsl(140 30% 94%) 35%, hsl(160 25% 95%) 70%, hsl(100 20% 96%) 100%)' }}>
      {isAnalyzing && <LoadingOverlay />}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <SidebarNav activeView={activeView} onNavigate={handleNavigate} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Top Bar */}
          <div className="h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              {activeAgentId && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Spinner className="w-3 h-3" />
                  <span>
                    {activeAgentId === MANAGER_AGENT_ID ? 'Intelligence Manager' : 'Distribution Agent'} working...
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground cursor-pointer">Sample Data</Label>
              <Switch
                id="sample-toggle"
                checked={showSample}
                onCheckedChange={setShowSample}
              />
            </div>
          </div>

          {/* Content Area */}
          {activeView === 'dashboard' && (
            <DashboardView
              report={currentReport}
              competitors={competitors}
              setCompetitors={setCompetitors}
              metrics={metrics}
              setMetrics={setMetrics}
              context={context}
              setContext={setContext}
              onGenerate={handleGenerate}
              isAnalyzing={isAnalyzing}
              showSample={showSample}
              competitorInput={competitorInput}
              setCompetitorInput={setCompetitorInput}
              error={error}
            />
          )}
          {activeView === 'report' && (
            <ReportView
              report={currentReport}
              onBack={() => handleNavigate('dashboard')}
              showSample={showSample}
              onDistribute={handleDistribute}
              isDistributing={isDistributing}
              distributionResult={distributionResult}
              emailInput={emailInput}
              setEmailInput={setEmailInput}
              slackInput={slackInput}
              setSlackInput={setSlackInput}
            />
          )}
          {activeView === 'library' && (
            <LibraryView
              reports={reportHistory}
              onViewReport={handleViewLibraryReport}
              onDeleteReport={handleDeleteReport}
            />
          )}
        </div>
      </div>
    </div>
  )
}
