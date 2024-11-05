"use client"
import Link from "next/link"
import { useState } from "react"

const TabButton = ({ name, link }: { name: string; link: string }) => {
  return (
    <Link href={link} className="btn btn-primary min-w-40 min-h-20 text-2xl max-w-fit m-3">
      {name}
    </Link>
  )
}

export const ChallengeTab = (): JSX.Element => {
  const [competitionId, setCompetitionId] = useState(1)
  const [umpireId, setUmpireId] = useState(1)

  return (
    <div>
      <select
        className="select select-bordered m-3"
        onChange={(event) => setCompetitionId(Number(event.target.value))}
        value={competitionId ? competitionId : 0}>
        <option value={0} disabled>
          大会を選んでください
        </option>
        <option value="1">PreOpen</option>
        {/* {competitionData ? (
          competitionData.selectompetition.map(
            (competition) =>
              competition.id !== -1 &&
              competition.id !== -2 && (
                <option key={competition.id} value={competition.id}>
                  {competition.name}
                </option>
              )
          )
        ) : (
          <option>コースがありません</option>
        )} */}
      </select>
      <select
        className="select select-bordered m-3"
        onChange={(event) => setUmpireId(Number(event.target.value))}
        value={umpireId ? umpireId : 0}>
        <option value={0} disabled>
          採点者を選んでください
        </option>
        <option value="1">採点者</option>
      </select>
      <TabButton name="採点" link={`/challenge?competitionId=${competitionId}&umpireId=${umpireId}`} />
    </div>
  )
}

export const SummaryTab = (): JSX.Element => {
  const [competitionId, setCompetitionId] = useState(1)
  return (
    <div>
      <select
        className="select select-bordered m-3"
        onChange={(event) => setCompetitionId(Number(event.target.value))}
        value={competitionId ? competitionId : 0}>
        <option value={0} disabled>
          大会を選んでください
        </option>
        <option value="1">PreOpen</option>
        {/* {competitionData ? (
          competitionData.selectompetition.map(
            (competition) =>
            competition.id !== -1 &&
            competition.id !== -2 && (
              <option key={competition.id} value={competition.id}>
              {competition.name}
              </option>
              )
              )
              ) : (
                <option>コースがありません</option>
                )} */}
      </select>
      <TabButton name="集計結果" link={`/summary?competitionId=${competitionId}`} />
    </div>
  )
}

export const ManageTab = (): JSX.Element => {
  return (
    <div className="grid sm:grid-cols-2 md:flex md:flex-col justify-center">
      <TabButton name="コース作成" link={`/course`} />
      <TabButton name="選手登録" link={`/player`} />
      <TabButton name="採点者登録" link={`/umpire`} />
      <TabButton name="大会設定" link={`/config`} />
    </div>
  )
}
