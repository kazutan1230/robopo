import { ChallengeTab, SummaryTab, CompetitionTab } from "@/app/components/home/tabs"
import { ThreeTabs } from "@/app/components/parts/threeTabs"

export default function Home() {
  return (
    <ThreeTabs
      tab1Title="採点"
      tab1={<ChallengeTab />}
      tab2Title="集計結果"
      tab2={<SummaryTab />}
      tab3Title="大会管理"
      tab3={<CompetitionTab />}
    />
  )
}
