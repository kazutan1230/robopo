import React, { SetStateAction } from "react"

type StartButtonProps = {
  setStep: React.Dispatch<SetStateAction<number>>
}

export const StartButton: React.FC<StartButtonProps> = ({ setStep }: StartButtonProps) => {
  return (
    <div className="flex justify-center items-center h-96">
      <button
        className="gradient-button w-48 h-48 rounded-full flex justify-center items-center text-cyan-300 text-4xl font-bold relative"
        onClick={() => setStep(4)}>
        <span>スタート</span>
      </button>
    </div>
  )
}
