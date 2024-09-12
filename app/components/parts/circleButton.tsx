import React from "react"

type CircleButtonProps = {
  onClick: () => void
  classNameText?: string
  buttonText?: string // ボタンに表示するテキスト
}

const CircleButton: React.FC<CircleButtonProps> = ({ onClick, classNameText = "", buttonText }: CircleButtonProps) => {
  return (
    <div className="flex justify-center items-center">
      <button
        className={`rounded-full flex justify-center items-center font-bold relative ${classNameText}`}
        // className={`gradient-button w-${buttonSize} h-${buttonSize} rounded-full flex justify-center items-center ${buttonColor} text-${fontSize} ${textColor} font-bold relative`}
        onClick={onClick}>
        <span>{buttonText}</span>
      </button>
    </div>
  )
}

export default CircleButton
