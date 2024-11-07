"use client"
import { useState, useEffect } from "react"
import type { SelectPlayer, SelectUmpire } from "@/app/lib/db/schema"
import { getPlayerList } from "@/app/components/challenge/utils"
import { getUmpireList } from "@/app/components/common/utils"
import CommonList from "@/app/components/common/commonList"
import CommonRegister from "@/app/components/common/commonRegister"

type PlayerProps = {
  type: "player"
  initialCommonDataList: { players: SelectPlayer[] }
}

type UmpireProps = {
  type: "umpire"
  initialCommonDataList: { umpires: SelectUmpire[] }
}

type ViewProps = PlayerProps | UmpireProps

export const View = ({ type, initialCommonDataList }: ViewProps) => {
  const [commonId, setCommonId] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [commonDataList, setCommonDataList] = useState<SelectPlayer[] | SelectUmpire[]>(
    type === "player" ? initialCommonDataList.players : initialCommonDataList.umpires
  )
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const commonString = type === "player" ? "選手" : "採点者"

  useEffect(() => {
    setCommonDataList(commonDataList)
  }, [commonDataList])

  const handleDelete = async () => {
    try {
      setLoading(true)
      const url = type === "player" ? "/api/player" : "/api/umpire"
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: commonId }),
      })

      if (response.ok) {
        // 削除成功時の処理
        if (type === "player") {
          const newPlayerDataList: { players: SelectPlayer[] } = await getPlayerList()
          setCommonDataList(newPlayerDataList.players)
        } else if (type === "umpire") {
          const newUmpireDataList: { umpires: SelectUmpire[] } = await getUmpireList()
          setCommonDataList(newUmpireDataList.umpires)
        }
        setCommonId(null)
        setSuccessMessage(commonString + "が正常に削除されました")
        setModalOpen(false)
      } else {
        setErrorMessage(commonString + "を削除できませんでした")
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
          {successMessage ? successMessage : <p>選択した{commonString}を削除しますか?</p>}
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
        <CommonList type={type} commonDataList={commonDataList} commonId={commonId} setCommonId={setCommonId} />
        {successMessage && <div className="text-green-500 font-semibold">{successMessage}</div>}

        {errorMessage && <div className="text-red-500 font-semibold">{errorMessage}</div>}

        <div className="flex w-fit">
          <p className="flex m-3">選択した{commonString}を</p>
          <button
            type="button"
            className="flex btn btn-primary mx-auto m-3"
            disabled={commonId === null}
            onClick={() => {
              setSuccessMessage(null)
              setModalOpen(true)
            }}>
            削除
          </button>
        </div>
      </div>
      <div className="lg:w-1/3">
        <CommonRegister
          type={type}
          setCommonId={setCommonId}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          setCommonDataList={setCommonDataList as React.Dispatch<React.SetStateAction<SelectPlayer[] | SelectUmpire[]>>}
        />
      </div>

      {modalOpen && <DeleteModal />}
    </div>
  )
}
