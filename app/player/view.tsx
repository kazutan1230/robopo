"use client"
import { useState, useEffect } from "react"
import type { SelectPlayer } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"
import PersonList from "@/app/components/common/personList"

type ViewProps = {
  initialPlayerDataList: { players: SelectPlayer[] }
}

export const View = ({ initialPlayerDataList }: ViewProps) => {
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [playerDataList, setPlayerDataList] = useState<SelectPlayer[]>(initialPlayerDataList.players)
  const [loading, setLoading] = useState(false)
  const [furigana, setFurigana] = useState("")
  const [zekken, setZekken] = useState("")
  const [qr, setQr] = useState("")
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  useEffect(() => {
    setPlayerDataList(playerDataList)
  }, [playerDataList])

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
            戻る
          </button>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={handleClick}>
          <button className="cursor-default">close</button>
        </form>
      </dialog>
    )
  }

  return (
    <div>
      <PersonList type="player" personDataList={playerDataList} personId={playerId} setPersonId={setPlayerId} />
      {successMessage && <div className="text-green-500 font-semibold">{successMessage}</div>}

      {errorMessage && <div className="text-red-500 font-semibold">{errorMessage}</div>}

      <div className="flex w-fit">
        <p className="flex m-3">選択したプレイヤーを</p>
        <button
          type="button"
          className="flex btn btn-primary mx-auto m-3"
          disabled={playerId === null}
          onClick={() => {
            setSuccessMessage(null)
            setModalOpen(true)
          }}>
          削除
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <button type="submit" disabled={loading} className="btn btn-primary mx-auto m-3">
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
            className="mt-1 p-2 border border-gray-300 rounded-md"
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
            className="mt-1 p-2 border border-gray-300 rounded-md"
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
            className="mt-1 p-2 border border-gray-300 rounded-md"
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
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
      </form>

      {modalOpen && <DeleteModal />}
    </div>
  )
}
