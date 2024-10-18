"use client"

import { useState, useEffect } from "react"
import type { SelectPlayer } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"

type PlayerFormProps = {
  playerDataList: SelectPlayer[]
  setPlayerDataList: React.Dispatch<React.SetStateAction<SelectPlayer[]>>
  setStep: React.Dispatch<React.SetStateAction<number>>
  playerId: number | null
  setPlayerId: React.Dispatch<React.SetStateAction<number | null>>
}

const PlayerForm = ({ playerDataList, setPlayerDataList, setStep, playerId, setPlayerId }: PlayerFormProps) => {
  // 入力フィールドの状態を管理
  const [name, setName] = useState<string>("")
  const [furigana, setFurigana] = useState<string>("")
  const [zekken, setZekken] = useState<string>("")
  const [qr, setQr] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  // 初期データをセット
  useEffect(() => {
    setPlayerDataList(playerDataList)
  }, [playerDataList])

  // フォームの送信ハンドラ
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    const playerData = { name, furigana, zekken, qr }

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
        setFurigana("")
        setZekken("")
        setQr("")
        const newPlayerDataList: { players: SelectPlayer[] } = await getPlayerList()
        setPlayerDataList(newPlayerDataList.players)
        setPlayerId(newPlayerDataList.players[newPlayerDataList.players.length - 1].id)
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
    setPlayerId(Number(event.target.value))
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/player", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: playerId }),
      })

      if (response.ok) {
        const newPlayerDataList: { players: SelectPlayer[] } = await getPlayerList()
        setPlayerDataList(newPlayerDataList.players)
        setPlayerId(null)
        setSuccessMessage("プレイヤーが正常に削除されました")
        // alert("プレイヤーが正常に削除されました")
        setModalOpen(false)
      } else {
        setErrorMessage("プレイヤーを削除できませんでした")
      }
    } catch (error) {
      console.log("error: ", error)
    } finally {
      setLoading(false)
    }
  }
  const DeleteModal = () => {
    setSuccessMessage(null)
    const handleClick = () => {
      setModalOpen(false)
    }
    return (
      <dialog id="challenge-modal" className="modal modal-open" onClose={() => setModalOpen(false)}>
        <div className="modal-box">
          {successMessage ? successMessage : <p>選択したプレイヤーを削除しますか?</p>}
          {!successMessage && (
            <button className="btn btn-accent m-3" onClick={handleDelete} disabled={loading}>
              はい
            </button>
          )}
          <button className="btn btn-accent m-3" onClick={handleClick} disabled={loading}>
            チャレンジに戻る
          </button>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={handleClick}>
          <button className="cursor-default">close</button>
        </form>
      </dialog>
    )
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <span className="loading loading-spinner text-info"></span>
                  </td>
                </tr>
              ) : null}
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

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="btn btn-primary mx-auto"
          disabled={playerId === null}
          onClick={() => setStep(2)}>
          確認へ
        </button>
        <button
          type="button"
          className="btn btn-primary mx-auto"
          disabled={playerId === null}
          onClick={() => setModalOpen(true)}>
          削除
        </button>
      </div>

      {successMessage && <div className="text-green-500 font-semibold">{successMessage}</div>}

      {errorMessage && <div className="text-red-500 font-semibold">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 mt-4">
          {loading ? "登録中..." : "↓新規登録"}
        </button>
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
          <label htmlFor="furigana" className="block text-sm font-medium text-gray-700">
            ふりがな
          </label>
          <input
            type="text"
            id="furigana"
            value={furigana}
            onChange={(e) => setFurigana(e.target.value)}
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
      </form>

      <button type="button" className="btn btn-primary mx-auto m-5" onClick={() => setStep(0)}>
        戻る
      </button>

      {modalOpen && <DeleteModal />}
    </>
  )
}

export default PlayerForm
