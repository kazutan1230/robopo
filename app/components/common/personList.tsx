import type { SelectPlayer, SelectUmpire } from "@/app/lib/db/schema"

type personListProps = {
  type: "player" | "umpire"
  personId: number | null
  setPersonId: React.Dispatch<React.SetStateAction<number | null>>
  personDataList: SelectPlayer[] | SelectUmpire[]
}

const PersonList = ({ type, personId, setPersonId, personDataList }: personListProps) => {
  const itemNames: string[] = []
  if (type === "player") {
    itemNames.push("名前", "ふりがな", "ゼッケン番号")
  } else if (type === "umpire") {
    itemNames.push("名前")
  }
  const handlePersonSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonId(Number(event.target.value))
  }

  return (
    <>
      <h2 className="text-center text-xl font-semibold">{type === "player" ? "選手" : "採点者"}一覧</h2>
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
                {itemNames.map((name) => (
                  <th key={name}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personDataList.length > 0 ? (
                personDataList.map((person) => (
                  <tr key={person.id} className="hover cursor-pointer" onClick={() => setPersonId(person.id)}>
                    <th>
                      <label>
                        <input
                          type="radio"
                          name="selectedPerson"
                          value={person.id}
                          checked={personId === person.id}
                          onChange={handlePersonSelect}
                          className="h-4 w-4"
                        />
                      </label>
                    </th>
                    {type === "umpire" && <td>{person.id}</td>}
                    <td>{person.name}</td>
                    {type === "player" ? <td>{(person as SelectPlayer).furigana}</td> : <td>-</td>}
                    {type === "player" ? <td>{(person as SelectPlayer).zekken}</td> : <td>-</td>}
                    {/* {type === "player" ? <td>{(person as SelectPlayer).qr}</td> : <td>-</td>} */}
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

export default PersonList
