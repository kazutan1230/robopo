import { useEffect, useState } from "react"

type PlayerStat = {
  playerId: number
  playerName: string
  playerZekken: string
  maxResult: number
  challengeCount: number
}

type tableExampleProps = {
  competitionId: number
  courseId: string
}

export const TableExample = ({ competitionId, courseId }: tableExampleProps) => {
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/summary/${competitionId}/${courseId}`)
      const data = await res.json()
      setPlayerStats(data)
    }

    fetchData()
  }, [competitionId, courseId])

  return (
    <div>
      <h1>Player Statistics</h1>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 p-2">Player Name</th>
            <th className="border border-gray-400 p-2">Player Zekken</th>
            <th className="border border-gray-400 p-2">Max Challenge Result</th>
            <th className="border border-gray-400 p-2">Challenge Count</th>
          </tr>
        </thead>
        <tbody>
          {playerStats.map((player) => (
            <tr key={player.playerId}>
              <td className="border border-gray-400 p-2">{player.playerName}</td>
              <td className="border border-gray-400 p-2">{player.playerZekken}</td>
              <td className="border border-gray-400 p-2">{player.maxResult}</td>
              <td className="border border-gray-400 p-2">{player.challengeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
