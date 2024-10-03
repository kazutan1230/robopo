import Image from "next/image"
import botImage from "@/public/robot.png"
import { PANEL_WIDTH, PANEL_HEIGHT, type MissionValue } from "@/app/components/course/utils"

type RobotProps = {
  row: number
  col: number
  direction: MissionValue
}

export const Robot = ({ row, col, direction }: RobotProps) => {
  const rotationAngle = (dir: MissionValue) => {
    switch (dir) {
      case "u":
        return "rotate(0deg)"
      case "r":
        return "rotate(90deg)"
      case "d":
        return "rotate(180deg)"
      case "l":
        return "rotate(-90deg)"
      default:
        return "rotate(0deg)"
    }
  }

  const botStyle: React.CSSProperties = {
    position: "absolute",
    top: `${row * PANEL_HEIGHT}px`,
    left: `${col * PANEL_WIDTH}px`,
    height: `${PANEL_HEIGHT}px`,
    width: `${PANEL_WIDTH}px`,
    transition: "top 0.5s ease, left 0.5s ease, transform 0.5s ease",
    transform: rotationAngle(direction),
    pointerEvents: "none",
  }

  return (
    <div style={botStyle}>
      <Image src={botImage} alt="bot" layout="fill" />
    </div>
  )
}
