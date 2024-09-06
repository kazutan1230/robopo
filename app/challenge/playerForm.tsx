"use client"

import { useState } from "react"
import type { SelectPlayer } from "@/app/lib/db/schema"

type PlayerFormProps = {
  playerDataList: { players: SelectPlayer[] }
  setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function PlayerForm({ playerDataList, setStep }: PlayerFormProps) {
  // 入力フィールドの状態を管理
  const [name, setName] = useState<string>("")
  const [zekken, setZekken] = useState<string>("")
  const [qr, setQr] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null)

  // フォームの送信ハンドラ
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const playerData = { name, zekken, qr }

    try {
      // APIにPOSTリクエストを送信
      const response = await fetch("/api/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      })

      const result = await response.json()

      if (response.ok) {
        // 登録成功時の処理
        setSuccessMessage("プレイヤーが正常に登録されました")
        setName("")
        setZekken("")
        setQr("")
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

  const handlePlayerSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPlayerId = parseInt(event.target.value)
    setSelectedPlayerId(selectedPlayerId)
  }

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/player", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedPlayerId }),
      })
      const result = await response.json()
      console.log("result: ", result)
    } catch (error) {
      console.log("error: ", error)
    }
  }

  return (
    <>
      <div className="overflow-x-auto overflow-y-auto max-h-96 mt-8">
        <div className="grid grid-cols-2 gap-4">
          <h2 className="text-xl font-semibold mb-4">プレイヤー一覧</h2>
          <button type="button" className="btn btn-primary mx-auto" onClick={handleDelete}>
            削除
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="radio" disabled={true} />
                </label>
              </th>
              <th>ID</th>
              <th>名前</th>
              <th>ゼッケン番号</th>
              <th>QRコード</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <span className="loading loading-spinner text-info"></span>
                </td>
              </tr>
            ) : null}
            {playerDataList.players.length > 0 ? (
              playerDataList.players.map((player) => (
                <tr key={player.id} className="hover cursor-pointer" onClick={() => setSelectedPlayerId(player.id)}>
                  <th>
                    <label>
                      <input
                        type="radio"
                        name="selectedPlayer"
                        value={player.id}
                        checked={selectedPlayerId === player.id}
                        onChange={handlePlayerSelect}
                        className="h-4 w-4"
                      />
                    </label>
                  </th>
                  <td>{player.id}</td>
                  <td>{player.name}</td>
                  <td>{player.zekken}</td>
                  <td>{player.qr}</td>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="zekken" className="block text-sm font-medium text-gray-700">
            ゼッケン番号
          </label>
          <input
            type="text"
            id="zekken"
            value={zekken}
            onChange={(e) => setZekken(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <label htmlFor="qr" className="block text-sm font-medium text-gray-700">
            QRコード
          </label>
          <input
            type="text"
            id="qr"
            value={qr}
            onChange={(e) => setQr(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50">
            {loading ? "登録中..." : "登録"}
          </button>
        </div>

        {successMessage && <div className="text-green-500 font-semibold">{successMessage}</div>}

        {errorMessage && <div className="text-red-500 font-semibold">{errorMessage}</div>}
      </form>
      <button type="button" className="btn btn-primary mx-auto" onClick={() => setStep(0)}>
        戻る
      </button>
    </>
  )
}
