type FailureModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleSubmit: () => void
  loading: boolean
  isSuccess: boolean
  message: string
}

const FailureModal = ({ setModalOpen, handleSubmit, loading, isSuccess, message }: FailureModalProps) => {
  const handleClick = () => {
    setModalOpen(false)
  }
  return (
    <dialog id="failure-modal" className="modal modal-open" onClose={() => setModalOpen(false)}>
      <div className="modal-box">
        {isSuccess ? (
          <>
            <p>{message}</p>
            <button className="btn btn-accent mx-auto text-2xl" onClick={() => window.location.reload()}>
              コース一覧に戻る
            </button>
          </>
        ) : (
          <>
            <p>結果を送信してチャレンジを終了しますか?</p>
            <div className="modal-action">
              <button className="btn btn-accent" onClick={handleSubmit}>
                {loading ? <span className="loading loading-spinner"></span> : "はい"}
              </button>
              <button className="btn btn-accent" onClick={handleClick} disabled={loading}>
                チャレンジに戻る
              </button>
            </div>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClick}>
        <button>close</button>
      </form>
    </dialog>
  )
}

export default FailureModal
