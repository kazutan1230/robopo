import { FieldState } from "@/app/components/course/util"
import { Panel } from "@/app/components/course/panel"
import { MAX_FIELD_WIDTH, MAX_FIELD_HEIGHT } from "@/app/components/course/util"

type FieldProps = {
    field: FieldState
    onPanelClick: (row: number, col: number) => void
}

// Fieldを表すコンポーネント
export const Field = ({ field, onPanelClick }: FieldProps) => {
    return (
        <div className={"grid grid-cols-" + MAX_FIELD_WIDTH + " grid-rows-" + MAX_FIELD_HEIGHT + " mx-auto"} style={{ width: MAX_FIELD_WIDTH * 50 + "px", height: MAX_FIELD_HEIGHT * 50 + "px" }}>
        {/* // <div className={"grid grid-cols-" + MAX_FIELD_WIDTH + " grid-rows-" + MAX_FIELD_HEIGHT} style={{ width: MAX_FIELD_WIDTH * 51 + 'px', height: MAX_FIELD_HEIGHT * 51 + 'px' }}>
        // <div className={"grid grid-cols-5 grid-rows-5"} style={{ width: 5.0 * 50 + 'px', height: 5.0 * 50 + 'px' }}> */}
        {field.map((row, rowIndex) =>
                row.map((panel, colIndex) => (
                    <Panel key={`${rowIndex}-${colIndex}`} value={panel} onClick={() => onPanelClick(rowIndex, colIndex)} />
                ))
            )}
        </div>
    )
}

export default Field