import type { SelectPlayer, SelectUmpire, SelectCompetition, SelectAssignList } from "@/app/lib/db/schema"

type commonListProps = {
  type: "player" | "umpire" | "competition" | "assign"
  commonId: number | null
  setCommonId: React.Dispatch<React.SetStateAction<number | null>>
  commonDataList: SelectPlayer[] | SelectUmpire[] | SelectCompetition[] | SelectAssignList[]
}

const CommonList = ({ type, commonId, setCommonId, commonDataList }: commonListProps) => {
  const itemNames: string[] = []
  if (type === "player") {
    itemNames.push("ゼッケン番号", "ふりがな", "名前")
  } else if (type === "umpire") {
    itemNames.push("ID", "名前")
  } else if (type === "competition") {
    itemNames.push("ID", "名前", "開催中")
  } else if (type === "assign") {
    itemNames.push("大会名", "コース名", "採点者名")
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
                    {type === "player" && (
                      <>
                        <td>{(common as SelectPlayer).zekken}</td>
                        <td>{(common as SelectPlayer).furigana}</td>
                        <td>{(common as SelectPlayer).name}</td>
                        {/* <td>{(common as SelectPlayer).qr}</td> */}
                      </>
                    )}
                    {type === "umpire" && (
                      <>
                        <td>{(common as SelectUmpire).id}</td>
                        <td>{(common as SelectUmpire).name}</td>
                      </>
                    )}
                    {type === "competition" && (
                      <>
                        <td>{(common as SelectCompetition).id}</td>
                        <td>{(common as SelectCompetition).name}</td>
                        <td>{(common as SelectCompetition).isOpen ? "開催中" : "未開催"}</td>
                      </>
                    )}
                    {type === "assign" && (
                      <>
                        <td>{(common as SelectAssignList).competition}</td>
                        <td>{(common as SelectAssignList).course}</td>
                        <td>{(common as SelectAssignList).umpire}</td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    {type === "player"
                      ? "選手"
                      : type === "umpire"
                      ? "採点者"
                      : type === "competition"
                      ? "大会"
                      : "割当"}
                    が登録されていません。
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
