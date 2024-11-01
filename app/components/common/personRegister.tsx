"use client"
import { useCallback, useState } from "react"
import type { SelectPlayer, SelectUmpire } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"
import { getUmpireList } from "@/app/components/common/utils"

type PersonRegisterProps = {
  type: "player" | "umpire"
  setPersonId: React.Dispatch<React.SetStateAction<number | null>>
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
  setPersonDataList: React.Dispatch<React.SetStateAction<SelectPlayer[] | SelectUmpire[]>>
}

const PersonRegister = ({
  type,
  setPersonId,
  setSuccessMessage,
  setErrorMessage,
  setPersonDataList,
}: PersonRegisterProps) => {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [furigana, setFurigana] = useState("")
  const [zekken, setZekken] = useState("")
  const [qr, setQr] = useState("")

  const formItems = [
    { label: "name", dispName: "名前", value: name, setValue: setName },
    ...(type === "player"
      ? [
          { label: "furigana", dispName: "ふりがな", value: furigana, setValue: setFurigana },
          { label: "zekken", dispName: "ゼッケン番号", value: zekken, setValue: setZekken },
          { label: "qr", dispName: "QRコード", value: qr, setValue: setQr },
        ]
      : []),
  ]

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const personData = { name, ...(type === "player" ? { furigana, zekken, qr } : {}) }

    try {
      // APIにPOSTリクエストを送信
      const url = type === "player" ? "/api/player" : "/api/umpire"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personData),
      })

      const result = await response.json()

      if (response.ok) {
        // 登録成功時の処理
        if (type === "player") {
          setSuccessMessage("プレイヤーが正常に登録されました")
          setName("")
          setFurigana("")
          setZekken("")
          setQr("")
        } else {
          setSuccessMessage("採点者が正常に登録されました")
          setName("")
        }
        if (type === "player") {
          const newPersonDataList: { players: SelectPlayer[] } = await getPlayerList()
          setPersonDataList(newPersonDataList.players)
          setPersonId(newPersonDataList.players[newPersonDataList.players.length - 1].id)
        } else if (type === "umpire") {
          const newPersonDataList: { umpires: SelectUmpire[] } = await getUmpireList()
          type === "umpire" && setPersonDataList(newPersonDataList.umpires as SelectUmpire[])
          setPersonId(newPersonDataList.umpires[newPersonDataList.umpires.length - 1].id)
        }
      } else {
        // エラーメッセージを表示
        setErrorMessage(result.message || "登録中にエラーが発生しました")
      }
    } catch (error) {
      // ネットワークエラーやその他のエラーの処理
      setErrorMessage("エラーが発生しました。もう一度お試しください。")
    } finally {
      setLoading(false)
    }
  }

  //   個々の入力フォーム
  const FormItem = useCallback(
    ({
      label,
      dispName,
      value,
      setValue,
    }: {
      label: string
      dispName: string
      value: string
      setValue: React.Dispatch<React.SetStateAction<string>>
    }) => (
      <div>
        <label htmlFor={label} className="block text-sm font-medium text-gray-700">
          {dispName}
        </label>
        <input
          type="text"
          id={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
    ),
    []
  )

  return (
    <div className=" flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <button type="submit" disabled={loading} className="btn btn-primary mx-auto m-3">
          {loading ? "登録中..." : "↓新規登録"}
        </button>
        {formItems.map((item, index) => (
          <FormItem
            key={item.label}
            label={item.label}
            dispName={item.dispName}
            value={item.value}
            setValue={item.setValue}
          />
        ))}
      </form>
    </div>
  )
}

export default PersonRegister
