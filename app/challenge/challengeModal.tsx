type ChallengeModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<number>>
  handleSubmit: () => void
  loading: boolean
  isSuccess: boolean
  message: string
  result1Point: number | null
  result2Point: number | null
}

export const ChallengeModal = ({
  setModalOpen,
  handleSubmit,
  loading,
  isSuccess,
  message,
  result1Point,
  result2Point,
}: ChallengeModalProps) => {
  const handleClick = () => {
    setModalOpen(0)
  }
  return (
    <dialog id="challenge-modal" className="modal modal-open" onClose={() => setModalOpen(0)}>
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
            <p>1回目: {result1Point}ポイント</p>
            {result2Point !== null && <p>2回目: {result2Point}ポイント</p>}
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
    </dialog>
  )
}

type RetryModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<number>>
  handleRetry: () => void
  result1Point: number | null
}

export const RetryModal = ({ setModalOpen, handleRetry, result1Point }: RetryModalProps) => {
  const thisHandleRetry = () => {
    handleRetry()
    setModalOpen(0)
  }
  return (
    <dialog id="retry-modal" className="modal modal-open" onClose={() => setModalOpen(0)}>
      <div className="modal-box">
        <p>1回目のポイントを保存して再チャレンジしますか?</p>
        <p>1回目: {result1Point}ポイント</p>
        <div className="modal-action">
          <button className="btn btn-accent" onClick={thisHandleRetry}>
            再チャレンジする
          </button>
          <button className="btn btn-accent" onClick={() => setModalOpen(0)}>
            戻る
          </button>
        </div>
      </div>
    </dialog>
  )
}

type CourseOutModalProps = {
  setModalOpen: React.Dispatch<React.SetStateAction<number>>
  setResult1: React.Dispatch<React.SetStateAction<number>>
  handleSubmit: () => void
  handleRetry: () => void
  loading: boolean
  isSuccess: boolean
  message: string
  result1Point: number | null
  result2Point: number | null
}

export const CourseOutModal = ({
  setModalOpen,
  handleSubmit,
  handleRetry,
  setResult1,
  loading,
  isSuccess,
  message,
  result1Point,
  result2Point,
}: CourseOutModalProps) => {
  const thisHandleRetry = () => {
    setResult1(0)
    handleRetry()
    setModalOpen(0)
  }
  return (
    <dialog id="course-out-modal" className="modal modal-open" onClose={() => setModalOpen(0)}>
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
            <p>コースアウトしました。</p>
            {result2Point === null && <p>1回目: 0ポイント</p>}
            {result2Point !== null && (
              <>
                <p>1回目: {result1Point}ポイント</p>
                <p>2回目: 0ポイント</p>
              </>
            )}
            <div className="modal-action flex-col">
              <button className="btn btn-accent mx-auto m-3" onClick={handleSubmit}>
                {loading ? <span className="loading loading-spinner"></span> : "結果送信"}
              </button>
              {result2Point === null && (
                <button className="btn btn-accent mx-auto m-3" onClick={thisHandleRetry} disabled={loading}>
                  再チャレンジする
                </button>
              )}
              <button className="btn btn-accent mx-auto m-3" onClick={() => setModalOpen(0)} disabled={loading}>
                チャレンジに戻る
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
