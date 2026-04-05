export interface Sight {
  title: string;
  desc: string;
  mapHref: string;
  address: string;
  duration?: string;
  cost?: string;
  tip?: string;
}

export interface HistoryEvent {
  year: string;
  title: string;
  text: string;
}

export interface FoodItem {
  name: string;
  original?: string;
  desc: string;
  price?: string;
  tip?: string;
  emoji?: string;
}

export interface Phrase {
  original: string;
  pronunciation: string;
  translation: string;
}

export interface InsiderTip {
  icon: string;
  title: string;
  text: string;
}

export interface DayStop {
  time: string;
  activity: string;
  icon: string;
  tip?: string;
}

export interface DayPlan {
  day: string;
  title: string;
  icon: string;
  color: string;
  stops: DayStop[];
  transport?: string;
  meals?: string;
  dayCost?: string;
}

export interface BeachEntry {
  name: string;
  emoji: string;
  desc: string;
  type: string;
  tip?: string;
}

export interface RegionEntry {
  name: string;
  emoji: string;
  desc: string;
  highlights: string[];
}

export interface MonthNote {
  label: string;
  emoji: string;
  text: string;
}

export interface BudgetItem {
  label: string;
  budget: string;
  mid: string;
  luxury: string;
}

export interface EmergencyInfo {
  police: string;
  ambulance: string;
  fire: string;
  embassy?: string;
  hospital?: string;
}

export interface GuideContent {
  sights: Sight[];
  history: HistoryEvent[];
  food: FoodItem[];
  phrases: Phrase[];
  insider: InsiderTip[];
  beaches: BeachEntry[];
  regions: RegionEntry[];
  couplesDays: DayPlan[];
  familiesDays: DayPlan[];
  soloDays: DayPlan[];
  monthlyNotes: MonthNote[];
  budget: BudgetItem[];
  emergency: EmergencyInfo;
}
