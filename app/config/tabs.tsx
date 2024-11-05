"use client"
import { useState } from "react"
import CommonList from "@/app/components/common/commonList"
import type { SelectCompetition } from "@/app/lib/db/schema"

type commonListProps = {
  competitions: SelectCompetition[]
}

const useCompetitionList = (
  list: SelectCompetition[]
): [SelectCompetition[], React.Dispatch<React.SetStateAction<SelectCompetition[]>>] => {
  const [competitionList, setCompetitonList] = useState<SelectCompetition[]>(list)
  return [competitionList, setCompetitonList]
}

export const CompetitionListTab = (competitions: commonListProps): JSX.Element => {
  const [competitionId, setCompetitionId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const [competitionList, setCompetitionList] = useCompetitionList(competitions.competitions)
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleButtonClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const requestBody = {
      type: event.currentTarget.value,
    }

    const url = "/api/competition/" + competitionId
    try {
      setLoading(true)
      const response = await fetch(url, {
        method: "POST",
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
          <p>選択した大会を削除しますか?</p>

          <button className="btn btn-accent m-3" onClick={(e) => handleButtonClick(e)} disabled={loading}>
            はい
          </button>

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
        value="delete"
        disabled={competitionId === null || loading}
        onClick={() => setModalOpen(true)}>
        削除
      </button>
      {isSuccess && <p>{message}</p>}
      <p>{loading && <span className="loading loading-spinner"></span>}</p>
      {modalOpen && <DeleteModal />}
    </>
  )
}
