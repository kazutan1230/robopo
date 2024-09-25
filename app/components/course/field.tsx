import { FieldState, MAX_FIELD_WIDTH, MAX_FIELD_HEIGHT, PANEL_WIDTH, PANEL_HEIGHT } from "@/app/components/course/utils"
import { Panel } from "@/app/components/course/panel"

type FieldProps = {
  field: FieldState
  onPanelClick: (row: number, col: number) => void
}

// Fieldを表すコンポーネント
export const Field = ({ field, onPanelClick }: FieldProps) => {
  return (
    <div
      className={"grid grid-cols-" + MAX_FIELD_WIDTH + " grid-rows-" + MAX_FIELD_HEIGHT + " mx-auto"}
      style={{ width: MAX_FIELD_WIDTH * PANEL_WIDTH + "px", height: MAX_FIELD_HEIGHT * PANEL_HEIGHT + "px" }}>
      {field.map((row, rowIndex) =>
        row.map((panel, colIndex) => (
          <Panel key={`${rowIndex}-${colIndex}`} value={panel} onClick={() => onPanelClick(rowIndex, colIndex)} />
        ))
      )}
    </div>
  )
}

export default Field
