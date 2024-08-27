import { useState } from "react"
import { useFormStatus } from "react-dom"
import { FieldState, serializeField } from "@/app/components/course/util"

type FinModalProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<number>>
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}

type SaveModalProps = {
    setModalOpen: React.Dispatch<React.SetStateAction<number>>
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
    name: string
    setName: React.Dispatch<React.SetStateAction<string>>
    field: FieldState
    // successOrNot: string | null
    // setSuccessOrNot: React.Dispatch<React.SetStateAction<string | null>>
}
 
  // 保存するかどうか聞くmodal
export const finModal = ({ setModalOpen, setIsEdit }: FinModalProps) => {
    const handleYes = () => {
        setModalOpen(2)
    }

    const handleNo = () => {
        setModalOpen(0)
        setIsEdit(false)
    }

    const handleCancel = () => {
        setModalOpen(0)
    }
    return (
        <dialog id="fin-modal"
        className="modal modal-open"
        onClose={() => setModalOpen(0)}
        >
            <div className="modal-box">
            <p>保存しますか?しない場合、編集内容は失われます。</p>
            <div className="modal-action">
                <button
                className="btn btn-accent"
                onClick={handleYes}
                >はい</button>
                <button
                className="btn"
                onClick={handleNo}
                >いいえ</button>
                <button
                className="btn"
                onClick={handleCancel}
                >キャンセル</button>
            </div>
            </div>
            <form method="dialog" className="modal-backdrop" onClick={handleCancel}>
            <button>close</button>
            </form>
        </dialog>
    )
}

// コースを保存するmodal
export const saveModal = ({ setModalOpen, setIsEdit, name, setName, field }: SaveModalProps) => {
    const handleClick = async () => {
        if (name.trim() === "") {
            alert("コース名を入力してください")
            return
        }

        const courseData = {
            name: name,
            field: serializeField(field),
            fieldValid: true,
            missionValid: true
        }
        const res = await fetch("/api/course/edit", {
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
            setIsEdit(false)
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
                onClick={() => {handleClick()}}
            >
                {pending ? <span className="loading loading-spinner"></span> : "はい"}
            </button>
        )
    }

    const handleClickNo = () => {
        setModalOpen(1)
    }

    return (
        <dialog id="save-modal" className="modal modal-open">
            <div className="modal-box">
                <form>
                    <label htmlFor="name" className="label">コース名(必須)
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
                        <button
                            className="btn"
                            onClick={handleClickNo}
                        >いいえ</button>
                    </div>
                </form>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    )
}