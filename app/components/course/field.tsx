import { FieldState, MAX_FIELD_WIDTH, MAX_FIELD_HEIGHT, PANEL_WIDTH, PANEL_HEIGHT } from "@/app/components/course/utils"
import { Panel } from "@/app/components/course/panel"
import { Robot } from "@/app/components/course/robot"
import { useState } from "react"

type FieldProps = {
  field: FieldState
  isEdit: boolean
  onPanelClick: (row: number, col: number) => void
}

// Fieldを表すコンポーネント
export const Field = ({ field, isEdit, onPanelClick }: FieldProps) => {
  const [botPosition, setBotPosition] = useState({ row: 0, col: 0 })

  const handlePanelClick = (row: number, col: number) => {
    // Editモードでなければbotを動かす。
    if (!isEdit) {
      setBotPosition({ row, col })
    }
    onPanelClick(row, col)
  }
  return (
    <div
      className={"relative grid grid-cols-" + MAX_FIELD_WIDTH + " grid-rows-" + MAX_FIELD_HEIGHT + " mx-auto"}
      style={{ width: MAX_FIELD_WIDTH * PANEL_WIDTH + "px", height: MAX_FIELD_HEIGHT * PANEL_HEIGHT + "px" }}>
      {field.map((row, rowIndex) =>
        row.map((panel, colIndex) => (
          <Panel key={`${rowIndex}-${colIndex}`} value={panel} onClick={() => handlePanelClick(rowIndex, colIndex)} />
        ))
      )}
      {/* Editモードでなければbotを表示 */}
      {!isEdit && <Robot row={botPosition.row} col={botPosition.col} />}
    </div>
  )
}

export default Field
