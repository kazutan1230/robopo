"use client"
import { useState } from "react"
import CommonList from "@/app/components/common/commonList"
import type { SelectCompetition, SelectPlayer, SelectUmpire } from "@/app/lib/db/schema"
import CommonRegister from "@/app/components/common/commonRegister"

type CompetitionListTabProps = {
  competitionList: SelectCompetition[]
  setCompetitionList: React.Dispatch<React.SetStateAction<SelectCompetition[]>>
}

type NewCompetitionTabProps = {
  setCompetitionList: React.Dispatch<React.SetStateAction<SelectCompetition[]>>
}

export const CompetitionListTab = ({ competitionList, setCompetitionList }: CompetitionListTabProps): JSX.Element => {
  const [competitionId, setCompetitionId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const type = event.currentTarget.value
    const requestBody =
      type === "delete"
        ? {
            type: type,
            id: competitionId,
          }
        : {
            type: type,
          }

    const url = type === "delete" ? "/api/competition/" : "/api/competition/" + competitionId
    try {
      setLoading(true)
      const response = await fetch(url, {
        method: type === "delete" ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      const { success, data, newList } = await response.json()

      console.log("data: ", data)
      console.log("newList: ", newList.competitions)
      if (response.ok) {
        setMessage("更新に成功しました")
        setIsSuccess(true)
        setCompetitionList(newList.competitions)
        setCompetitionId(null)
        setModalOpen(false)
      } else {
        setMessage("更新に失敗しました")
      }
    } catch (error) {
      console.log("error: ", error)
      setMessage("送信中にエラーが発生しました")
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
          {isSuccess ? <p>{message}</p> : <p>選択した大会を削除しますか?</p>}

          {!isSuccess && (
            <button
              className="btn btn-accent m-3"
              value="delete"
              onClick={(e) => handleButtonClick(e)}
              disabled={loading}>
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
    <>
      <CommonList
        type="competition"
        commonId={competitionId}
        setCommonId={setCompetitionId}
        commonDataList={competitionList}
      />
      <button
        className="btn btn-primary text-default max-w-fit m-1"
        value="open"
        disabled={
          competitionId === null || loading || competitionList.find((c) => c.id === competitionId)?.isOpen === true
        }
        onClick={(e) => handleButtonClick(e)}>
        開催
      </button>
      <button
        className="btn btn-primary text-default max-w-fit m-1"
        value="close"
        disabled={
          competitionId === null || loading || competitionList.find((c) => c.id === competitionId)?.isOpen === false
        }
        onClick={(e) => handleButtonClick(e)}>
        停止
      </button>
      <button
        className="btn btn-warning text-default max-w-fit m-1"
        disabled={competitionId === null || loading}
        onClick={() => {
          setIsSuccess(false)
          setModalOpen(true)
        }}>
        削除
      </button>
      {isSuccess && <p>{message}</p>}
      <p>{loading && <span className="loading loading-spinner"></span>}</p>
      {modalOpen && <DeleteModal />}
    </>
  )
}

export const NewCompetitionTab = ({ setCompetitionList }: NewCompetitionTabProps) => {
  const [commonId, setCommonId] = useState<number | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  return (
    <>
      <p>新しい大会を追加します</p>
      <CommonRegister
        type="competition"
        setCommonId={setCommonId}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
        setCommonDataList={
          setCompetitionList as React.Dispatch<
            React.SetStateAction<SelectPlayer[] | SelectUmpire[] | SelectCompetition[]>
          >
        }
      />
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </>
  )
}
