export type { GuideContent, Sight, HistoryEvent, FoodItem, Phrase, InsiderTip, DayStop, DayPlan, BeachEntry, RegionEntry, MonthNote, BudgetItem, EmergencyInfo } from "./_types";

import teneriffa   from "./teneriffa";
import rhodos      from "./rhodos";
import ibiza       from "./ibiza";
import dubai       from "./dubai";
import lissabon    from "./lissabon";
import santorini   from "./santorini";
import granCanaria from "./gran-canaria";
import alanya      from "./alanya";
import korfu       from "./korfu";
import side        from "./side-guide";

export const guideData: Record<string, ReturnType<typeof Object.assign>> = {
  teneriffa,
  rhodos,
  ibiza,
  dubai,
  lissabon,
  santorini,
  "gran-canaria": granCanaria,
  alanya,
  korfu,
  side,
};
