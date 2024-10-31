"use client"
import { useState } from "react"
import type { SelectPlayer, SelectUmpire } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"

type CommonProps = {
  setPersonId: React.Dispatch<React.SetStateAction<number | null>>
  setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>
}

type PersonRegisterProps =
  | (CommonProps & {
      type: "player"
      setPersonDataList: React.Dispatch<React.SetStateAction<SelectPlayer[]>>
    })
  | (CommonProps & {
      type: "umpire"
      setPersonDataList: React.Dispatch<React.SetStateAction<SelectUmpire[]>>
    })

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
    { label: "名前", value: name, setValue: setName },
    ...(type === "player"
      ? [
          { label: "ふりがな", value: furigana, setValue: setFurigana },
          { label: "ゼッケン番号", value: zekken, setValue: setZekken },
          { label: "QRコード", value: qr, setValue: setQr },
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
        const newPersonDataList: { players: SelectPlayer[] | SelectUmpire[] } = await getPlayerList()
        type === "player" && setPersonDataList(newPersonDataList.players as SelectPlayer[])
        type === "umpire" && setPersonDataList(newPersonDataList.players as SelectUmpire[])
        setPersonId(newPersonDataList.players[newPersonDataList.players.length - 1].id)
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
  const FormItem = ({
    label,
    value,
    setValue,
  }: {
    label: string
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
  }) => {
    return (
      <div>
        <label htmlFor={value} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type="text"
          id={value}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          className="mt-1 p-2 border border-gray-300 rounded-md"
        />
      </div>
    )
  }

  return (
    <div className=" flex justify-center">
      <form onSubmit={handleSubmit} className="space-y-4">
        <button type="submit" disabled={loading} className="btn btn-primary mx-auto m-3">
          {loading ? "登録中..." : "↓新規登録"}
        </button>
        {formItems.map((item, index) => (
          <FormItem key={index} label={item.label} value={item.value} setValue={item.setValue} />
        ))}
      </form>
    </div>
  )
}

export default PersonRegister
