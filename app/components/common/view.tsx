"use client"
import { useState, useEffect } from "react"
import type { SelectPlayer, SelectUmpire } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"
import { getUmpireList } from "@/app/components/common/utils"
import CommonList from "@/app/components/common/commonList"
import PersonRegister from "@/app/components/common/personRegister"

type PlayerProps = {
  type: "player"
  initialPersonDataList: { players: SelectPlayer[] }
}

type UmpireProps = {
  type: "umpire"
  initialPersonDataList: { umpires: SelectUmpire[] }
}

type ViewProps = PlayerProps | UmpireProps

export const View = ({ type, initialPersonDataList }: ViewProps) => {
  const [personId, setPersonId] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [personDataList, setPersonDataList] = useState<SelectPlayer[] | SelectUmpire[]>(
    type === "player" ? initialPersonDataList.players : initialPersonDataList.umpires
  )
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const personString = type === "player" ? "選手" : "採点者"

  useEffect(() => {
    setPersonDataList(personDataList)
  }, [personDataList])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const url = type === "player" ? "/api/player" : "/api/umpire"
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: personId }),
      })

      if (response.ok) {
        // 削除成功時の処理
        if (type === "player") {
          const newPlayerDataList: { players: SelectPlayer[] } = await getPlayerList()
          setPersonDataList(newPlayerDataList.players)
        } else if (type === "umpire") {
          const newUmpireDataList: { umpires: SelectUmpire[] } = await getUmpireList()
          setPersonDataList(newUmpireDataList.umpires)
        }
        setPersonId(null)
        setSuccessMessage(personString + "が正常に削除されました")
        setModalOpen(false)
      } else {
        setErrorMessage(personString + "を削除できませんでした")
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
          {successMessage ? successMessage : <p>選択した{personString}を削除しますか?</p>}
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
        <CommonList type={type} commonDataList={personDataList} commonId={personId} setCommonId={setPersonId} />
        {successMessage && <div className="text-green-500 font-semibold">{successMessage}</div>}

        {errorMessage && <div className="text-red-500 font-semibold">{errorMessage}</div>}

        <div className="flex w-fit">
          <p className="flex m-3">選択した{personString}を</p>
          <button
            type="button"
            className="flex btn btn-primary mx-auto m-3"
            disabled={personId === null}
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
          type={type}
          setPersonId={setPersonId}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          setPersonDataList={setPersonDataList as React.Dispatch<React.SetStateAction<SelectPlayer[] | SelectUmpire[]>>}
        />
      </div>

      {modalOpen && <DeleteModal />}
    </div>
  )
}
