import Link from "next/link"
import { useFormStatus } from "react-dom"
import {
  FieldState,
  MissionState,
  PointState,
  serializeField,
  serializeMission,
  serializePoint,
  checkValidity,
} from "@/app/components/course/utils"

type FinModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<number>>
}

type SaveModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<number>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  field: FieldState
  mission: MissionState
  point: PointState
}

type ValidationModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<number>>
  field: FieldState
  mission: MissionState
}

// 終了前に保存するかどうか聞くmodal
export const finModal = ({ setModalOpen }: FinModalProps) => {
  const handleYes = () => {
    setModalOpen(2)
  }

  const handleCancel = () => {
    setModalOpen(0)
  }
  return (
    <dialog id="fin-modal" className="modal modal-open" onClose={() => setModalOpen(0)}>
      <div className="modal-box">
        <p>保存しますか?保存していない編集内容は失われます。</p>
        <div className="modal-action">
          <button className="btn btn-accent" onClick={handleYes}>
            はい
          </button>
          <Link href="/course" className="btn">
            保存せず終わる
          </Link>
          <button className="btn" onClick={handleCancel}>
            キャンセル
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  )
}

// コースを保存するmodal
export const saveModal = ({ setModalOpen, name, setName, field, mission, point }: SaveModalProps) => {
  const handleClick = async () => {
    if (name.trim() === "") {
      alert("コース名を入力してください")
      return
    }

    const courseData = {
      name: name,
      field: serializeField(field),
      fieldValid: true,
      mission: serializeMission(mission),
      missionValid: true,
      point: serializePoint(point),
    }
    const res = await fetch("/api/course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    })
    if (res.ok) {
      // setSuccessOrNot("コースを保存しました")
      alert("コースを保存しました")
      setModalOpen(0)
    } else {
      // setSuccessOrNot("コースの保存に失敗しました")
      alert("コースの保存に失敗しました")
    }
  }

  const YesButton = () => {
    const { pending } = useFormStatus()

    return (
      <button
        type="button"
        className="btn btn-accent"
        disabled={pending}
        onClick={() => {
          handleClick()
        }}>
        {pending ? <span className="loading loading-spinner"></span> : "はい"}
      </button>
    )
  }

  const handleClickNo = () => {
    setModalOpen(0)
  }

  return (
    <dialog id="save-modal" className="modal modal-open">
      <div className="modal-box">
        <form>
          <label htmlFor="name" className="label">
            コース名(必須)
            <input
              type="text"
              placeholder="コース名"
              className="input input-bordered w-full max-w-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <p>保存しますか?</p>
          <div className="modal-action">
            <YesButton />
            <button className="btn" onClick={handleClickNo}>
              いいえ
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  )
}

// コースを検証した結果を表示するmodal
export const validationModal = ({ setModalOpen, field, mission }: ValidationModalProps) => {
  const check = checkValidity(field, mission)
  const handleYes = () => {
    setModalOpen(2)
  }

  const handleCancel = () => {
    setModalOpen(0)
  }
  return (
    <dialog id="validation-modal" className="modal modal-open" onClose={() => setModalOpen(0)}>
      <div className="modal-box">
        {check ? (
          <>
            <p>コースとミッションは有効です。</p>
            <p>保存しますか?保存していない編集内容は失われます。</p>
            <div className="modal-action">
              <button className="btn btn-accent" onClick={handleYes}>
                はい
              </button>
              <button className="btn" onClick={handleCancel}>
                編集に戻る
              </button>
            </div>
          </>
        ) : (
          <>
            <p>コースとミッションが有効ではありません。</p>
            <button className="btn" onClick={handleCancel}>
              閉じる
            </button>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  )
}
