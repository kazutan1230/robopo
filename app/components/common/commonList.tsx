import type { SelectPlayer, SelectUmpire, SelectCompetition } from "@/app/lib/db/schema"

type commonListProps = {
  type: "player" | "umpire" | "competition"
  commonId: number | null
  setCommonId: React.Dispatch<React.SetStateAction<number | null>>
  commonDataList: SelectPlayer[] | SelectUmpire[] | SelectCompetition[]
}

const CommonList = ({ type, commonId, setCommonId, commonDataList }: commonListProps) => {
  const itemNames: string[] = []
  if (type === "player") {
    itemNames.push("名前", "ふりがな", "ゼッケン番号")
  } else if (type === "umpire") {
    itemNames.push("ID", "名前")
  } else if (type === "competition") {
    itemNames.push("ID", "名前", "開催中")
  }
  const handleCommonSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCommonId(Number(event.target.value))
  }

  return (
    <>
      {type !== "competition" && (
        <h2 className="text-center text-xl font-semibold">
          {type === "player" ? "選手" : type === "umpire" ? "採点者" : null}一覧
        </h2>
      )}
      <div className="w-full">
        <div className="border overflow-x-auto overflow-y-auto max-h-80 sm:h-96 m-3">
          <table className="table table-pin-rows">
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="radio" disabled={true} />
                  </label>
                </th>
                {itemNames.map((name) => (
                  <th key={name}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commonDataList.length > 0 ? (
                commonDataList.map((common) => (
                  <tr key={common.id} className="hover cursor-pointer" onClick={() => setCommonId(common.id)}>
                    <th>
                      <label>
                        <input
                          type="radio"
                          name="selectedCommon"
                          value={common.id}
                          checked={commonId === common.id}
                          onChange={handleCommonSelect}
                          className="h-4 w-4"
                        />
                      </label>
                    </th>
                    {(type === "umpire" || type === "competition") && <td>{common.id}</td>}
                    <td>{common.name}</td>
                    {type === "player" ? <td>{(common as SelectPlayer).furigana}</td> : null}
                    {type === "player" ? <td>{(common as SelectPlayer).zekken}</td> : null}
                    {/* {type === "player" ? <td>{(common as SelectPlayer).qr}</td> : null} */}
                    {type === "competition" ? (
                      <td>{(common as SelectCompetition).isOpen ? "開催中" : "未開催"}</td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    {type === "player" ? "選手" : type === "umpire" ? "採点者" : "大会"}が登録されていません。
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

export default CommonList
