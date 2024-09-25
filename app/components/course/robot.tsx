import Image from "next/image"
import botImage from "@/public/robot.png"
import { PANEL_WIDTH, PANEL_HEIGHT } from "@/app/components/course/utils"

type RobotProps = {
  row: number
  col: number
}

export const Robot = ({ row, col }: RobotProps) => {
  const botStyle: React.CSSProperties = {
    position: "absolute",
    top: `${row * PANEL_HEIGHT}px`,
    left: `${col * PANEL_WIDTH}px`,
    height: `${PANEL_HEIGHT}px`,
    width: `${PANEL_WIDTH}px`,
    transition: "top 0.5s ease, left 0.5s ease",
  }

  return (
    <div style={botStyle}>
      <Image src={botImage} alt="bot" layout="fill" />
    </div>
  )
}
