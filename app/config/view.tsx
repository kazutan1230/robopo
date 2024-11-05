"use client"
import { useState } from "react"
import { ThreeTabs } from "@/app/components/parts/threeTabs"
import { CompetitionListTab, NewCompetitionTab } from "@/app/config/tabs"
import { SelectCompetition } from "@/app/lib/db/schema"

type ViewProps = {
  initialCompetitionList: { competitions: SelectCompetition[] }
}

export default function View({ initialCompetitionList }: ViewProps) {
  const [competitionList, setCompetitionList] = useState<SelectCompetition[]>(initialCompetitionList.competitions)

  return (
    <ThreeTabs
      tab1Title="大会一覧"
      tab1={<CompetitionListTab competitionList={competitionList} setCompetitionList={setCompetitionList} />}
      tab2Title="大会登録"
      tab2={<NewCompetitionTab setCompetitionList={setCompetitionList} />}
      tab3Title="大会管理"
      tab3={<CompetitionListTab competitionList={competitionList} setCompetitionList={setCompetitionList} />}
    />
  )
}
