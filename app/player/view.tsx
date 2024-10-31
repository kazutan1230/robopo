"use client"
import { useState, useEffect } from "react"
import type { SelectPlayer } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"
import PersonList from "@/app/components/common/personList"
import PersonRegister from "@/app/components/common/personRegister"

type ViewProps = {
  initialPlayerDataList: { players: SelectPlayer[] }
}

export const View = ({ initialPlayerDataList }: ViewProps) => {
  const [playerId, setPlayerId] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [playerDataList, setPlayerDataList] = useState<SelectPlayer[]>(initialPlayerDataList.players)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  useEffect(() => {
    setPlayerDataList(playerDataList)
  }, [playerDataList])

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
    <div className="lg:flex lg:flex-row">
      <div className="flex-col lg:w-2/3">
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
      </div>
      <div className="lg:w-1/3">
        <PersonRegister
          type="player"
          setPersonId={setPlayerId}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          setPersonDataList={setPlayerDataList}
        />
      </div>

      {modalOpen && <DeleteModal />}
    </div>
  )
}
