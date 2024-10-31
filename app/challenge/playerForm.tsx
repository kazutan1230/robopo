"use client"

import type { SelectPlayer } from "@/app/lib/db/schema"

type PlayerFormProps = {
  playerDataList: SelectPlayer[]
  playerId: number | null
  setPlayerId: React.Dispatch<React.SetStateAction<number | null>>
}

const PlayerForm = ({ playerDataList, playerId, setPlayerId }: PlayerFormProps) => {
  const handlePlayerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(Number(event.target.value))
  }

  return (
    <>
      <h2 className="text-center text-xl font-semibold">プレイヤー一覧</h2>
      <div className="w-full h-full">
        <div className="border overflow-x-auto overflow-y-auto max-h-80 sm:h-96 m-3">
          <table className="table table-pin-rows">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="radio" disabled={true} />
                  </label>
                </th>
                {/* <th>ID</th> */}
                <th>名前</th>
                <th>ふりがな</th>
                <th>ゼッケン番号</th>
                {/* <th>QRコード</th> */}
              </tr>
            </thead>
            <tbody>
              {playerDataList.length > 0 ? (
                playerDataList.map((player) => (
                  <tr key={player.id} className="hover cursor-pointer" onClick={() => setPlayerId(player.id)}>
                    <th>
                      <label>
                        <input
                          type="radio"
                          name="selectedPlayer"
                          value={player.id}
                          checked={playerId === player.id}
                          onChange={handlePlayerSelect}
                          className="h-4 w-4"
                        />
                      </label>
                    </th>
                    {/* <td>{player.id}</td> */}
                    <td>{player.name}</td>
                    <td>{player.furigana}</td>
                    <td>{player.zekken}</td>
                    {/* <td>{player.qr}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    プレイヤーが登録されていません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default PlayerForm
