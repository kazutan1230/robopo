import React from "react"
import {
  MAX_FIELD_WIDTH,
  MAX_FIELD_HEIGHT,
  PANEL_WIDTH,
  PANEL_HEIGHT,
  FieldState,
  MissionValue,
} from "@/app/components/course/utils"
import { Panel } from "@/app/components/course/panel"
import { Robot } from "@/app/components/course/robot"
import { NextArrow } from "@/app/components/course/nextArrow"

type EditProps = {
  type: "edit"
  field: FieldState
  onPanelClick: (row: number, col: number) => void
}

type ChallengeProps = {
  type: "challenge"
  field: FieldState
  botPosition: { row: number; col: number }
  botDirection: MissionValue
  nextMissionPair: MissionValue[]
  onPanelClick: (row: number, col: number) => void
}

type Props = EditProps | ChallengeProps

// Fieldを表すコンポーネント
export const Field = (props: Props) => {
  return (
    <div
      className={"relative grid grid-cols-" + MAX_FIELD_WIDTH + " grid-rows-" + MAX_FIELD_HEIGHT + " mx-auto"}
      style={{ width: MAX_FIELD_WIDTH * PANEL_WIDTH + "px", height: MAX_FIELD_HEIGHT * PANEL_HEIGHT + "px" }}>
      {props.field.map((row, rowIndex) =>
        row.map((panel, colIndex) => (
          <Panel key={`${rowIndex}-${colIndex}`} value={panel} onClick={() => props.onPanelClick(rowIndex, colIndex)} />
        ))
      )}
      {/* challengeの時はbotを表示 */}
      {props.type === "challenge" && (
        <>
          <Robot row={props.botPosition.row} col={props.botPosition.col} direction={props.botDirection} />
          <NextArrow
            row={props.botPosition.row}
            col={props.botPosition.col}
            direction={props.botDirection}
            nextMissionPair={props.nextMissionPair}
            duration={1.5}
          />
        </>
      )}
    </div>
  )
}
export default Field
